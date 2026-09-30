from pathlib import Path
import uuid

from fastapi import FastAPI, File, UploadFile, Header
from fastapi.middleware.cors import CORSMiddleware
from passlib.context import CryptContext

from database import (
    create_tables,
    create_user,
    get_user_by_email,
    create_scan,
    get_all_scans,
    get_scan_by_id
)


# ============================================================
# APP
# ============================================================

app = FastAPI(
    title="EcoSort AI API",
    description="AI-powered waste classification and recycling assistant",
    version="1.0.0"
)


# ============================================================
# CORS
# ============================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============================================================
# DIRECTORIES
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

UPLOAD_DIR = BASE_DIR / "uploads"

UPLOAD_DIR.mkdir(
    exist_ok=True
)


# ============================================================
# MOCK AI
# ============================================================

MOCK_AI_ENABLED = True

# ============================================================
# PASSWORD HASHING
# ============================================================

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)

# ============================================================
# RECYCLING RULES
# ============================================================

RECYCLING_RULES = {

    "plastic": {
        "action": "RECYCLE",

        "instruction":
            "Clean and dry the plastic item, "
            "then place it in the recyclable-plastic collection.",

        "reason":
            "Clean plastic containers can often be "
            "recycled when accepted by the local recycling system."
    },

    "glass": {
        "action": "RECYCLE",

        "instruction":
            "Empty and rinse the glass item, "
            "then place it in the glass recycling stream.",

        "reason":
            "Glass is commonly recyclable when separated "
            "from contamination and non-glass materials."
    },

    "metal": {
        "action": "RECYCLE",

        "instruction":
            "Empty and rinse the metal item, "
            "then place it with recyclable metals.",

        "reason":
            "Metal containers are commonly recyclable "
            "when clean and separated properly."
    },

    "paper_cardboard": {
        "action": "RECYCLE",

        "instruction":
            "Keep the paper or cardboard dry and clean, "
            "flatten it if possible, and place it with paper recycling.",

        "reason":
            "Clean and dry paper or cardboard is commonly recyclable."
    }
}


# ============================================================
# STARTUP
# ============================================================

@app.on_event("startup")
def startup_event():

    create_tables()


# ============================================================
# ROOT
# ============================================================

@app.get("/")
def root():

    return {
        "status": "online",
        "message": "EcoSort AI API is running",
        "mode": "mock_ai"
    }


# ============================================================
# MODEL INFO
# ============================================================

@app.get("/model-info")
def model_info():

    return {

        "mode":
            "mock_ai" if MOCK_AI_ENABLED else "real_ai",

        "model":
            "Mock AI",

        "classes": {
            "0": "plastic",
            "1": "glass",
            "2": "metal",
            "3": "paper_cardboard"
        },

        "confidence_threshold": 0.50
    }

# ============================================================
# REGISTER
# ============================================================

@app.post("/register")
def register(
    name: str,
    email: str,
    password: str
):

    # --------------------------------------------------------
    # Basic validation
    # --------------------------------------------------------

    name = name.strip()
    email = email.strip().lower()


    if not name:

        return {
            "status": "error",
            "message": "Name is required."
        }


    if not email:

        return {
            "status": "error",
            "message": "Email is required."
        }


    if len(password) < 6:

        return {
            "status": "error",
            "message":
                "Password must contain at least 6 characters."
        }


    # --------------------------------------------------------
    # Check existing user
    # --------------------------------------------------------

    existing_user = get_user_by_email(
        email
    )


    if existing_user:

        return {
            "status": "error",
            "message":
                "An account with this email already exists."
        }


    # --------------------------------------------------------
    # Hash password
    # --------------------------------------------------------

    password_hash = pwd_context.hash(
        password
    )


    # --------------------------------------------------------
    # Create user
    # --------------------------------------------------------

    user_id, created_at = create_user(

        name=name,

        email=email,

        password_hash=password_hash
    )


    return {

        "status":
            "success",

        "message":
            "Account created successfully.",

        "user": {

            "id":
                user_id,

            "name":
                name,

            "email":
                email,

            "created_at":
                created_at
        }
    }

#============================================================
# login
#============================================================

@app.post("/login")
def login(email: str, password: str):
    email = email.strip().lower()

    user = get_user_by_email(email)

    if not user:
        return {
            "status": "error",
            "message": "Invalid email or password."
        }

    if not pwd_context.verify(password, user["password_hash"]):
        return {
            "status": "error",
            "message": "Invalid email or password."
        }

    return {
        "status": "success",
        "message": "Login successful.",
        "user": {
            "id": user["id"],
            "name": user["name"],
            "email": user["email"],
            "created_at": user["created_at"]
        }
    }

# ============================================================
# PREDICT
# ============================================================

@app.post("/predict")
async def predict(
    file: UploadFile = File(...),
    user_id: int = Header(..., alias="X-User-ID")
):
    # --------------------------------------------------------
    # Validate filename
    # --------------------------------------------------------

    if not file.filename:

        return {
            "status": "error",
            "message": "No file was provided."
        }


    # --------------------------------------------------------
    # Validate image
    # --------------------------------------------------------

    allowed_types = {
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/jpg"
    }

    if file.content_type not in allowed_types:

        return {
            "status": "error",
            "message":
                "Please upload a JPG, JPEG, PNG or WEBP image."
        }


    # --------------------------------------------------------
    # Save temporary file
    # --------------------------------------------------------

    extension = Path(
        file.filename
    ).suffix

    filename = (
        f"{uuid.uuid4()}{extension}"
    )

    file_path = (
        UPLOAD_DIR / filename
    )

    file_bytes = await file.read()

    with open(
        file_path,
        "wb"
    ) as buffer:

        buffer.write(file_bytes)


    # ========================================================
    # MOCK AI
    # ========================================================

    if MOCK_AI_ENABLED:

        class_name = "plastic"

        confidence = 0.94

        rule = RECYCLING_RULES[
            class_name
        ]


        detection = {

            "class_name":
                class_name,

            "confidence":
                confidence,

            "action":
                rule["action"],

            "instruction":
                rule["instruction"],

            "reason":
                rule["reason"]
        }


        # ----------------------------------------------------
        # SAVE SCAN TO SQLITE
        # ----------------------------------------------------

        scan_id, created_at = create_scan(
            user_id=user_id,
            filename=file.filename,
            class_name=class_name,
            confidence=confidence,
            action=rule["action"],
            instruction=rule["instruction"],
            reason=rule["reason"],
            mode="mock_ai"
        )


        # ----------------------------------------------------
        # Delete temporary image
        # ----------------------------------------------------

        try:

            file_path.unlink()

        except Exception:

            pass


        # ----------------------------------------------------
        # Return result
        # ----------------------------------------------------

        return {

            "status":
                "success",

            "mode":
                "mock_ai",

            "scan_id":
                scan_id,

            "message":
                "Mock AI prediction generated successfully.",

            "detections": [
                detection
            ],

            "created_at":
                created_at
        }


    # ========================================================
    # REAL AI WILL BE CONNECTED LATER
    # ========================================================

    try:

        file_path.unlink()

    except Exception:

        pass


    return {

        "status":
            "no_reliable_detection",

        "mode":
            "real_ai",

        "detections": [],

        "message":
            "No reliable waste item detected."
    }


# ============================================================
# HISTORY
# ============================================================

@app.get("/history")
def get_history(
    user_id: int = Header(..., alias="X-User-ID")
):
    rows = get_all_scans(user_id)

    results = []

    for scan in rows:
        results.append({
            "id": scan["id"],
            "filename": scan["filename"],
            "class_name": scan["class_name"],
            "confidence": scan["confidence"],
            "action": scan["action"],
            "instruction": scan["instruction"],
            "reason": scan["reason"],
            "mode": scan["mode"],
            "created_at": scan["created_at"]
        })

    return {
        "status": "success",
        "count": len(results),
        "history": results
    }


# ============================================================
# GET SINGLE SCAN
# ============================================================

@app.get("/history/{scan_id}")
def get_scan(
    scan_id: int,
    user_id: int = Header(..., alias="X-User-ID")
):
    scan = get_scan_by_id(
        scan_id,
        user_id
    )

    if not scan:
        return {
            "status": "error",
            "message": "Scan not found."
        }

    return {
        "status": "success",
        "scan": {
            "id": scan["id"],
            "filename": scan["filename"],
            "class_name": scan["class_name"],
            "confidence": scan["confidence"],
            "action": scan["action"],
            "instruction": scan["instruction"],
            "reason": scan["reason"],
            "mode": scan["mode"],
            "created_at": scan["created_at"]
        }
    }