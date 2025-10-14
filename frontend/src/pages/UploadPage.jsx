import React from "react";
import FileUpload from "../components/FileUpload";

export default function UploadPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Upload code for review</h1>
      <FileUpload />
    </div>
  );
}
