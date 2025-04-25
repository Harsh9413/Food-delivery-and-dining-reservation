import React from 'react'
import './Navbar.css'
import {assets} from "../../assets/assets"
import { useState } from 'react';
import { useEffect } from 'react';

const Navbar = () => {
  
  return (
    <div className={`navbar`}>
        <img className="logo" src={assets.logo} alt="" />
        <img className="profile" src={assets.profile_image} alt="" />
    </div>
  )
}

export default Navbar