import React, {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import userServices from '../services/userServices'

function NavBar() {
    const [user, setUser] = useState('');
    const navigate = useNavigate();
    //logout function
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await userServices.me();
                setUser(response.data.user);  
            } catch (error) {
                if (error.response?.status === 401) {
                    navigate('/login'); 
                    console.log(error.message);
                } else {
                    console.error("Error fetching user data:", error);
                }
            }
        };
    
        fetchUserData();  // Call the function to fetch user data
    }, [navigate]);
    
    const handleLogout = async () => {
      try {
        await userServices.Logout();
        localStorage.removeItem('token');
        navigate('/login');
      } catch (error) {
        console.error('Logout error:', error);
      }
    };
    
    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link to="/dashboard" className="navbar-brand">
            PK Travel-Planner
          </Link>
  
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link">
                  Hi {user?.firstname} {user?.lastname}
                </Link>
              </li>
  
              <li className="nav-item">
                <button className="nav-link" onClick={handleLogout}>
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  };
  

export default NavBar