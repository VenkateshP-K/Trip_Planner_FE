import React, { useState } from "react";
import tripServices from "../services/tripServices";

const EditToDo = ({ toDoId, modalId }) => {
  const [toDoName, setToDoName] = useState("");
  const [toDoDescription, setToDoDescription] = useState("");

  const handleEditToDo = async () => {
    try {
      await tripServices.updateToDo(toDoId, { toDoName, toDoDescription });
      alert("ToDo updated successfully!");
    } catch (err) {
      alert(err.message || "Failed to update ToDo");
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
            <h5 className="modal-title" id={`${modalId}Label`}>Edit ToDo</h5>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="ToDo Name"
              value={toDoName}
              onChange={(e) => setToDoName(e.target.value)}
            />
            <textarea
              className="form-control"
              placeholder="ToDo Description"
              value={toDoDescription}
              onChange={(e) => setToDoDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
            <button type="button" className="btn btn-primary" onClick={handleEditToDo}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditToDo;