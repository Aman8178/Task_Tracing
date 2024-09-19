// src/components/Navbar/Navbar.jsx
import React, { useState } from 'react';
import './Navbar.css'; 
import Display from '../../Assets/Display.svg'
const Navbar = ({ setGroupBy }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="navbar">
     
      <button className='a-btn'><div className="menu-btn" onClick={toggleMenu}>
       <span><img src={Display} alt="Loading Error" srcset="" /></span> Display <span className="arrow">&#9660;</span>
      </div></button>
      <div className={`dropdown ${isOpen ? 'dropdown-active' : ''}`}>
        <button onClick={() => { setGroupBy('status'); toggleMenu(); }}>Group by Status</button>
        <button onClick={() => { setGroupBy('userId'); toggleMenu(); }}>Group by User</button>
        <button onClick={() => { setGroupBy('priority'); toggleMenu(); }}>Group by Priority</button>
      </div>
    </nav>
  );
};

export default Navbar;
