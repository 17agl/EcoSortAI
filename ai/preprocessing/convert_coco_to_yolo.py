import json
import shutil
from pathlib import Path
from collections import Counter


# ============================================================
# PROJECT PATHS
# ============================================================

PROJECT_ROOT = Path(__file__).resolve().parents[2]

ANNOTATION_FILE = (
    PROJECT_ROOT
    / "datasets"
    / "raw"
    / "taco"
    / "data"
    / "annotations.json"
)

IMAGE_ROOT = (
    PROJECT_ROOT
    / "datasets"
    / "raw"
    / "taco"
    / "data"
)

OUTPUT_ROOT = (
    PROJECT_ROOT
    / "datasets"
    / "processed"
    / "converted"
)

OUTPUT_IMAGES = OUTPUT_ROOT / "images"
OUTPUT_LABELS = OUTPUT_ROOT / "labels"


# ============================================================
# ECOSORT CLASSES
# ============================================================

ECOSORT_CLASSES = {
    0: "plastic",
    1: "glass",
    2: "metal",
    3: "paper_cardboard",
    4: "food_container",
    5: "battery",
    6: "electronics"
}


# ============================================================
# CATEGORY MAPPING
# ============================================================

def map_category(category_name):

    name = category_name.lower().strip()


    # ---------------- PLASTIC ----------------

    plastic_keywords = [
        "plastic",
        "polypropylene",
        "polystyrene",
        "polystyrene",
        "squeezable tube",
        "plastic straw",
        "plastic bag",
        "plastic bottle",
        "plastic film",
        "plastic wrapper",
        "garbage bag",
        "single-use carrier bag",
        "six pack rings"
    ]

    for keyword in plastic_keywords:

        if keyword in name:
            return 0


    # ---------------- GLASS ----------------

    glass_keywords = [
        "glass",
        "glass bottle",
        "glass jar"
    ]

    for keyword in glass_keywords:

        if keyword in name:
            return 1


    # ---------------- METAL ----------------

    metal_keywords = [
        "metal",
        "aluminium",
        "aluminum",
        "steel",
        "tin",
        "foil",
        "can",
        "metal lid",
        "metal bottle cap",
        "scrap metal"
    ]

    for keyword in metal_keywords:

        if keyword in name:
            return 2


    # ---------------- PAPER / CARDBOARD ----------------

    paper_keywords = [
        "paper",
        "cardboard",
        "carton",
        "paper bag",
        "paper straw",
        "wrapping paper",
        "newspaper",
        "magazine"
    ]

    for keyword in paper_keywords:

        if keyword in name:
            return 3


    # ---------------- FOOD CONTAINER ----------------

    food_container_keywords = [
        "food container",
        "food packaging",
        "food tray",
        "takeaway container",
        "disposable food container",
        "foam food container"
    ]

    for keyword in food_container_keywords:

        if keyword in name:
            return 4


    # ---------------- BATTERY ----------------

    if "battery" in name:
        return 5


    # ---------------- ELECTRONICS ----------------

    electronics_keywords = [
        "electronic",
        "electronics",
        "mobile phone",
        "phone",
        "laptop",
        "computer",
        "keyboard",
        "mouse",
        "remote"
    ]

    for keyword in electronics_keywords:

        if keyword in name:
            return 6


    # Category is not useful for our current EcoSort classes
    return None


# ============================================================
# FIND IMAGE
# ============================================================

def find_image(file_name):

    # First try the exact path
    direct_path = IMAGE_ROOT / file_name

    if direct_path.exists():
        return direct_path


    # TACO may store images inside batch folders.
    # Search by filename.
    matches = list(IMAGE_ROOT.rglob(Path(file_name).name))

    if matches:
        return matches[0]


    return None


# ============================================================
# COCO BBOX → YOLO BBOX
# ============================================================

def convert_bbox(bbox, image_width, image_height):

    x, y, width, height = bbox

    # COCO:
    # x = left
    # y = top
    # width = box width
    # height = box height

    x_center = x + width / 2
    y_center = y + height / 2


    # Normalize to 0–1

    x_center = x_center / image_width
    y_center = y_center / image_height

    width = width / image_width
    height = height / image_height


    return (
        x_center,
        y_center,
        width,
        height
    )


# ============================================================
# MAIN CONVERTER
# ============================================================

def main():

    print()
    print("=" * 60)
    print("EcoSort AI - COCO to YOLO Converter")
    print("=" * 60)
    print()


    # Check annotation file

    if not ANNOTATION_FILE.exists():

        print("ERROR: annotations.json not found.")

        print()
        print("Expected:")
        print(ANNOTATION_FILE)

        return


    # Create output folders. A previous run or manual setup may have left
    # zero-byte files named "images" or "labels" where these directories
    # need to be. Remove only those empty conflicting files; preserve any
    # non-empty file and report it clearly.
    for output_dir in (OUTPUT_IMAGES, OUTPUT_LABELS):
        if output_dir.exists() and not output_dir.is_dir():
            if output_dir.is_file() and output_dir.stat().st_size == 0:
                output_dir.unlink()
            else:
                raise NotADirectoryError(
                    f"Cannot create output directory because a file already "
                    f"exists at {output_dir}. Move or rename that file, then "
                    f"run the converter again."
                )

        output_dir.mkdir(parents=True, exist_ok=True)


    # Load COCO annotations

    print("Loading annotations...")

    with open(
        ANNOTATION_FILE,
        "r",
        encoding="utf-8"
    ) as file:

        coco = json.load(file)


    images = coco.get("images", [])
    annotations = coco.get("annotations", [])
    categories = coco.get("categories", [])


    print(f"Images in annotations: {len(images)}")
    print(f"Annotations: {len(annotations)}")
    print(f"Categories: {len(categories)}")


    # ========================================================
    # CATEGORY MAPPING
    # ========================================================

    category_to_class = {}

    print()
    print("Category mapping:")
    print("-" * 60)


    for category in categories:

        category_id = category["id"]
        category_name = category["name"]

        class_id = map_category(category_name)

        category_to_class[category_id] = class_id

        if class_id is not None:

            print(
                f"{category_name:<35} -> "
                f"{ECOSORT_CLASSES[class_id]}"
            )


    # ========================================================
    # IMAGE LOOKUP
    # ========================================================

    image_lookup = {
        image["id"]: image
        for image in images
    }


    # ========================================================
    # GROUP ANNOTATIONS BY IMAGE
    # ========================================================

    annotations_by_image = {}

    for annotation in annotations:

        image_id = annotation["image_id"]

        if image_id not in annotations_by_image:

            annotations_by_image[image_id] = []

        annotations_by_image[image_id].append(
            annotation
        )


    # ========================================================
    # CONVERSION
    # ========================================================

    converted_images = 0
    converted_boxes = 0
    skipped_images = 0
    missing_images = 0

    class_counter = Counter()


    print()
    print("Converting images...")
    print("-" * 60)


    for image_id, image_info in image_lookup.items():

        file_name = image_info["file_name"]

        image_width = image_info["width"]
        image_height = image_info["height"]


        # Find actual downloaded image

        source_image = find_image(file_name)


        if source_image is None:

            print(
                f"Image not found: {file_name}"
            )

            missing_images += 1

            continue


        image_annotations = (
            annotations_by_image.get(
                image_id,
                []
            )
        )


        yolo_lines = []


        for annotation in image_annotations:

            category_id = annotation["category_id"]

            class_id = category_to_class.get(
                category_id
            )


            # Ignore categories that aren't
            # part of EcoSort

            if class_id is None:
                continue


            bbox = annotation.get("bbox")


            if not bbox or len(bbox) != 4:
                continue


            x, y, width, height = bbox


            # Ignore invalid boxes

            if width <= 0 or height <= 0:
                continue


            x_center, y_center, box_width, box_height = (
                convert_bbox(
                    bbox,
                    image_width,
                    image_height
                )
            )


            # Keep values within valid range

            x_center = max(
                0,
                min(1, x_center)
            )

            y_center = max(
                0,
                min(1, y_center)
            )

            box_width = max(
                0,
                min(1, box_width)
            )

            box_height = max(
                0,
                min(1, box_height)
            )


            line = (
                f"{class_id} "
                f"{x_center:.6f} "
                f"{y_center:.6f} "
                f"{box_width:.6f} "
                f"{box_height:.6f}"
            )


            yolo_lines.append(line)

            converted_boxes += 1

            class_counter[
                ECOSORT_CLASSES[class_id]
            ] += 1


        # Only save images containing
        # at least one EcoSort object

        if not yolo_lines:

            skipped_images += 1

            continue


        # Create unique filename
        # image ID prevents collisions

        original_name = Path(file_name).name

        output_name = (
            f"{image_id}_{original_name}"
        )


        destination_image = (
            OUTPUT_IMAGES
            / output_name
        )


        destination_label = (
            OUTPUT_LABELS
            / f"{image_id}_{Path(original_name).stem}.txt"
        )


        # Copy image

        shutil.copy2(
            source_image,
            destination_image
        )


        # Write YOLO labels

        with open(
            destination_label,
            "w",
            encoding="utf-8"
        ) as file:

            file.write(
                "\n".join(yolo_lines)
            )


        converted_images += 1


    # ========================================================
    # RESULTS
    # ========================================================

    print()
    print("=" * 60)
    print("CONVERSION COMPLETE")
    print("=" * 60)

    print(
        f"Images converted: {converted_images}"
    )

    print(
        f"Bounding boxes converted: {converted_boxes}"
    )

    print(
        f"Images skipped: {skipped_images}"
    )

    print(
        f"Images missing: {missing_images}"
    )


    print()
    print("Class distribution:")
    print("-" * 40)


    for class_id, class_name in ECOSORT_CLASSES.items():

        print(
            f"{class_name:<20}: "
            f"{class_counter[class_name]}"
        )


    print()
    print("Output images:")
    print(OUTPUT_IMAGES)

    print()
    print("Output labels:")
    print(OUTPUT_LABELS)


if __name__ == "__main__":
    main()
