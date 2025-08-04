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
    <div
      className="rounded-lg p-6 max-w-md mx-auto"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #9BA4B5",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold" style={{ color: "#212A3E" }}>
          Create New Event
        </h2>
        <button
          onClick={onClose}
          className="text-2xl"
          style={{ color: "#9BA4B5" }}
          disabled={isSubmitting}
        >
          &times;
        </button>
      </div>

      {error.general && (
        <div
          className="mb-4 p-2 rounded"
          style={{
            backgroundColor: "#F1F6F9",
            color: "#394867",
            border: "1px solid #9BA4B5",
          }}
        >
          {error.general}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-1" style={{ color: "#394867" }}>
            Event Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              error.title ? "border-red-500" : "border-gray-300"
            }`}
            style={{
              focus: {
                outline: "2px solid #394867",
                outlineOffset: "2px",
              },
            }}
          />
          {error.title && (
            <p className="text-sm mt-1" style={{ color: "#EF4444" }}>
              {error.title}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1" style={{ color: "#394867" }}>
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              error.description ? "border-red-500" : "border-gray-300"
            }`}
            style={{
              focus: {
                outline: "2px solid #394867",
                outlineOffset: "2px",
              },
            }}
            rows={4}
          />
          {error.description && (
            <p className="text-sm mt-1" style={{ color: "#EF4444" }}>
              {error.description}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1" style={{ color: "#394867" }}>
            Date & Time *
          </label>
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              error.date ? "border-red-500" : "border-gray-300"
            }`}
            style={{
              focus: {
                outline: "2px solid #394867",
                outlineOffset: "2px",
              },
            }}
          />
          {error.date && (
            <p className="text-sm mt-1" style={{ color: "#EF4444" }}>
              {error.date}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1" style={{ color: "#394867" }}>
            Venue *
          </label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleChange}
            className={`w-full p-2 border rounded ${
              error.venue ? "border-red-500" : "border-gray-300"
            }`}
            style={{
              focus: {
                outline: "2px solid #394867",
                outlineOffset: "2px",
              },
            }}
          />
          {error.venue && (
            <p className="text-sm mt-1" style={{ color: "#EF4444" }}>
              {error.venue}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block mb-1" style={{ color: "#394867" }}>
            Banner Image *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={`w-full p-2 border rounded file:mr-2 file:py-1 file:px-4 file:border-0 ${
              error.bannerImage ? "border-red-500" : "border-gray-300"
            }`}
            style={{
              file: {
                backgroundColor: "#F1F6F9",
                color: "#394867",
              },
            }}
          />
          {error.bannerImage && (
            <p className="text-sm mt-1" style={{ color: "#EF4444" }}>
              {error.bannerImage}
            </p>
          )}
          {bannerPreview && (
            <img
              src={bannerPreview}
              alt="Preview"
              className="mt-2 max-h-40 rounded"
              style={{ border: "1px solid #9BA4B5" }}
            />
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 rounded"
            style={{
              border: "1px solid #9BA4B5",
              color: "#394867",
              hover: {
                backgroundColor: "#F1F6F9",
              },
              disabled: {
                opacity: "0.5",
              },
            }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 rounded"
            style={{
              backgroundColor: "#394867",
              color: "#F1F6F9",
              hover: {
                backgroundColor: "#212A3E",
              },
              disabled: {
                opacity: "0.5",
              },
            }}
          >
            {isSubmitting ? "Creating..." : "Create Event"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EventForm;
