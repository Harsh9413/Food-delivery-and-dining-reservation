import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import './Feedback.css'

const Feedback = ({url}) => {
    const[feedback,setFeedback]=useState([])
    const fetchAllFeedbacks = async()=>{
        try {
            const response = await axios.get(url+"/api/contact/fedlist")
            setFeedback(response.data.data)
        } catch (error) {
            toast.error("Can't Fetch Feedbacks")
        }
    }

    useEffect(() => {
    fetchAllFeedbacks();
    }, [])
    
  return (
    <div className='fed-outer-container'>
        <h2>Feedbacks</h2>
        <div className='fed-inner-container'>
            {feedback.map((item,index)=>{
                 // Format date as dd/mm/yyyy
                 const date=new Date(item.feedbackDT)
                const formattedDate = date.toLocaleDateString("en-GB"); 

                 // Format time as hh:mm AM/PM
                const formattedTime = date.toLocaleTimeString("en-US", { 
                 hour: "2-digit", 
                 minute: "2-digit", 
                 hour12: true 
                });
                return(
                    <div key={index} className="fed-list-item">
                        <div className='first-col'>
                            <div className='image'>
                              <span>{item.userName.charAt(0).toUpperCase()}</span>
                              
                            </div>
                            <p className='username'>{item.userName}</p>
                        </div>
                        <div className='sec-col'>
                            <p>{item.feedbackText}</p>
                            <br />
                            <div className='date-time'>
                                <p>{formattedDate+" "+formattedTime}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  )
}

export default Feedback