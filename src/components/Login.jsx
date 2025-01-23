import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import userServices from '../services/userServices';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        const response = await userServices.login(email, password);
        const token = response.data.token;

        if (!token) {
            console.error("Token is missing in the response");
            return;
        }
        localStorage.setItem('token', token); // Save token
        navigate('/dashboard');
    } catch (error) {
        console.error("Login error:", error.response?.data || error.message);
        alert(error.response?.data?.message || "Login failed");
    }
};

  return (
    <div className="container mt-3" style={{paddingTop:80}}>
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className='card'>
            <div className='card-header'>
              <h2>Login</h2>
            </div>
            <div className='card-body'>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="exampleInputEmail1"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                    }}
                  />
                  <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    id="exampleInputPassword1"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                <button type="submit" className="btn btn-primary">Submit</button>
                <p>Don't have an account? <Link to="/register">Register</Link></p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;