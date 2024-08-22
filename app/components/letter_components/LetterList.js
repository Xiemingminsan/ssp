import React from "react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const LetterList = ({ letters, onDelete, onEdit }) => {
  return (
    <div className="space-y-4">
      {letters.length > 0 ? (
        letters.map((letter) => (
          <div
            key={letter._id}
            className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {letter.subject}
              </h3>
              <p className="text-gray-600">Sender: {letter.sender}</p>
              <p className="text-gray-600">Receiver: {letter.receiver}</p>
              <p className="text-gray-600">Date: {letter.date}</p>
              <p className="text-gray-600">Status: {letter.status}</p>
              {letter.description && (
                <p className="text-gray-500">
                  Description: {letter.description}
                </p>
              )}
            </div>
            <div className="space-x-2">
              <IconButton
                style={{ color: "blue" }}
                onClick={() => onEdit(letter)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                style={{ color: "red" }}
                onClick={() => onDelete(letter._id)}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">No letters available.</p>
      )}
    </div>
  );
};

export default LetterList;
