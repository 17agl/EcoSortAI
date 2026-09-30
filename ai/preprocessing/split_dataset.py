import random
import shutil
from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]

SOURCE_IMAGES = (
    PROJECT_ROOT
    / "datasets"
    / "processed"
    / "converted"
    / "images"
)

SOURCE_LABELS = (
    PROJECT_ROOT
    / "datasets"
    / "processed"
    / "converted"
    / "labels"
)

OUTPUT_ROOT = (
    PROJECT_ROOT
    / "datasets"
    / "processed"
    / "ecosort_yolo"
)


IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".bmp",
    ".webp"
}


TRAIN_RATIO = 0.70
VAL_RATIO = 0.20
TEST_RATIO = 0.10

RANDOM_SEED = 42


def create_directories():

    for split in ["train", "val", "test"]:

        (
            OUTPUT_ROOT
            / "images"
            / split
        ).mkdir(
            parents=True,
            exist_ok=True
        )

        (
            OUTPUT_ROOT
            / "labels"
            / split
        ).mkdir(
            parents=True,
            exist_ok=True
        )


def get_image_files():

    images = []

    for path in SOURCE_IMAGES.iterdir():

        if (
            path.is_file()
            and path.suffix.lower()
            in IMAGE_EXTENSIONS
        ):

            images.append(path)

    return images


def main():

    print()
    print("=" * 55)
    print("EcoSort AI - Dataset Split")
    print("=" * 55)


    if not SOURCE_IMAGES.exists():

        print()
        print("ERROR: Source images folder not found.")

        print(SOURCE_IMAGES)

        return


    if not SOURCE_LABELS.exists():

        print()
        print("ERROR: Source labels folder not found.")

        print(SOURCE_LABELS)

        return


    create_directories()


    images = get_image_files()


    print()
    print(
        f"Images available: {len(images)}"
    )


    if not images:

        print("No images found.")

        return


    # Make sure every image has a label

    valid_pairs = []

    for image in images:

        label = (
            SOURCE_LABELS
            / f"{image.stem}.txt"
        )

        if label.exists():

            valid_pairs.append(
                (image, label)
            )

        else:

            print(
                f"Warning: label missing for "
                f"{image.name}"
            )


    print(
        f"Valid image-label pairs: "
        f"{len(valid_pairs)}"
    )


    # Shuffle reproducibly

    random.seed(RANDOM_SEED)

    random.shuffle(valid_pairs)


    total = len(valid_pairs)


    train_end = int(
        total * TRAIN_RATIO
    )

    val_end = train_end + int(
        total * VAL_RATIO
    )


    train_data = (
        valid_pairs[:train_end]
    )

    val_data = (
        valid_pairs[train_end:val_end]
    )

    test_data = (
        valid_pairs[val_end:]
    )


    splits = {
        "train": train_data,
        "val": val_data,
        "test": test_data
    }


    print()
    print("Split sizes:")
    print("-" * 30)

    for split, data in splits.items():

        print(
            f"{split:<10}: {len(data)}"
        )


    # Copy files

    for split, data in splits.items():

        image_destination = (
            OUTPUT_ROOT
            / "images"
            / split
        )

        label_destination = (
            OUTPUT_ROOT
            / "labels"
            / split
        )


        for image, label in data:

            shutil.copy2(
                image,
                image_destination
                / image.name
            )

            shutil.copy2(
                label,
                label_destination
                / label.name
            )


    print()
    print("=" * 55)
    print("DATASET SPLIT COMPLETE")
    print("=" * 55)

    print()
    print(
        f"Train: {len(train_data)} images"
    )

    print(
        f"Validation: {len(val_data)} images"
    )

    print(
        f"Test: {len(test_data)} images"
    )

    print()
    print("Output:")
    print(OUTPUT_ROOT)


if __name__ == "__main__":
    main()