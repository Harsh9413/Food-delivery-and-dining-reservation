import React from 'react'
import './Header.css'
import { NavLink } from 'react-router-dom';

const Header = () => {
return (
    <div className="split-container">
      {/* Left Section */}
      <div className="split-section left-section">
        <div className="content">
          <h2>Order your favourite food here</h2>
          <p>
          Feeling hungry? Don’t wait! Order your favorite dishes from the best restaurants near you. Delicious food is just a click away!          </p>
          <NavLink to='/menu'><button>View Menu</button></NavLink>
        </div>
      </div>
      <div className="split-section right-section">
        <div className="content">
          <h2>Reserve the table</h2>
          <p>
          Looking to dine out? Reserve your table at the best restaurants near you. A perfect dining experience is just a click away!
          </p>
          <NavLink to='/reservation'><button>Make Reservation</button></NavLink>
        </div>
      </div>
    </div>
  );
};

export default Header