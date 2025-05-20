import React from 'react'
import { Link,useNavigate,useLocation } from 'react-router-dom'


const Navbar = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  let dashboardLink = null;
  if (token) {
    if (location.pathname === '/dashboard') {
      dashboardLink = (
        <li className='navbar-item'>
          <Link to="/user-dashboard" className='navbar-link'>User Dashboard</Link>
        </li>
      );
    } else if (location.pathname === '/user-dashboard') {
      dashboardLink = (
        <li className='navbar-item'>
          <Link to="/dashboard" className='navbar-link'>Dashboard</Link>
        </li>
      );
    } else {
      dashboardLink = (
        <li className='navbar-item'>
          <Link to="/dashboard" className='navbar-link'>Dashboard</Link>
        </li>
      );
    }
  }

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <ul className="navbar-list">
          {!token ? (
            <>
              <li className='navbar-item'><Link to="/register" className='navbar-link'>Register</Link></li>
              <li className='navbar-item'><Link to="/login" className='navbar-link'>Login</Link></li>
            </>
          ) : (
            <>
              {dashboardLink}
              <li className='navbar-item'>
                <button className='navbar-link' onClick={handleLogout} style={{background: 'none', border: 'none', cursor: 'pointer'}}>Logout</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  )
}

export default Navbar
