import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './components/Home'
import Register from './components/Register'
import Login from './components/Login'
import DashBoard from './components/DashBoard'
import 'bootstrap/dist/css/bootstrap.css';
import AddTrips from './components/AddTrips'
import Trip from './components/Trip'
import ToDoModal from './dashboard/ToDoModal'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path : "/dashboard",
    element : <DashBoard />
  },
  {
    path: "/dashboard/add-trip",
    element: <AddTrips />
  },
  {
    path: "/dashboard/trip/:tripId",
    element: <Trip />
  }
])
function App() {
  return (
    <RouterProvider router={router} />
  )
}

export default App