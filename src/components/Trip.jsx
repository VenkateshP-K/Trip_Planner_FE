import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import tripServices from '../services/tripServices';
import TravelBooking from '../dashboard/TravelBooking';
import BookedAccommodations from '../dashboard/BookedAccommodations';
import Accommodation from '../dashboard/Accommodation';
import Transportation from '../dashboard/Transportation';
import { useNavigate } from 'react-router-dom';
import NavBar from '../components/NavBar';
import ToDoModal from '../dashboard/ToDoModal';

function Trip() {
  const [trip, setTrip] = useState(null);
  const tripId = useParams().tripId;
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();
  const [showToDoModal, setShowToDoModal] = useState(false); // State for modal visibility

  // Function to toggle modal visibility
  const handleToDoModalToggle = () => setShowToDoModal(!showToDoModal);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const tripData = await tripServices.getTripById(tripId);
        setTrip(tripData.data);
      } catch (err) {
        console.error("Error fetching trip data:", err);
      }
    };

    const fetchToDos = async () => {
      try {
        const toDoData = await tripServices.getAllToDos(tripId);
        setTodos(toDoData.data);
      } catch (err) {
        console.error("Error fetching to do data:", err.response?.data || err.message);
      }
    };

    fetchToDos();
    fetchTrip();
  }, [tripId]);

  const handleDeleteToDo = async (toDoId) => {
    try {
      await tripServices.deleteToDoById(toDoId);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== toDoId));
      alert("ToDo deleted successfully.");
    } catch (err) {
      console.error("Error deleting to do:", err);
      alert("Failed to delete ToDo.");
    }
  };

  const handleUpdateStatus = async (toDoId, newStatus) => {
    try {
      await tripServices.updateToDoStatus(toDoId, { toDoStatus: newStatus });
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === toDoId ? { ...todo, toDoStatus: newStatus } : todo
        )
      );
      alert(`ToDo status updated to ${newStatus}.`);
    } catch (err) {
      console.error("Error updating to do status:", err.response?.data || err);
      alert("Failed to update ToDo status.");
    }
  };

  if (!trip) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="container">
        <div className="row bg-body-tertiary mt-4 p-2 rounded">
          <div className="col">
            <h4 className="text-center p-2">Trip Detail</h4>
          </div>
          <div className="col-auto p-2">
            <button
              data-bs-theme="dark"
              type="button"
              className="btn-close fs-5"
              aria-label="Close"
              onClick={() => navigate("/dashboard")}
            ></button>
          </div>
        </div>
        <div className="row bg-body-tertiary mt-4 rounded p-4 text-center">
          <div className="col-md-6 col-sm-6 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{trip.tripName}</h5>
                <p className="card-text">{trip.destination}</p>
                <p className="card-text">
                  {new Date(trip.startDate).toLocaleDateString()} -{" "}
                  {new Date(trip.endDate).toLocaleDateString()}
                </p>
                <TravelBooking tripId={tripId} />
                <BookedAccommodations tripId={tripId} />
              </div>
              <div className="card-footer">
                <small className="text-body-secondary">
                  'Traveling—it leaves you speechless, then turns you into a
                  storyteller.'
                  <p className="text-end">– Ibn Battuta</p>
                </small>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-sm-6 mb-3">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title text-center">ToDos</h5>
                <div className="text-end">
                  <i
                    type="button"
                    className="bi bi-journal-plus fs-4"
                    data-bs-toggle="modal"
                    data-bs-target="#addToDoModal"
                  ></i>
                </div>
                {todos.length > 0 ? (
                  <div className="table-responsive">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>#</th>
                          <th>Name</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {todos.map((todo, index) => (
                          <tr key={todo._id}>
                            <th>{index + 1}</th>
                            <td>
                              <button
                                type="button"
                                className="btn btn-light"
                                onClick={() =>
                                  alert(`${todo.toDoDescription}`)
                                }
                              >
                                {todo.toDoName}
                              </button>
                            </td>
                            <td>
                              <select
                                value={todo.toDoStatus}
                                onChange={(e) =>
                                  handleUpdateStatus(todo._id, e.target.value)
                                }
                                className="form-select"
                              >
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                                <option value="in-progress">In Progress</option>
                              </select>
                            </td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteToDo(todo._id)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center">
                    <i className="bi bi-journal-x fs-1"></i>
                    <p>No ToDos found!</p>
                  </div>
                )}
                {/* Add ToDo Button */}
                <div className="text-center mt-4">
                  <button
                    className="btn btn-outline-primary rounded-pill"
                    onClick={handleToDoModalToggle}
                  >
                    Add ToDo
                  </button>
                </div>

                {/* Add ToDo Modal */}
                {showToDoModal && <ToDoModal tripId={tripId} onClose={handleToDoModalToggle} />}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row bg-body-tertiary mt-4 rounded p-4">
        <div className="col mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-center">Accommodation</h5>
              <Accommodation trip={trip} tripId={tripId} />
            </div>
          </div>
        </div>
      </div>

      <div className="row bg-body-tertiary mt-4 rounded p-4">
        <div className="col mb-3">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title text-center">Transportation</h5>
              <Transportation trip={trip} setTrip={setTrip} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Trip;