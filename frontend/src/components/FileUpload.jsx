import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onChange = (e) => setFile(e.target.files[0]);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post("/review", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // redirect to report details
      navigate(`/report/${res.data.id}`);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="bg-gray-800 p-6 rounded">
      <label className="block mb-2">Select a file (.js, .py, .java)</label>
      <input type="file" accept=".js,.py,.java" onChange={onChange} />
      <div className="mt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 rounded"
        >
          {loading ? "Reviewing..." : "Upload & Review"}
        </button>
      </div>
    </form>
  );
}
