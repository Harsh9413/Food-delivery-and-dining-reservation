import React, { useContext, useEffect, useState } from 'react'
import './MyReservation.css'
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
// import { useNavigate } from 'react-router-dom'


const MyReservation = () => {

  const {url,token} = useContext(StoreContext)
  const [data,setData] = useState([]);

  const fetchReservation = async()=>{
    const response = await axios.post(url+"/api/reservation/userreservation",{},{headers:{token}})
    // setData(response.data.data);
    // console.log(response.data.data);
    const filteredReservation = response.data.data.filter(reservations=> reservations.Payment === true);
    console.log(filteredReservation);
        
    setData(filteredReservation);
  }
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-GB").split("/").join("-"); // Converts to "dd-mm-yyyy"
  };
  
  const cancelOrder=async(status,id)=>{
    try {
      const response = await axios.post(url+"/api/reservation/status",{
        id,
        status:status
      })
      if(response.data.success){
        fetchReservation()
        console.log("cancelled")
      }
    } catch (error) {
      
    }
   
  }
  // const navigate = useNavigate();
  useEffect(()=>{
    if(token){
      fetchReservation();
    }
    else{
      // navigate('/')
    }
  },[token])

  return (
    <div className='my-reservation'>
       <h2>My Reservations</h2>
       <div className="container">
        {data.map((reservation,index)=>{
          return(
            <div key={index} className="my-reservations-reservation">
              <img src={assets.table_icon}/>
              <p>{reservation.First_Name} {reservation.Last_name}</p>
              <p>{reservation.People} People</p>
              <p>{reservation.Time}</p>
              <p>{formatDate(reservation.Date)}</p>
              <p>₹ {reservation.Amount}</p>
              <p><span>&#x25cf;</span><b> {reservation.Status}</b></p>
              <button onClick={(event)=>cancelOrder("Cancelled",reservation._id)}>Cancel Reservation</button>
            </div>
        )
        })}
       </div>
    </div>
  )
}

export default MyReservation