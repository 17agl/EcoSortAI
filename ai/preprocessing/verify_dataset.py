from pathlib import Path


PROJECT_ROOT = Path(__file__).resolve().parents[2]

DATASET_ROOT = (
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


NUMBER_OF_CLASSES = 7


def get_images(folder):

    if not folder.exists():
        return []

    return [
        file
        for file in folder.iterdir()
        if file.is_file()
        and file.suffix.lower() in IMAGE_EXTENSIONS
    ]


def validate_label(label_file):

    errors = []

    try:

        with open(
            label_file,
            "r",
            encoding="utf-8"
        ) as file:

            lines = file.readlines()

    except Exception as error:

        return [
            f"Could not read file: {error}"
        ]


    for line_number, line in enumerate(
        lines,
        start=1
    ):

        parts = line.strip().split()


        if len(parts) != 5:

            errors.append(
                f"Line {line_number}: "
                f"expected 5 values, "
                f"got {len(parts)}"
            )

            continue


        try:

            class_id = int(parts[0])

            x_center = float(parts[1])
            y_center = float(parts[2])
            width = float(parts[3])
            height = float(parts[4])

        except ValueError:

            errors.append(
                f"Line {line_number}: "
                f"contains non-numeric values"
            )

            continue


        # Check class ID

        if not (
            0 <= class_id < NUMBER_OF_CLASSES
        ):

            errors.append(
                f"Line {line_number}: "
                f"invalid class ID {class_id}"
            )


        # Check bounding box values

        values = [
            x_center,
            y_center,
            width,
            height
        ]


        for value in values:

            if not 0 <= value <= 1:

                errors.append(
                    f"Line {line_number}: "
                    f"value {value} "
                    f"is outside 0-1"
                )


    return errors


def verify_split(split):

    image_folder = (
        DATASET_ROOT
        / "images"
        / split
    )

    label_folder = (
        DATASET_ROOT
        / "labels"
        / split
    )


    images = get_images(
        image_folder
    )

    labels = list(
        label_folder.glob("*.txt")
    ) if label_folder.exists() else []


    print()
    print(f"{split.upper()}")
    print("-" * 40)

    print(
        f"Images: {len(images)}"
    )

    print(
        f"Labels: {len(labels)}"
    )


    image_names = {
        image.stem
        for image in images
    }

    label_names = {
        label.stem
        for label in labels
    }


    missing_labels = (
        image_names - label_names
    )

    extra_labels = (
        label_names - image_names
    )


    print(
        f"Images without labels: "
        f"{len(missing_labels)}"
    )

    print(
        f"Labels without images: "
        f"{len(extra_labels)}"
    )


    total_errors = 0


    for label_file in labels:

        errors = validate_label(
            label_file
        )


        if errors:

            total_errors += len(errors)

            print()
            print(
                f"Problems in "
                f"{label_file.name}:"
            )


            for error in errors:

                print(
                    f"  {error}"
                )


    return (
        len(images),
        len(labels),
        len(missing_labels),
        len(extra_labels),
        total_errors
    )


def main():

    print()
    print("=" * 60)
    print("EcoSort AI - Final Dataset Verification")
    print("=" * 60)


    if not DATASET_ROOT.exists():

        print()
        print("ERROR: Dataset not found.")

        print(DATASET_ROOT)

        return


    total_images = 0
    total_labels = 0
    total_missing = 0
    total_extra = 0
    total_errors = 0


    for split in [
        "train",
        "val",
        "test"
    ]:

        result = verify_split(
            split
        )


        (
            images,
            labels,
            missing,
            extra,
            errors
        ) = result


        total_images += images
        total_labels += labels
        total_missing += missing
        total_extra += extra
        total_errors += errors


    print()
    print("=" * 60)
    print("FINAL DATASET CHECK")
    print("=" * 60)


    print(
        f"Total images: {total_images}"
    )

    print(
        f"Total labels: {total_labels}"
    )

    print(
        f"Missing labels: {total_missing}"
    )

    print(
        f"Labels without images: {total_extra}"
    )

    print(
        f"Label errors: {total_errors}"
    )


    if (
        total_images > 0
        and total_labels > 0
        and total_missing == 0
        and total_extra == 0
        and total_errors == 0
    ):

        print()
        print("SUCCESS!")
        print(
            "Final EcoSort YOLO dataset is valid."
        )


    else:

        print()
        print(
            "Dataset needs correction."
        )


if __name__ == "__main__":
    main()