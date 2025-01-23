import React, { useState } from "react";
import { Modal } from "react-bootstrap"; 
import tripServices from "../services/tripServices";

const ToDoModal = ({ tripId, onClose }) => {
  const [toDoName, setToDoName] = useState("");
  const [toDoDescription, setToDoDescription] = useState("");
  //const [toDoStatus, setToDoStatus] = useState("pending");

  const handleSubmit = async () => {
    try {
      const newToDo = { toDoName, toDoDescription };
      console.log(newToDo)
      await tripServices.addToDos(tripId, newToDo);
      alert("ToDo added successfully!");
      onClose();
    } catch (error) {
      console.error("Error adding ToDo:", error.response || error.message);
      alert("Failed to add ToDo.");
    }
  };

  return (
    <Modal show={true} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Add ToDo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <label>ToDo Name</label>
          <input
            type="text"
            className="form-control"
            value={toDoName}
            onChange={(e) => setToDoName(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label>ToDo Description</label>
          <textarea
            className="form-control"
            value={toDoDescription}
            onChange={(e) => setToDoDescription(e.target.value)}
          />
        </div>
        {/* <div className="mb-3">
          <label>ToDo Status</label>
          <select
            className="form-control"
            value={toDoStatus}
            onChange={(e) => setToDoStatus(e.target.value)}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div> */}
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
        <button className="btn btn-primary" onClick={handleSubmit}>
          Save ToDo
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ToDoModal;