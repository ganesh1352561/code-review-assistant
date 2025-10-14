import React, { useEffect, useState } from "react";
import api from "../api/api";
import ReportCard from "../components/ReportCard";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    api
      .get("/reports")
      .then((res) => setReports(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-semibold mb-4">Reports</h1>
      <div className="space-y-3">
        {reports.map((r) => (
          <ReportCard key={r.id} report={r} />
        ))}
      </div>
    </div>
  );
}
