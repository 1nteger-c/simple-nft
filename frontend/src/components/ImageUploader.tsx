import React, { useState, useRef, ChangeEvent, FormEvent } from "react";

function ImageUploader() {
  console.log("QWE")
  const [imageUrl, setImageUrl] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
    }
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (fileInputRef.current?.files) {
      const formData = new FormData();
      formData.append("file", fileInputRef.current.files[0]);
      
      const response = await fetch('http://localhost:8080/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        console.error('Failed to upload image:', response);
        return undefined;
      }

      const result = await response.json();
      return result.imageUrl;
    }
  };
  const handleMintClick = () => {
    // Logic for minting the image goes here
    console.log("minting the image");
  };
  
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        style={{
          width: "500px",
          height: "500px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          overflow: "hidden",
          border: "2px solid black",
        }}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Uploaded image"
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
            }}
          />
        ) : (
          <span style={{ color: "gray" }}>No image uploaded</span>
        )}
      </div>
        <div style={{ display: "flex", marginTop: "16px" }}>
          <form onSubmit={onSubmit}>
            <input type="file" ref={fileInputRef} onChange={handleFileInputChange} />
            <button type="submit">Upload</button>
          </form>
          <button style={{ marginLeft: "8px" }} onClick={handleMintClick}>
            Mint!
          </button>
        </div>
      
    </div>
  );
}

export default ImageUploader;
