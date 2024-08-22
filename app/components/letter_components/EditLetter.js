import React, { useState } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";

const EditLetter = ({ isOpen, onClose, letterData, onEdit }) => {
  const [subject, setSubject] = useState(letterData?.subject || "");
  const [sender, setSender] = useState(letterData?.sender || "");
  const [receiver, setReceiver] = useState(letterData?.receiver || "");
  const [date, setDate] = useState(letterData?.date || "");
  const [description, setDescription] = useState(letterData?.description || "");
  const [status, setStatus] = useState(letterData?.status || "received");

  const handleSubmit = () => {
    onEdit(subject, sender, receiver, date, description, status);
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
        <h2>Edit Letter</h2>
        <TextField
          fullWidth
          label="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Sender"
          value={sender}
          onChange={(e) => setSender(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Receiver"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          margin="normal"
          select
          SelectProps={{ native: true }}
        >
          <option value="received">Received</option>
          <option value="sent">Sent</option>
        </TextField>
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

export default EditLetter;
