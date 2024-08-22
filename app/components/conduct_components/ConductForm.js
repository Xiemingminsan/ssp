import React from "react";

const ConductForm = ({
  newPerson,
  setNewPerson,
  newAction,
  setNewAction,
  newReason,
  setNewReason,
  newPunishment,
  setNewPunishment,
  newPunishmentEndDate,
  setNewPunishmentEndDate,
  onSubmit,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(
      newPerson,
      newAction,
      newReason,
      newPunishment,
      newPunishmentEndDate
    );
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <div className="space-y-2 text-black">
        <label>Person:</label>
        <input
          type="text"
          value={newPerson}
          onChange={(e) => setNewPerson(e.target.value)}
          placeholder="Enter the person's name"
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-800"
        />
      </div>
      <div className="space-y-2 text-black">
        <label>Action:</label>
        <input
          type="text"
          value={newAction}
          onChange={(e) => setNewAction(e.target.value)}
          placeholder="Enter the action"
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-800"
        />
      </div>
      <div className="space-y-2 text-black">
        <label>Reason:</label>
        <input
          type="text"
          value={newReason}
          onChange={(e) => setNewReason(e.target.value)}
          placeholder="Enter the reason"
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-800"
        />
      </div>
      <div className="space-y-2 text-black">
        <label>Punishment:</label>
        <input
          type="text"
          value={newPunishment}
          onChange={(e) => setNewPunishment(e.target.value)}
          placeholder="Enter the punishment"
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-800"
        />
      </div>
      <div className="space-y-2 text-black">
        <label>Punishment End Date:</label>
        <input
          type="date"
          value={newPunishmentEndDate}
          onChange={(e) => setNewPunishmentEndDate(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-800"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition w-48"
      >
        Add Conduct
      </button>
    </form>
  );
};

export default ConductForm;
