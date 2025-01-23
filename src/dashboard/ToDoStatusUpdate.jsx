import React, { useState } from "react";
import tripServices from "../services/tripServices";

const ToDoStatusUpdate = ({ toDoId, modalId }) => {
  const [status, setStatus] = useState("");

  const handleUpdateStatus = async () => {
    try {
      await tripServices.updateToDoStatus(toDoId, status);
      alert("ToDo status updated successfully!");
    } catch (err) {
      alert(err.message || "Failed to update ToDo status");
    }
  };

  return (
    <div
      className="modal fade"
      id={modalId}
      tabIndex="-1"
      aria-labelledby={`${modalId}Label`}
      aria-hidden="true"
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`${modalId}Label`}>Update ToDo Status</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <select
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={handleUpdateStatus}>
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToDoStatusUpdate;