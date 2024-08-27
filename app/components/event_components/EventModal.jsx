import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";

const EventModal = ({ isOpen, onClose, date, onEventAdded }) => {
  const [formData, setFormData] = useState({
    reason: "",
    place: "",
    phone: "",
    booker: "",
  });

  const [existingEvents, setExistingEvents] = useState([]);

  useEffect(() => {
    if (isOpen && date) {
      const fetchEventDetails = async () => {
        try {
          const response = await fetch(`/api/event?date=${date.toISOString()}`);
          const data = await response.json();
          setExistingEvents(data);

          if (data.length === 1) {
            setFormData({
              reason: data[0].reason || "",
              place: data[0].place || "",
              phone: data[0].phone || "",
              booker: data[0].booker || "",
            });
          } else {
            setFormData({
              reason: "",
              place: "",
              phone: "",
              booker: "",
            });
          }
        } catch (error) {
          console.error("Error fetching event details:", error);
        }
      };

      fetchEventDetails();
    }

    // Reset modal state when it is closed
    return () => {
      setExistingEvents([]);
      setFormData({
        reason: "",
        place: "",
        phone: "",
        booker: "",
      });
    };
  }, [isOpen, date]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, date }),
    });

    if (response.ok) {
      onClose();
      onEventAdded();
    } else {
      console.error("Failed to save event");
    }
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-4xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Event Details for {date?.toDateString()}
                </Dialog.Title>
                <div className="flex space-x-4 mt-4">
                  {/* Existing Events */}
                  <div className="w-1/2 border-r pr-4">
                    <h4 className="text-lg font-bold mb-2 text-black">
                      Existing Events
                    </h4>
                    <ul>
                      {existingEvents.length > 0 ? (
                        existingEvents.map((event, index) => (
                          <li key={index} className="mb-2 text-black">
                            <p>
                              <strong>Reason:</strong> {event.reason}
                            </p>
                            <p>
                              <strong>Place:</strong> {event.place}
                            </p>
                            <p>
                              <strong>Phone:</strong> {event.phone}
                            </p>
                            <p>
                              <strong>Booker:</strong> {event.booker}
                            </p>
                            <hr className="my-2" />
                          </li>
                        ))
                      ) : (
                        <p>No events found for this date.</p>
                      )}
                    </ul>
                  </div>

                  {/* Input Fields */}
                  <div className="w-1/2 pl-4">
                    <h4 className="text-lg font-bold mb-2 text-black">
                      Add/Edit Event
                    </h4>
                    <form
                      onSubmit={handleSubmit}
                      className="space-y-4 text-black"
                    >
                      <input
                        type="text"
                        name="reason"
                        placeholder="Reason"
                        value={formData.reason}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                      <input
                        type="text"
                        name="place"
                        placeholder="Place"
                        value={formData.place}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                      <input
                        type="tel"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                      <input
                        type="text"
                        name="booker"
                        placeholder="Booker"
                        value={formData.booker}
                        onChange={handleChange}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={onClose}
                          className="px-4 py-2 text-sm font-medium text-red-900 bg-red-100 rounded-md hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 text-sm font-medium text-blue-900 bg-blue-100 rounded-md hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                        >
                          Save
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EventModal;
