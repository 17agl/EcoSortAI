"""
EcoSort AI — Backend AI Integration Bridge
==========================================
Calls predict.py and annotates each detection with full recycling metadata.
"""

import sys
from pathlib import Path

_AI_DIR = Path(__file__).resolve().parents[1] / "ai" / "object_detection"
if str(_AI_DIR) not in sys.path:
    sys.path.insert(0, str(_AI_DIR))

from predict import predict as yolo_predict   # noqa: E402


# ============================================================
# FULL RECYCLING RULES  (all 10 classes)
# ============================================================

RECYCLING_RULES = {

    "plastic": {
        "action"       : "RECYCLE",
        "instruction"  : "Clean and dry the plastic item, then place it in the recyclable-plastic collection. Check the recycling number (♳–♷) if visible.",
        "reason"       : "Clean plastic containers can often be recycled. Recycling 1 tonne of plastic saves 5,774 kWh of energy.",
        "recyclable"   : True,
        "reusable"     : False,
        "decompose_time": "20–500 years (landfill)",
    },

    "glass": {
        "action"       : "RECYCLE",
        "instruction"  : "Empty and rinse the glass item. Separate by colour if required (clear, green, brown). Place in glass bank or kerbside glass bin.",
        "reason"       : "Glass is 100% recyclable indefinitely without quality loss. Saves 315 kg of CO₂ per tonne recycled.",
        "recyclable"   : True,
        "reusable"     : True,
        "decompose_time": "1 million+ years (landfill)",
    },

    "metal": {
        "action"       : "RECYCLE",
        "instruction"  : "Empty and rinse the metal item. Aluminium cans, steel tins, and scrap metal are all accepted in metal recycling bins.",
        "reason"       : "Metal is infinitely recyclable. Recycling aluminium saves 95% of the energy needed to produce new aluminium.",
        "recyclable"   : True,
        "reusable"     : False,
        "decompose_time": "50–200 years (landfill)",
    },

    "paper_cardboard": {
        "action"       : "RECYCLE",
        "instruction"  : "Keep paper/cardboard dry and clean. Flatten boxes to save space. Remove tape and staples if possible.",
        "reason"       : "Recycling 1 tonne of cardboard saves 17 trees and 26,000 litres of water.",
        "recyclable"   : True,
        "reusable"     : False,
        "decompose_time": "2–6 weeks (compost) / 2–5 months (landfill)",
    },

    "food_container": {
        "action"       : "COMPOST OR LANDFILL",
        "instruction"  : "Rinse container. Compostable materials go to green bin. Heavily soiled non-compostable containers go to general waste.",
        "reason"       : "Food-soiled containers cannot be recycled — contamination degrades paper fibres and plastic batches.",
        "recyclable"   : False,
        "reusable"     : False,
        "decompose_time": "5–50 years depending on material",
    },

    "battery": {
        "action"       : "HAZARDOUS WASTE — BATTERY DROP-OFF",
        "instruction"  : "Do NOT put batteries in household recycling or general waste. Take to a designated battery-collection point (supermarkets, electronics stores).",
        "reason"       : "Batteries contain lead, cadmium, and lithium — toxic to soil and water, and a fire risk in recycling trucks.",
        "recyclable"   : True,
        "reusable"     : False,
        "decompose_time": "100+ years (toxic leaching)",
    },

    "electronics": {
        "action"       : "E-WASTE RECYCLING",
        "instruction"  : "Take to an authorised e-waste recycling centre or manufacturer take-back programme. Never bin screens, phones, or cables.",
        "reason"       : "Electronics contain gold, silver, copper, and toxic substances that must be recovered or safely contained.",
        "recyclable"   : True,
        "reusable"     : True,
        "decompose_time": "Centuries (toxic leaching)",
    },

    "organic_waste": {
        "action"       : "ORGANIC COMPOST",
        "instruction"  : "Place in green organic waste bin or home compost pit. Avoid adding meat and dairy to home compost.",
        "reason"       : "Composting organic waste produces nutrient-rich fertiliser and reduces methane from landfill decomposition.",
        "recyclable"   : True,
        "reusable"     : True,
        "decompose_time": "1–4 months (composted)",
    },

    "hazardous_waste": {
        "action"       : "HAZARDOUS WASTE — SPECIAL DISPOSAL",
        "instruction"  : "Hand over to municipal chemical waste depot. Do NOT pour down the drain or mix with general waste.",
        "reason"       : "Hazardous materials (paints, solvents, medicines) require specialised containment to prevent soil and water contamination.",
        "recyclable"   : False,
        "reusable"     : False,
        "decompose_time": "Centuries (toxic threat)",
    },

    "unknown": {
        "action"       : "GENERAL WASTE",
        "instruction"  : "The item could not be confidently identified. Place in general waste or consult your local waste authority.",
        "reason"       : "Unable to determine material type. When in doubt, general waste prevents recycling contamination.",
        "recyclable"   : False,
        "reusable"     : False,
        "decompose_time": "Unknown",
    },
}


# ============================================================
# PUBLIC FUNCTION
# ============================================================

def run_ai_predict(image_path) -> list:
    """
    Run YOLO inference, map each detection to recycling rules,
    and return the full enriched detection list.
    """
    raw = yolo_predict(image_path)

    formatted = []

    for det in raw:
        class_name = det.get("class_name", "unknown")
        rule       = RECYCLING_RULES.get(class_name, RECYCLING_RULES["unknown"])

        formatted.append({
            # Detection fields
            "class_name"    : class_name,
            "confidence"    : det["confidence"],           # REAL value — no inflation
            "raw_confidence": det.get("raw_confidence", det["confidence"]),
            "bbox"          : det.get("bbox", [50.0, 50.0, 590.0, 590.0]),
            "img_dimensions": det.get("img_dimensions", [640, 640]),
            "contamination" : det.get("contamination", {
                "status": "Clean & Dry ✨", "level": "Clean",
                "instruction": "Item approved for recycling!", "is_clean": True,
            }),

            # Recycling rule fields
            "action"        : rule["action"],
            "instruction"   : rule["instruction"],
            "reason"        : rule["reason"],
            "recyclable"    : rule["recyclable"],
            "reusable"      : rule["reusable"],
            "decompose_time": rule["decompose_time"],
        })

    return formatted
