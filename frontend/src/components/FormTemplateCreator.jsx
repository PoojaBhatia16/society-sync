
import { useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { createFormTemplate } from "../api/formTemplateApi";

const FormTemplateCreator = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fields: [],
  });

  const [newField, setNewField] = useState({
    fieldType: "text",
    label: "",
    required: false,
    options: [],
  });

  const [optionInput, setOptionInput] = useState("");

  const handleAddField = () => {
    const fieldToAdd = { ...newField };

    if (["select", "checkbox", "radio"].includes(newField.fieldType)) {
      fieldToAdd.options = optionInput.split(",").map((opt) => opt.trim());
    }

    setFormData({
      ...formData,
      fields: [...formData.fields, fieldToAdd],
    });

    // Reset field creator
    setNewField({
      fieldType: "text",
      label: "",
      required: false,
      options: [],
    });
    setOptionInput("");
  };

  const removeField = (index) => {
    const updatedFields = [...formData.fields];
    updatedFields.splice(index, 1);
    setFormData({ ...formData, fields: updatedFields });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createFormTemplate(formData);
      onSuccess();
    } catch (error) {
      alert(error.message || "Failed to create form template");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form Metadata */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Title*
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
        />
      </div>

      {/* Field Creator */}
      <div className="p-4 bg-gray-50 rounded-lg space-y-4">
        <h3 className="font-medium text-gray-800">Add New Field</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field Type*
            </label>
            <select
              value={newField.fieldType}
              onChange={(e) =>
                setNewField({ ...newField, fieldType: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="text">Text</option>
              <option value="email">Email</option>
              <option value="number">Number</option>
              <option value="textarea">Text Area</option>
              <option value="select">Dropdown</option>
              <option value="checkbox">Checkbox</option>
              <option value="radio">Radio Button</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Label*
            </label>
            <input
              type="text"
              placeholder="Field Label"
              value={newField.label}
              onChange={(e) =>
                setNewField({ ...newField, label: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {["select", "checkbox", "radio"].includes(newField.fieldType) && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Options (comma separated)*
            </label>
            <input
              type="text"
              placeholder="Option 1, Option 2, Option 3"
              value={optionInput}
              onChange={(e) => setOptionInput(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500">
              Separate options with commas
            </p>
          </div>
        )}

        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="required-field"
              checked={newField.required}
              onChange={(e) =>
                setNewField({ ...newField, required: e.target.checked })
              }
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="required-field"
              className="ml-2 block text-sm text-gray-700"
            >
              Required Field
            </label>
          </div>

          <button
            type="button"
            onClick={handleAddField}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <FiPlus className="mr-2 inline" />
            Add Field
          </button>
        </div>
      </div>

      {/* Preview Added Fields */}
      {formData.fields.length > 0 && (
        <div className="border-t pt-4">
          <h3 className="font-medium text-gray-800 mb-3">Current Fields</h3>
          <ul className="space-y-2">
            {formData.fields.map((field, index) => (
              <li
                key={index}
                className="flex justify-between items-center bg-gray-50 p-3 rounded"
              >
                <div>
                  <span className="font-medium">{field.label}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    ({field.fieldType})
                  </span>
                  {field.options?.length > 0 && (
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">
                      {field.options.length} options
                    </span>
                  )}
                  {field.required && (
                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full ml-2">
                      Required
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeField(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FiTrash2 />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={formData.fields.length === 0}
          className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
            formData.fields.length === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Create Template
        </button>
      </div>
    </form>
  );
};

export default FormTemplateCreator;
