import React, { useState } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";

const EditItem = ({ isOpen, onClose, item, onEdit }) => {
  const [itemName, setItemName] = useState(item.name);
  const [itemQuantity, setItemQuantity] = useState(item.quantity);
  const [itemDescription, setItemDescription] = useState(item.description);

  const handleSubmit = () => {
    if (onEdit) {
      onEdit(item._id, itemName, itemQuantity, itemDescription);
    }
    onClose(); // Close the modal after submission
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 1,
          boxShadow: 24,
          p: 4,
          minWidth: 300,
        }}
      >
        <h2>Edit Item</h2>
        <TextField
          fullWidth
          label="Item Name"
          value={itemName}
          onChange={(e) => setItemName(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Quantity"
          type="number"
          value={itemQuantity}
          onChange={(e) => setItemQuantity(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          value={itemDescription}
          onChange={(e) => setItemDescription(e.target.value)}
          margin="normal"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          sx={{ mt: 2 }}
        >
          Save Changes
        </Button>
      </Box>
    </Modal>
  );
};

export default EditItem;
