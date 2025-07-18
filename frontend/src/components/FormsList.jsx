// components/FormsList.js
import { useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { getFormTemplates } from "../api/formTemplateApi";

const FormsList = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const response = await getFormTemplates();
        setForms(response.data);
      } catch (err) {
        setError(err.message || "Failed to load forms");
      } finally {
        setLoading(false);
      }
    };
    fetchForms();
  }, []);

  if (loading) return <div className="text-center py-8">Loading forms...</div>;
  if (error)
    return <div className="text-red-500 text-center py-8">Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">RECURITEMENTS</h1>

      {forms.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <p className="text-gray-500">No forms available currently.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {forms.map((form) => (
            <div
              key={form._id}
              className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <h2 className="text-xl font-semibold mb-2 text-gray-800">
                {form.title}
              </h2>
              <p className="text-gray-600 mb-4">
                {form.description || "No description"}
              </p>
              <Link
                to={`/dashboard/recuritement/forms/${form._id}`}
                className="inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
              >
                Fill Out Form
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormsList;
