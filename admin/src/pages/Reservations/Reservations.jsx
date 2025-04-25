import React, { useState,useEffect } from 'react'
import './Reservations.css'
import { assets } from '../../assets/assets';
import { toast } from 'react-toastify';
import axios from 'axios';
const Reservations = ({url}) => {
 const[reservs,setReservs] =useState([])
  const fetchAllReservation = async ()=>{
    try {
      const response = await axios.get(url + "/api/reservation/reslist");
      console.log("Full API Response:", response.data); // Debugging API Response

      if (response.data.success) {
        setReservs(response.data.data);
      } else {
        toast.error("Can't Fetch Reservs");
      }
    } catch (error) {
      console.error("Error fetching Reservations:", error);
      toast.error("Can't Fetch Data");
    }
  }
  // const statusHandler = async (event,id)=>{
  //   const response = await axios.post(url+"/api/reservation/status",{
  //     id,
  //     status:event.target.value
  //   })
  //   if(response.data.success){
  //     await fetchAllReservation()
  //   }
  // }
  useEffect(() => {
    fetchAllReservation();
  }, [])
  





  return (
    <div className="res-outer-container">
      <h2>Reservations</h2>
        {reservs.map((item,index)=>{
          const onestatus=reservs.find((obj)=>obj._id === item._id)
          if(item.Payment===true){
          const formatedate= new Date(item.Date).toLocaleDateString("en-GB")
          return(
          <div key={index} className='res-list-container'>
          <div  className='res-list-col'>
            <img src={assets.reserv} alt="reservation image" />
          </div>
        <div className='res-list-col'>
          <div className='list-items'>
            <b>Name:</b><p className='name'>{item.First_Name+" "+item.Last_name}</p>
            <br />
            <br />
          </div>
          <div className='list-items'>
            <b>People:</b><p>{item.People}</p>
          </div>
        < div className='list-items'>
        
            <b>Date:</b><p>{formatedate}</p>
          </div>
          <div className='list-items'>
            <b>Time:</b><p>{item.Time}</p>
          </div>
          <div className='list-items'>
            <b>Phone no:</b><p>{item.Mobile}</p>
          </div>
        </div>
        <div className='res-list-col'>
          <div className='list-items'>
           <b>Amount:</b><p className='amount'>₹100</p>
          </div>
        </div>
        <div className='res-list-col'>
          <div className='list-items'>
          <b>Status:</b><p className='status'>{item.Status}</p>
          {/* <select onChange={(event)=>statusHandler(event,item._id)} value={item.Status}>
                <option value="Pending">Pending</option>
                <option value="Confirm">Confirm</option>
                <option value="Cancelled">Cancelled</option>
              </select> */}
          </div>
        </div>
        </div>
          )}
        })}
        
      </div>
    
  )
}

export default Reservations