"use client";
import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import Protection from "../Protection";
import Layout from "../components/layout";
import EventModal from "../components/event_components/EventModal";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
const Calendar = ({ events = [], onAddEvent }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [eventDetails, setEventDetails] = useState({
    reason: "",
    place: "",
    phone: "",
    booker: "",
  });

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const prevMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  const nextMonth = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  const prevYear = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1)
    );
  const nextYear = () =>
    setCurrentDate(
      new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1)
    );

  const hasEvent = (day) => {
    return events.some((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === day &&
        eventDate.getMonth() === currentDate.getMonth() &&
        eventDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };
  const handleEventAdded = () => {
    showSuccessToast("Event added successfully");
  };
  const handleDayClick = (day) => {
    setSelectedDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    );
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEventDetails({ reason: "", place: "", phone: "", booker: "" });
  };

  const handleInputChange = (e) => {
    setEventDetails({ ...eventDetails, [e.target.name]: e.target.value });
  };

  const handleSaveEvent = () => {
    // Ensure the selectedDate is passed correctly
    onAddEvent({ ...eventDetails, date: selectedDate });
    handleModalClose();
  };

  return (
    <Protection>
      <Layout>
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
          <div className="w-[600px] bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center">
                <button
                  onClick={prevYear}
                  className="p-1 rounded-full bg-blue-400 hover:bg-gray-200 mr-2"
                >
                  <ChevronsLeft size={24} />
                </button>
                <button
                  onClick={prevMonth}
                  className="p-1 rounded-full bg-blue-400 hover:bg-gray-200"
                >
                  <ChevronLeft size={24} />
                </button>
              </div>
              <h2 className="text-2xl font-semibold text-black">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <div className="flex items-center">
                <button
                  onClick={nextMonth}
                  className="p-1 rounded-full bg-blue-400 hover:bg-gray-200"
                >
                  <ChevronRight size={24} />
                </button>
                <button
                  onClick={nextYear}
                  className="p-1 rounded-full bg-blue-400 hover:bg-gray-200 ml-2"
                >
                  <ChevronsRight size={24} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-2 text-center text-sm mb-4">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="text-gray-500 font-medium">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: firstDayOfMonth - 1 }).map((_, index) => (
                <div key={`empty-${index}`} className="h-16"></div>
              ))}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const isToday =
                  day === new Date().getDate() &&
                  currentDate.getMonth() === new Date().getMonth() &&
                  currentDate.getFullYear() === new Date().getFullYear();
                const dayHasEvent = hasEvent(day);

                return (
                  <button
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`h-16 flex flex-col items-center justify-center rounded-lg relative transition-colors text-black
                  ${isToday ? "bg-blue-500 text-white" : "hover:bg-gray-100"}
                  ${!isToday && dayHasEvent ? "font-semibold" : ""}
                `}
                  >
                    <span className="text-lg">{day}</span>
                    {dayHasEvent && !isToday && (
                      <div className="absolute bottom-2 w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                  </button>
                );
              })}
            </div>

            <EventModal
              isOpen={isModalOpen}
              onClose={handleModalClose}
              date={selectedDate}
              eventDetails={eventDetails}
              onInputChange={handleInputChange}
              onSave={handleSaveEvent}
              onEventAdded={handleEventAdded}
            />
          </div>
        </div>
      </Layout>
    </Protection>
  );
};

export default Calendar;
