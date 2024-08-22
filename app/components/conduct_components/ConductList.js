import React from "react";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const ConductList = ({ conducts, onDelete, onEdit }) => {
  return (
    <div className="space-y-4">
      {conducts.length > 0 ? (
        conducts.map((conduct) => (
          <div
            key={conduct._id}
            className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-sm"
          >
            <div>
              <h3 className="text-xl font-semibold text-gray-800">
                {conduct.person}
              </h3>
              <p className="text-gray-600">Action: {conduct.action}</p>
              <p className="text-gray-600">Reason: {conduct.reason}</p>
              <p className="text-gray-600">Punishment: {conduct.punishment}</p>
              {conduct.punishmentEndDate && (
                <p className="text-gray-500">
                  Ends on:{" "}
                  {new Date(conduct.punishmentEndDate).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="space-x-2">
              <IconButton
                style={{ color: "blue" }}
                onClick={() => onEdit(conduct)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                style={{ color: "red" }}
                onClick={() => onDelete(conduct._id)}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-500 text-center">
          No conduct records available.
        </p>
      )}
    </div>
  );
};

export default ConductList;
