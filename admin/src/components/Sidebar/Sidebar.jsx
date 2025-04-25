import React, { useEffect, useState } from 'react'
import './Sidebar.css'
import {assets} from "../../assets/assets"
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <div className={`sidebar-options`}>
      <NavLink to='/dashboard' className="sidebar-option">
          <img src={assets.dash_board} alt="" />
          <p>Dash Board</p>
        </NavLink>
        <NavLink to='/add' className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Add Dish</p>
        </NavLink>
        <NavLink to='/addcategory' className="sidebar-option">
          <img src={assets.add_icon} alt="" />
          <p>Add Category</p>
        </NavLink>
        <NavLink to='/list' className="sidebar-option">
          <img src={assets.list} alt="" />
          <p>List Dishes</p>
        </NavLink>
         <NavLink to='/categorylist' className="sidebar-option">
          <img src={assets.list} alt="" />
          <p>List Categories</p>
        </NavLink> 
        <NavLink to='/orders' className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Orders</p>
        </NavLink>
        <NavLink to='/reservations ' className="sidebar-option">
          <img src={assets.order_icon} alt="" />
          <p>Reservations</p>
        </NavLink>
        <NavLink to='/feedback ' className="sidebar-option">
          <img src={assets.feedback} alt="" />
          <p>Feedbacks</p>
        </NavLink>
        <NavLink to='/reports ' className="sidebar-option">
          <img src={assets.feedback} alt="" />
          <p>Reports</p>
        </NavLink>
      </div>

    </div>
  )
}

export default Sidebar