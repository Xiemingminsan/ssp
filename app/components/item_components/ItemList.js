import React, { useState } from "react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditItemModal from "./EditItem"; // Import the modal component

const ItemList = ({ items, onDelete, onEdit }) => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="space-y-4">
      {items.length > 0 ? (
        items.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {item.name}
              </h3>
              <p className="text-gray-600">Quantity: {item.quantity}</p>
              {item.description && (
                <p className="text-gray-500">{item.description}</p>
              )}
            </div>
            <div className="space-x-2">
              <IconButton
                style={{ color: "blue" }}
                onClick={() => handleEditClick(item)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                style={{ color: "red" }}
                onClick={() => onDelete(item._id)}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No items available.</p>
      )}
      {selectedItem && (
        <EditItemModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          item={selectedItem}
          onEdit={onEdit} // Pass the onEdit prop to the modal
        />
      )}
    </div>
  );
};

export default ItemList;
