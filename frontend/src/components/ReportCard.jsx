import React from "react";
import { Link } from "react-router-dom";

export default function ReportCard({ report }) {
  return (
    <div className="bg-gray-800 p-4 rounded flex items-start justify-between">
      <div>
        <Link to={`/report/${report.id}`} className="text-lg font-semibold">
          {report.filename}
        </Link>
        <div className="text-sm text-gray-400">
          {new Date(report.created_at).toLocaleString()}
        </div>
        <p className="mt-2 text-sm text-gray-200">
          {report.review_summary
            ? report.review_summary.slice(0, 200) +
              (report.review_summary.length > 200 ? "..." : "")
            : ""}
        </p>
      </div>
      <div>
        <Link
          to={`/report/${report.id}`}
          className="px-3 py-2 bg-blue-600 rounded"
        >
          View
        </Link>
      </div>
    </div>
  );
}
