import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/api";

// Helper to enhance HTML contrast
const enhanceHtmlContrast = (content) => {
  if (!content) return "";

  // Replace text colors for better contrast
  return String(content)
    .replace(/<h1/g, '<h1 style="color: #f3f4f6"')
    .replace(/<h2/g, '<h2 style="color: #e5e7eb"')
    .replace(/<h3/g, '<h3 style="color: #d1d5db"')
    .replace(/<p/g, '<p style="color: #e5e7eb"')
    .replace(/<li/g, '<li style="color: #e5e7eb"')
    .replace(
      /<code/g,
      '<code style="background: #374151; color: #f3f4f6; padding: 0.2em 0.4em; border-radius: 0.25rem; font-family: monospace;"'
    )
    .replace(
      /<pre/g,
      '<pre style="background: #1f2937; color: #f3f4f6; padding: 1rem; border-radius: 0.5rem; overflow-x: auto;"'
    )
    .replace(/<a/g, '<a style="color: #60a5fa; text-decoration: underline;"');
};

// Helper to safely parse HTML content
const parseHtmlContent = (content) => {
  if (!content) return "";

  // If content is already an object with html property, use that
  if (typeof content === "object" && content.html) {
    return enhanceHtmlContrast(content.html);
  }

  // If content is a string, check if it's JSON
  if (typeof content === "string") {
    try {
      const parsed = JSON.parse(content);
      if (parsed && parsed.html) return enhanceHtmlContrast(parsed.html);
      if (parsed && parsed.content) return enhanceHtmlContrast(parsed.content);
      return enhanceHtmlContrast(content);
    } catch (e) {
      // If not JSON, return as is with contrast enhancement
      return enhanceHtmlContrast(content);
    }
  }

  return enhanceHtmlContrast(content);
};

const SafeHtml = ({ html, className = "" }) => {
  const processedHtml = useMemo(() => {
    if (!html) return "";

    // If html is an object, try to extract the content
    if (typeof html === "object") {
      return parseHtmlContent(html);
    }

    // If it's a string, parse it as JSON if needed
    if (typeof html === "string") {
      try {
        const parsed = JSON.parse(html);
        return parseHtmlContent(parsed);
      } catch (e) {
        return parseHtmlContent(html);
      }
    }

    return parseHtmlContent(html);
  }, [html]);

  // Normalize colors in any inline styles produced by the backend HTML so content
  // remains readable on the app's dark theme. We replace explicit color values
  // and light backgrounds with dark-theme friendly alternatives.
  let cleaned = processedHtml
    // Replace text colors like color: #24292e or other dark hexes with light text
    .replace(/color:\s*#([0-9a-fA-F]{3,6})/g, "color: #e5e7eb")
    // Replace light backgrounds (e.g., code block backgrounds) with dark backgrounds
    .replace(/background:\s*#f6f8fa/g, "background: #0b1220")
    .replace(/background:\s*#fff/g, "background: #0b1220")
    // Ensure inline <code> styling is light on dark
    .replace(/<code([^>]*)style="([^"]*)"/g, (m, p1, p2) => {
      const updated = p2
        .replace(/color:\s*#[0-9a-fA-F]{3,6}/g, "color: #f3f4f6")
        .replace(/background:\s*#[0-9a-fA-F]{3,6}/g, "background: #1f2937");
      return `<code${p1}style="${updated}"`;
    })
    // Remove any remaining explicit color attributes inside style="..."
    .replace(
      /style="([^"]*?)color:\s*#[0-9a-fA-F]{3,6}([^"]*?)"/g,
      (m, a, b) => {
        return `style="${(a + b).replace(/\s+;/g, ";")}"`;
      }
    );

  return (
    <div
      className={`prose prose-invert max-w-none bg-gray-800 p-6 rounded-lg ${className}`}
      style={{
        "--tw-prose-body": "#e5e7eb",
        "--tw-prose-headings": "#f3f4f6",
        "--tw-prose-links": "#60a5fa",
        "--tw-prose-code": "#f3f4f6",
      }}
      dangerouslySetInnerHTML={{ __html: cleaned }}
    />
  );
};

export default function ReportDetails() {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await api.get(`/reports/${id}`);
        const data = response.data;

        // Process the report data to handle different content formats
        const processedReport = {
          ...data,
          content: parseHtmlContent(
            data.content || data.html || data.review_summary || ""
          ),
          review_summary: parseHtmlContent(data.review_summary || ""),
          suggestions: parseHtmlContent(data.suggestions || ""),
        };

        setReport(processedReport);
      } catch (err) {
        console.error("Error fetching report:", err);
        setError("Failed to load report. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [id]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">{error}</div>;
  if (!report) return <div className="text-center py-8">Report not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <Link
          to="/reports"
          className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Back to Reports
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">
          {report.filename || "Code Review Report"}
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Reviewed at: {new Date(report.created_at).toLocaleString()}
        </p>
      </div>

      <div className="space-y-8">
        {report.review_summary && (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">
              Summary
            </h2>
            <SafeHtml html={report.review_summary} />
          </section>
        )}

        {report.suggestions && report.suggestions !== report.review_summary && (
          <section>
            <h2 className="text-2xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">
              Suggestions
            </h2>
            <SafeHtml html={report.suggestions} />
          </section>
        )}

        {report.content &&
          report.content !== report.review_summary &&
          report.content !== report.suggestions && (
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">
                Detailed Review
              </h2>
              <SafeHtml
                html={report.content}
                className="bg-gray-900 p-6 rounded-lg border border-gray-700"
              />
            </section>
          )}
      </div>
    </div>
  );
}
