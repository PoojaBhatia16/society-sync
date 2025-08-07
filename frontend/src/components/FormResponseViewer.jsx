import React, { useState, useEffect } from "react";
import { getResponsesForTemplate } from "../api/formResponseApi";
import { FiDownload, FiFileText, FiFile } from "react-icons/fi";
import {
  exportResponsesToCSV,
  exportResponsesToExcel,
} from "../api/formResponseApi";

const FormResponsesViewer = ({ templateId }) => {
  const [responses, setResponses] = useState([]);
  const [templateFields, setTemplateFields] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getResponsesForTemplate(templateId);
        console.log("Full API response:", response);

        const responseData = response.data || response;

        if (responseData && responseData.length > 0) {
          setResponses(responseData);

          if (responseData[0].templateDoc?.fields) {
            setTemplateFields(responseData[0].templateDoc.fields);
          } else if (responseData[0].template?.fields) {
            setTemplateFields(responseData[0].template.fields);
          }
        }
      } catch (err) {
        console.error("Error fetching responses:", err);
        setError(err.message || "Failed to fetch responses");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [templateId]);

  const handleExport = async (type) => {
    try {
      const exportFunction =
        type === "csv" ? exportResponsesToCSV : exportResponsesToExcel;
      const response = await exportFunction(templateId);

      const extension = type === "csv" ? "csv" : "xlsx";
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `responses_${new Date().toISOString().split("T")[0]}.${extension}`
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(`Export to ${type.toUpperCase()} failed:`, error);
      alert(`Failed to export to ${type.toUpperCase()}`);
    }
  };

  if (isLoading)
    return <div className="p-4 text-center">Loading responses...</div>;
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>;
  if (!responses.length)
    return (
      <div className="p-4 text-center">No responses yet for this form</div>
    );

  return (
    <div className="overflow-x-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">
          Form Responses ({responses.length})
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => handleExport("csv")}
            className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
            title="Download CSV"
          >
            <FiFileText className="mr-1" />
            CSV
          </button>
          <button
            onClick={() => handleExport("excel")}
            className="flex items-center px-3 py-1.5 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            title="Download Excel"
          >
            <FiFile className="mr-1" />
            Excel
          </button>
        </div>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Submitted By
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            {templateFields.map((field) => (
              <th
                key={field._id || field.id}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {field.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {responses.map((response) => (
            <tr key={response._id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {response.submittedBy?.email || "Anonymous"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {new Date(response.createdAt).toLocaleString()}
              </td>
              {templateFields.map((field) => {
                const fieldResponse = response.responses.find(
                  (r) => r.fieldId.toString() === field._id.toString()
                );
                return (
                  <td key={field._id} className="px-6 py-4 whitespace-nowrap">
                    {fieldResponse?.value || "-"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormResponsesViewer;
