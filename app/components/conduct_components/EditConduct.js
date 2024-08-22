import React, { useState } from "react";
import { Modal, Box, TextField, Button } from "@mui/material";

const EditConduct = ({ isOpen, onClose, conductData, onEdit }) => {
  const [person, setPerson] = useState(conductData?.person || "");
  const [action, setAction] = useState(conductData?.action || "");
  const [reason, setReason] = useState(conductData?.reason || "");
  const [punishment, setPunishment] = useState(conductData?.punishment || "");
  const [punishmentEndDate, setPunishmentEndDate] = useState(
    conductData?.punishmentEndDate
      ? new Date(conductData.punishmentEndDate).toISOString().split("T")[0]
      : ""
  );

  const handleSubmit = () => {
    onEdit(person, action, reason, punishment, punishmentEndDate);
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
        <h2>Edit Conduct</h2>
        <TextField
          fullWidth
          label="Person"
          value={person}
          onChange={(e) => setPerson(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Action"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Punishment"
          value={punishment}
          onChange={(e) => setPunishment(e.target.value)}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Punishment End Date"
          type="date"
          value={punishmentEndDate}
          onChange={(e) => setPunishmentEndDate(e.target.value)}
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

export default EditConduct;
