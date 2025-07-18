import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFormTemplatesById } from "../api/formTemplateApi";

const FormFiller = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responses, setResponses] = useState({});

  useEffect(() => {
    const fetchForm = async () => {
      try {
        const response = await getFormTemplatesById(id);
        setForm(response.data);
      } catch (err) {
        setError(err.message || "Failed to load form");
      } finally {
        setLoading(false);
      }
    };
    fetchForm();
  }, [id]);

  const handleChange = (fieldId, value) => {
    setResponses({ ...responses, [fieldId]: value });
  };

  const handleFileChange = (fieldId, files) => {
    setResponses({ ...responses, [fieldId]: files[0] });
  };

  const handleCheckboxGroupChange = (fieldId, optionValue, isChecked) => {
    setResponses((prev) => {
      const currentValues = prev[fieldId] || [];
      return {
        ...prev,
        [fieldId]: isChecked
          ? [...currentValues, optionValue]
          : currentValues.filter((v) => v !== optionValue),
      };
    });
  };

  const handleRadioChange = (fieldId, value) => {
    setResponses({ ...responses, [fieldId]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      alert("Form submitted successfully!");
      navigate("/forms");
    } catch (err) {
      setError(err.message || "Failed to submit form");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-red-50 rounded-lg border border-red-200">
        <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
        >
          Reload Page
        </button>
      </div>
    );

  if (!form || !Array.isArray(form.fields)) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-yellow-50 rounded-lg border border-yellow-200 text-center">
        <p className="text-yellow-800">Form data not available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Form Header */}
          <div className="bg-indigo-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">{form.title}</h1>
            {form.description && (
              <p className="text-indigo-100 mt-1">{form.description}</p>
            )}
          </div>

          {/* Form Body */}
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-8">
              {form.fields.map((field) => (
                <fieldset key={field._id} className="space-y-3">
                  <legend className="block text-sm font-medium text-gray-700 mb-1">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </legend>

                  {/* Text Input */}
                  {field.fieldType === "text" && (
                    <input
                      type="text"
                      required={field.required}
                      onChange={(e) => handleChange(field._id, e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  )}

                  {/* Number Input */}
                  {field.fieldType === "number" && (
                    <input
                      type="number"
                      required={field.required}
                      onChange={(e) => handleChange(field._id, e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  )}

                  {/* Email Input */}
                  {field.fieldType === "email" && (
                    <input
                      type="email"
                      required={field.required}
                      onChange={(e) => handleChange(field._id, e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  )}

                  {/* Textarea */}
                  {field.fieldType === "textarea" && (
                    <textarea
                      required={field.required}
                      onChange={(e) => handleChange(field._id, e.target.value)}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  )}

                  {/* Select Dropdown */}
                  {field.fieldType === "select" && (
                    <select
                      required={field.required}
                      onChange={(e) => handleChange(field._id, e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="">Select an option</option>
                      {field.options?.map((option, i) => (
                        <option key={i} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  )}

                  {/* Single Checkbox */}
                  {field.fieldType === "checkbox" && !field.options && (
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={field._id}
                        checked={responses[field._id] || false}
                        onChange={(e) =>
                          handleChange(field._id, e.target.checked)
                        }
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      <label
                        htmlFor={field._id}
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {field.label}
                      </label>
                    </div>
                  )}

                  {/* Checkbox Group */}
                  {field.fieldType === "checkbox" && field.options && (
                    <div className="space-y-2">
                      {field.options.map((option, i) => (
                        <div key={i} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`${field._id}-${i}`}
                            checked={(responses[field._id] || []).includes(
                              option
                            )}
                            onChange={(e) =>
                              handleCheckboxGroupChange(
                                field._id,
                                option,
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label
                            htmlFor={`${field._id}-${i}`}
                            className="ml-2 block text-sm text-gray-700"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Radio Buttons */}
                  {field.fieldType === "radio" && (
                    <div className="space-y-2">
                      {field.options?.map((option, i) => (
                        <div key={i} className="flex items-center">
                          <input
                            type="radio"
                            id={`${field._id}-${i}`}
                            name={field._id}
                            value={option}
                            checked={responses[field._id] === option}
                            onChange={(e) =>
                              handleRadioChange(field._id, e.target.value)
                            }
                            className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                          <label
                            htmlFor={`${field._id}-${i}`}
                            className="ml-2 block text-sm text-gray-700"
                          >
                            {option}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* File Upload */}
                  {field.fieldType === "file" && (
                    <div>
                      <div className="mt-1 flex items-center">
                        <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                          Choose File
                          <input
                            type="file"
                            className="sr-only"
                            onChange={(e) =>
                              handleFileChange(field._id, e.target.files)
                            }
                          />
                        </label>
                        <span className="ml-3 text-sm text-gray-500">
                          {responses[field._id]?.name || "No file chosen"}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">
                        {field.required ? "Required. " : ""}
                        Max file size: 5MB
                      </p>
                    </div>
                  )}
                </fieldset>
              ))}

              {/* Form Actions */}
              <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Submit Form
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormFiller;
