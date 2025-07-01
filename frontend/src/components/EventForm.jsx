import React, { useState } from "react";
import { AddEvent } from "../api/societyApi";

const EventForm = ({ onClose, onEventCreated }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    bannerImage: null,
  });

  const [error, setError] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    bannerImage: "",
    general: "",
  });

  const [bannerPreview, setBannerPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError({ ...error, [name]: "", general: "" });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, bannerImage: file });
      setError({ ...error, bannerImage: "", general: "" });

      const reader = new FileReader();
      reader.onloadend = () => setBannerPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const validateDate = (dateString) => {
    if (!dateString) return "Date is required";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date format";

    if (date < new Date()) return "Date must be in the future";

    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Reset all errors
    setError({
      title: "",
      description: "",
      date: "",
      venue: "",
      bannerImage: "",
      general: "",
    });

    // Validate all fields including date
    const dateError = validateDate(formData.date);
    const newErrors = {
      title: formData.title ? "" : "Title is required",
      description: formData.description ? "" : "Description is required",
      date: dateError,
      venue: formData.venue ? "" : "Venue is required",
      bannerImage: formData.bannerImage ? "" : "Banner image is required",
      general: "",
    };

    setError(newErrors);

    // Check if any errors exist
    if (Object.values(newErrors).some((err) => err)) {
      setIsSubmitting(false);
      return;
    }

    try {
      const formDataObj = new FormData();
      formDataObj.append("title", formData.title);
      formDataObj.append("description", formData.description);
      formDataObj.append("date", new Date(formData.date).toISOString());
      formDataObj.append("venue", formData.venue);
      formDataObj.append("banner", formData.bannerImage);

      const response = await AddEvent(formDataObj);
      onEventCreated(response.data);
      onClose();
    } catch (err) {
      setError({
        ...error,
        general: err.message || "Failed to create event",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  

  return (
    <div className="bg-white rounded-lg p-6 max-w-md mx-auto shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Create New Event</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 text-2xl"
          disabled={isSubmitting}
        >
          &times;
        </button>
      </div>

      {error.general && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {error.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Event Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              error.title ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-blue-200 focus:border-blue-500`}
          />
          {error.title && (
            <p className="text-red-500 text-sm mt-1">{error.title}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              error.description ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-blue-200 focus:border-blue-500`}
            rows={4}
          />
          {error.description && (
            <p className="text-red-500 text-sm mt-1">{error.description}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Date & Time *</label>
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              error.date ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-blue-200 focus:border-blue-500`}
          />
          {error.date && (
            <p className="text-red-500 text-sm mt-1">{error.date}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Venue *</label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              error.venue ? "border-red-500" : "border-gray-300"
            } focus:ring-2 focus:ring-blue-200 focus:border-blue-500`}
          />
          {error.venue && (
            <p className="text-red-500 text-sm mt-1">{error.venue}</p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-1">Banner Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={`w-full p-2 border rounded file:mr-2 file:py-1 file:px-4 file:border-0 file:bg-blue-50 file:text-blue-700 ${
              error.bannerImage ? "border-red-500" : "border-gray-300"
            }`}
          />
          {error.bannerImage && (
            <p className="text-red-500 text-sm mt-1">{error.bannerImage}</p>
          )}
          {bannerPreview && (
            <img
              src={bannerPreview}
              alt="Preview"
              className="mt-2 max-h-40 rounded border border-gray-200"
            />
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
