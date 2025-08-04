import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getResponsesForTemplate, exportResponsesToCSV } from '../api/formResponseApi';
import { FiDownload, FiUsers, FiFileText, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { saveAs } from 'file-saver';

const FormResponsesViewer = () => {
  const { templateId } = useParams();
  const [responses, setResponses] = useState([]);
  const [template, setTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedResponse, setExpandedResponse] = useState(null);

  useEffect(() => {
    const fetchResponses = async () => {
      setIsLoading(true);
      try {
        const response = await getResponsesForTemplate(templateId);
        setResponses(response.data);
        if (response.data.length > 0) {
          setTemplate(response.data[0].templateDoc);
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch responses');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResponses();
  }, [templateId]);

  const handleExportCSV = async () => {
    try {
      const csvData = await exportResponsesToCSV(templateId);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8' });
      saveAs(blob, `responses_${template?.title || 'form'}_${new Date().toISOString().split('T')[0]}.csv`);
    } catch (err) {
      setError(err.message || 'Failed to export CSV');
    }
  };

  const toggleExpandResponse = (responseId) => {
    if (expandedResponse === responseId) {
      setExpandedResponse(null);
    } else {
      setExpandedResponse(responseId);
    }
  };

  if (isLoading) {
    return <div className="text-center py-8">Loading responses...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  if (!template) {
    return <div className="text-center py-8">No template data found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">
          <FiFileText className="inline mr-2" />
          Responses for: {template.title}
        </h2>
        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center"
        >
          <FiDownload className="mr-2" />
          Export to CSV
        </button>
      </div>

      <div className="mb-4 text-gray-600">
        <FiUsers className="inline mr-2" />
        {responses.length} {responses.length === 1 ? 'response' : 'responses'} received
      </div>

      <div className="space-y-4">
        {responses.map((response) => (
          <div key={response._id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div 
              className="p-4 cursor-pointer flex justify-between items-center hover:bg-gray-50"
              onClick={() => toggleExpandResponse(response._id)}
            >
              <div>
                <div className="font-medium">
                  {response.submittedBy?.firstName} {response.submittedBy?.lastName}
                  <span className="text-gray-500 ml-2">({response.submittedBy?.email})</span>
                </div>
                <div className="text-sm text-gray-500">
                  Submitted on: {new Date(response.createdAt).toLocaleString()}
                </div>
              </div>
              {expandedResponse === response._id ? (
                <FiChevronUp className="text-gray-500" />
              ) : (
                <FiChevronDown className="text-gray-500" />
              )}
            </div>
            
            {expandedResponse === response._id && (
              <div className="border-t border-gray-200 p-4 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {template.fields.map((field) => {
                    const fieldResponse = response.responses.find(r => r.fieldId.equals(field._id));
                    return (
                      <div key={field._id} className="mb-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          {field.label}
                        </label>
                        <div className="bg-white p-3 rounded border border-gray-200">
                          {fieldResponse ? (
                            field.fieldType === 'file' ? (
                              <a 
                                href={fieldResponse.value} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                View File
                              </a>
                            ) : (
                              fieldResponse.value.toString()
                            )
                          ) : (
                            <span className="text-gray-400">No response</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FormResponsesViewer;