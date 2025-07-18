import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFormTemplatesById } from "../api/formTemplateApi";
import { submitResponse } from "../api/formResponseApi";

const FormFiller = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [responses, setResponses] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

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

  useEffect(() => {
    let redirectTimer;
    if (submitSuccess) {
      redirectTimer = setTimeout(() => {
        navigate(-1);
      }, 2000);
    }
    return () => clearTimeout(redirectTimer);
  }, [submitSuccess, navigate]);

  const handleChange = (fieldId, value) => {
    const field = form?.fields?.find((f) => f._id === fieldId);
    const processedValue =
      field?.fieldType === "number" ? Number(value) : value;
    setResponses({ ...responses, [fieldId]: processedValue });
  };

  const handleFileChange = (fieldId, files) => {
    if (files && files[0]) {
      setResponses({ ...responses, [fieldId]: files[0] });
    }
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

  const convertResponsesToArray = (responsesObject) => {
    return Object.entries(responsesObject).map(([fieldId, value]) => ({
      fieldId,
      value: value instanceof File ? value.name : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const missingRequired = form.fields.filter(
      (field) => field.required && !responses[field._id]
    );

    if (missingRequired.length > 0) {
      alert(
        `Please fill in all required fields: ${missingRequired
          .map((f) => f.label)
          .join(", ")}`
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const arrayResponses = convertResponsesToArray(responses);
      console.log("Submitting:", { templateId: id, responses: arrayResponses });
      await submitResponse({ templateId: id, responses: arrayResponses });
      setSubmitSuccess(true);
    } catch (error) {
      console.error("Submission error:", error);
      alert(error.message || "Failed to submit form");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="text-green-500 mb-4">
            <svg
              className="w-16 h-16 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Success!</h2>
          <p className="text-gray-600 mb-6">
            Your form has been successfully submitted.
          </p>
          <p className="text-gray-500 text-sm">
            Redirecting to recruitment page...
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-red-50 rounded-lg border border-red-200">
        <h2 className="text-xl font-semibold text-red-800 mb-2">Error</h2>
        <p className="text-red-600 mb-4">{error}</p>
        <div className="flex space-x-3">
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-100 text-red-800 rounded hover:bg-red-200 transition-colors"
          >
            Reload Page
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white text-gray-800 rounded border border-gray-300 hover:bg-gray-50"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!form || !Array.isArray(form.fields)) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-yellow-50 rounded-lg border border-yellow-200 text-center">
        <p className="text-yellow-800">Form data not available</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 px-4 py-2 bg-white text-gray-800 rounded border border-gray-300 hover:bg-gray-50"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="bg-indigo-600 px-6 py-4">
            <h1 className="text-2xl font-bold text-white">{form.title}</h1>
            {form.description && (
              <p className="text-indigo-100 mt-1">{form.description}</p>
            )}
          </div>

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

                  {field.fieldType === "text" && (
                    <input
                      type="text"
                      required={field.required}
                      value={responses[field._id] || ""}
                      onChange={(e) => handleChange(field._id, e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  )}

                  {field.fieldType === "number" && (
                    <input
                      type="number"
                      required={field.required}
                      value={responses[field._id] || ""}
                      onChange={(e) => handleChange(field._id, e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  )}

                  {field.fieldType === "email" && (
                    <input
                      type="email"
                      required={field.required}
                      value={responses[field._id] || ""}
                      onChange={(e) => handleChange(field._id, e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  )}

                  {field.fieldType === "textarea" && (
                    <textarea
                      required={field.required}
                      value={responses[field._id] || ""}
                      onChange={(e) => handleChange(field._id, e.target.value)}
                      rows={4}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  )}

                  {field.fieldType === "select" && (
                    <select
                      required={field.required}
                      value={responses[field._id] || ""}
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
                  disabled={isSubmitting}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    isSubmitting ? "opacity-75 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    "Submit Form"
                  )}
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
