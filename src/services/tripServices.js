import { instance, protectedInstance } from "./instance";

const tripServices = {
    addTrip: async (tripData) => {
        const response = await protectedInstance.post("/users/trips/addtrip", tripData);
        return response.data;
    },

    getTripById: async (tripId) => {
        return await protectedInstance.get(`/users/trips/${tripId}`);
    },

    getAllTripsByUserId: async () => {
        return await protectedInstance.get(`/users/alltrips`);
    },

    editTrip: async (tripId, tripName, startDate, endDate, destination) => {
        return await protectedInstance.put(`/users/trips/${tripId}`, { tripName, startDate, endDate, destination });
    },

    deleteTrip: async (tripId) => {
        return await protectedInstance.delete(`/users/trips/${tripId}`);
    },

    searchTrips: async (searchTerm) => {
        return await instance.get(`/users/trips/search`, {
            params: { trip: searchTerm },
        });
    },

    suggestFlights: async () => {
        return await protectedInstance.get(`/users/trips/flights/search`);
    },

    suggestTrains: async (tripId) => {
        return await protectedInstance.get(`/users/trips/trains/search`);
    },

    bookTravel: async (tripId, bookingData) => {
        return await protectedInstance.put(`/users/trips/travels/booking/${tripId}`, bookingData);
    },

    bookAccommodation: async (tripId, bookingDetails) => {
        return await protectedInstance.put(`/users/trips/accommodations/booking/${tripId}`, bookingDetails);
    },

    suggestAccommodation: async () => {
        return await protectedInstance.get('/users/trips/accommodations/search');
    },

    getAllBookedAccommodations: async (tripId) => {
        return await protectedInstance.get(`/users/trips/accommodations/booked/${tripId}`);
    },

    getAccommodationById: async (accId) => {
        return await protectedInstance.get(`/users/trips/getaccommodation/${accId}`);
    },

    editAccommodationById: async (accId, data) => {
        return await protectedInstance.put(`/users/trips/accommodations/edit/${accId}`, data);
    },

    deleteAccommodationById: async (accId) => {
        return await protectedInstance.delete(`/users/trips/accommodations/booking/${accId}`);
    },

    getTravelBookingById: async (travelId) => {
        return await protectedInstance.get(`/users/trips/gettravel/${travelId}`);
    },

    getAllTravelBooking: async (tripId) => {
        return await protectedInstance.get(`/users/travels/booking/all/${tripId}`);
    },

    editTravelBookingById: async (travelId, travelName, travelLocation, travelPrice) => {
        return await protectedInstance.put(`/users/trips/edittravel/${travelId}`, { travelName, travelLocation, travelPrice });
    },

    deleteTravelBookingById: async (travelId) => {
        return await protectedInstance.delete(`/users/travels/booking/${travelId}`);
    },

    getAllToDos: async (tripId) => {
        return await protectedInstance.get(`/users/trips/toDos/all/${tripId}`);
    },

    addToDos: async (tripId, toDoName, toDoDescription) => {
        return await protectedInstance.post(`/users/trips/toDos/${tripId}`, {
            toDoName,
            toDoDescription
        });
    },

    updateToDoStatus: async (toDoId, payload) => {
        return await protectedInstance.put(
            `/users/trips/toDos/update/status/${toDoId}`,
            payload
        );
    },

    deleteToDoById: async (toDoId) => {
        return await protectedInstance.delete(`/users/trips/todos/${toDoId}`);
    },

    getFlightBtnStations: async (source, destination) => {
        const response = await protectedInstance.get(`/users/trips/flights/from/${source}/to/${destination}`);
        return response.data;
    },

    getTrainBtnStations: async (source, destination) => {
        const response = await protectedInstance.get(`/users/trips/trains/from/${source}/to/${destination}`);
        return response.data;
    }
}

export default tripServices