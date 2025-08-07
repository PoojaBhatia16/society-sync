import React, { useState } from "react";
import { Collapse } from "react-bootstrap";

const EventCard = ({ event }) => {
  const [open, setOpen] = useState(false);

  // Format date for display with better error handling
  const formattedDate = event?.date
    ? new Date(event.date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Date not specified";

  // Fallback image if banner is not available
  const bannerUrl =
    event?.banner || "https://via.placeholder.com/800x400?text=Event+Banner";

  return (
    <div
      className="rounded-xl overflow-hidden mb-6 transition-all duration-300"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #9BA4B5",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
      }}
    >
      {/* Banner Preview (Clickable) */}
      <div
        className="h-48 bg-cover bg-center cursor-pointer relative"
        style={{
          backgroundImage: `url(${bannerUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        onClick={() => setOpen(!open)}
        aria-controls={`event-collapse-${event.id}`}
        aria-expanded={open}
      >
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white">
          <h5
            className="font-bold text-lg mb-1 truncate"
            style={{ color: "#F1F6F9" }}
          >
            {event.title || "Untitled Event"}
          </h5>
          <div className="flex justify-between text-sm">
            <span className="truncate">{formattedDate}</span>
            <span className="truncate ml-2">
              {event.venue || "Venue not specified"}
            </span>
          </div>
        </div>
      </div>

      {/* Collapsible Details */}
      <Collapse in={open}>
        <div id={`event-collapse-${event.id}`}>
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2" style={{ color: "#212A3E" }}>
              {event.title || "Untitled Event"}
            </h3>
            {event.societyName && (
              <p className="mb-3" style={{ color: "#394867" }}>
                {event.societyName}
              </p>
            )}

            <div className="space-y-2 mb-4">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ color: "#9BA4B5" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span style={{ color: "#394867" }}>{formattedDate}</span>
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ color: "#9BA4B5" }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <span style={{ color: "#394867" }}>
                  {event.venue || "Venue not specified"}
                </span>
              </div>
            </div>

            {event.description && (
              <p className="mb-4" style={{ color: "#394867" }}>
                {event.description}
              </p>
            )}

            
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default EventCard;
