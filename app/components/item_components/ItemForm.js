import React from "react";

const ItemForm = ({
  newItemName,
  setNewItemName,
  newItemQuantity,
  setNewItemQuantity,
  newItemDescription,
  setNewItemDescription,
  onSubmit,
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(newItemName, newItemQuantity, newItemDescription);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 space-y-4">
      <div className="flex space-x-4">
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder="New item name"
          className="flex-grow p-2 border border-gray-300 rounded-lg text-gray-800"
        />
        <input
          type="number"
          value={newItemQuantity}
          onChange={(e) => setNewItemQuantity(e.target.value)}
          placeholder="Quantity"
          className="flex-grow p-2 border border-gray-300 rounded-lg text-gray-800"
        />
      </div>
      <div className="space-y-2 text-black">
        <label>Item Description:</label>
        <textarea
          value={newItemDescription}
          onChange={(e) => setNewItemDescription(e.target.value)}
          placeholder="Enter a brief description"
          className="w-full p-2 border border-gray-300 rounded-lg text-gray-800"
        />
      </div>
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition w-48"
      >
        Add Item
      </button>
    </form>
  );
};

export default ItemForm;
