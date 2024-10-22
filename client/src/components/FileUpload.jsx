import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [singleFile, setSingleFile] = useState(null);
  const [multipleFiles, setMultipleFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

  const handleSingleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }
    setSingleFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview([previewUrl]);
  };

  const handleMultipleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      alert("Please select at least one image file.");
      return;
    }
    setMultipleFiles(imageFiles);

    const previews = imageFiles.map((file) => URL.createObjectURL(file));
    setImagePreview(previews);
  };

  const handleRemoveFile = (index) => {
    const updatedFiles = [...multipleFiles];
    updatedFiles.splice(index, 1);
    setMultipleFiles(updatedFiles);

    const updatedPreviews = [...imagePreview];
    updatedPreviews.splice(index, 1);
    setImagePreview(updatedPreviews);
  };

  const uploadSingleFile = async (e) => {
    e.preventDefault();
    if (!singleFile) return alert("Please select a file to upload.");

    try {
      const formData = new FormData();
      formData.append("file", singleFile);

      const res = await axios.post("http://localhost:3000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res.data);
      alert("File uploaded successfully");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("File upload failed");
    }
  };

  const uploadMultipleFiles = async (e) => {
    e.preventDefault();
    if (multipleFiles.length === 0)
      return alert("Please select files to upload.");

    try {
      const formData = new FormData();
      multipleFiles.forEach((file) => {
        formData.append("files", file);
      });

      const res = await axios.post("http://localhost:3000/uploads", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res.data);
      alert("Files uploaded successfully");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Files upload failed");
    }
  };

  return (
    <div className="container mx-auto p-4 border-solid border-2 my-28 flex flex-col items-center justify-center">
      {/* Single File Upload */}
      <h1 className="text-2xl font-bold mb-4">Upload a Single File</h1>
      <form onSubmit={uploadSingleFile} className="mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleSingleFileChange}
          className="border border-gray-300 p-2 mb-2"
        />
        {imagePreview.length > 0 && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Image Preview:</h2>
            <img
              src={imagePreview[0]}
              alt="Preview"
              className="w-64 h-64 object-contain mt-2"
            />
          </div>
        )}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Upload Single File
        </button>
      </form>

      <h1 className="text-2xl font-bold mb-4">Upload Multiple Files</h1>
      <form onSubmit={uploadMultipleFiles}>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleMultipleFilesChange}
          className="border border-gray-300 p-2 mb-2"
        />
        {imagePreview.length > 0 && (
          <div className="mb-4 grid grid-cols-2 gap-2">
            <h2 className="text-lg font-semibold">Image Previews:</h2>
            {imagePreview.map((preview, index) => (
              <div key={index} className="relative">
                <img
                  src={preview}
                  alt={`Preview ${index + 1}`}
                  className="w-32 h-32 object-contain"
                />
                <button
                  type="button"
                  className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                  onClick={() => handleRemoveFile(index)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        <button type="submit" className="bg-green-500 text-white p-2 rounded">
          Upload Multiple Files
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
