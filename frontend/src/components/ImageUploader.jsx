import { useRef, useState } from "react";

function ImageUploader({ onImageSelected }) {
  const inputRef = useRef(null);

  const [preview, setPreview] = useState(null);
  const [dragging, setDragging] = useState(false);

  const handleFile = (file) => {
    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);

    onImageSelected(file);
  };

  const handleInputChange = (event) => {
    const file = event.target.files[0];

    handleFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    setDragging(false);

    const file = event.dataTransfer.files[0];

    handleFile(file);
  };

  const removeImage = () => {
    setPreview(null);

    if (inputRef.current) {
      inputRef.current.value = "";
    }

    onImageSelected(null);
  };

  return (
    <div className="uploader-wrapper">

      {!preview ? (

        <div
          className={
            dragging
              ? "upload-box dragging"
              : "upload-box"
          }
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => {
            setDragging(false);
          }}
          onDrop={handleDrop}
          onClick={() => {
            inputRef.current.click();
          }}
        >

          <div className="upload-icon">
            📷
          </div>

          <h3>
            Upload Waste Image
          </h3>

          <p>
            Drag and drop an image here
            or click to browse
          </p>

          <span>
            Supported formats: JPG, JPEG, PNG, WEBP
          </span>

          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            hidden
            onChange={handleInputChange}
          />

          <button
            className="browse-btn"
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              inputRef.current.click();
            }}
          >
            Browse Image
          </button>

        </div>

      ) : (

        <div className="image-preview-box">

          <img
            src={preview}
            alt="Selected waste"
          />

          <div className="preview-actions">

            <button
              className="remove-btn"
              type="button"
              onClick={removeImage}
            >
              Remove Image
            </button>

          </div>

        </div>

      )}

    </div>
  );
}

export default ImageUploader;