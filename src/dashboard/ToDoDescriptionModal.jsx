import React, { useEffect } from "react";
import tripServices from "../services/tripServices";

const ToDoDescriptionModal = ({ toDoId }) => {
  const toDoDescription = useEffect(() => {
    const fetchToDoDescription = async () => {
      try {
        const toDoData = await tripServices.getAllToDos(toDoId);
        return toDoData.data.toDoDescription;
      } catch (err) {
        console.error("Error fetching to do description:", err);
      }
    };

    fetchToDoDescription();
  })

  return (
    <div className="container">
      <div className="row">
        <div className="col">
          <div
            className="modal fade"
            id={`toDoDescriptionModal-${toDoId}`}
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabIndex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-scrollable">
              <div className="modal-content">
                <div className="modal-header">
                  <h1
                    className="modal-title fs-5"
                    id={`toDoDescriptionModal-${toDoId}`}
                  >
                    To Do Description
                  </h1>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">{toDoDescription}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToDoDescriptionModal;