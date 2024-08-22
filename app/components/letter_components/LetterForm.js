import React from "react";

const LetterForm = ({
  newSubject,
  setNewSubject,
  newSender,
  setNewSender,
  newReceiver,
  setNewReceiver,
  newDate,
  setNewDate,
  newDescription,
  setNewDescription,
  newStatus,
  setNewStatus,
  onSubmit,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(
      newSubject,
      newSender,
      newReceiver,
      newDate,
      newDescription,
      newStatus
    );
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <div className="space-y-2 text-black">
        <label>Subject:</label>
        <input
          type="text"
          value={newSubject}
          onChange={(e) => setNewSubject(e.target.value)}
          placeholder="Enter the subject"
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-800"
        />
      </div>
      <div className="space-y-2 text-black">
        <label>Sender:</label>
        <input
          type="text"
          value={newSender}
          onChange={(e) => setNewSender(e.target.value)}
          placeholder="Enter the sender"
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-800"
        />
      </div>
      <div className="space-y-2 text-black">
        <label>Receiver:</label>
        <input
          type="text"
          value={newReceiver}
          onChange={(e) => setNewReceiver(e.target.value)}
          placeholder="Enter the receiver"
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-800"
        />
      </div>
      <div className="space-y-2 text-black">
        <label>Date:</label>
        <input
          type="text"
          value={newDate}
          onChange={(e) => setNewDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-800"
        />
      </div>
      <div className="space-y-2 text-black">
        <label>Description:</label>
        <textarea
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          placeholder="Enter a brief description"
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-800"
        />
      </div>
      <div className="space-y-2 text-black">
        <label>Status:</label>
        <select
          value={newStatus}
          onChange={(e) => setNewStatus(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-800"
        >
          <option value="received">Received</option>
          <option value="sent">Sent</option>
        </select>
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition w-48"
      >
        Add Letter
      </button>
    </form>
  );
};

export default LetterForm;
