
import React, { useContext, useState,useEffect } from 'react'
import './Reservation.css';
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'

const Reservation = () => {
  const{user,isLogged,url,token}=useContext(StoreContext)
  const [reserves,setReservs]=useState()
  const [minDate, setMinDate] = useState('');
  const [maxDate, setMaxDate] = useState('');
  const [isSubmit ,setIsSubmit] =useState(false)
  const fetchAllReservation = async ()=>{
    try {
      const response = await axios.get(url + "/api/reservation/reslist");
     // console.log("Full API Response:", response.data); // Debugging API Response

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

  const [data,setData] = useState({
    firstname:"",
    lastname:"",
    people:"",
    time:"",
    date:"",
    amt:100,
    mobileno:""
  })

  const onChangeHandler = (event) => {
    const name = event.target.name;
    let value = event.target.value;
    if (name === "mobileno") {
      value = value.replace(/\D/g, '').slice(0, 10);
    }
    setData((prevData) => ({ ...prevData, [name]: value }));
  };
  

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Set to tomorrow

    const oneMonthLater = new Date(today);
    oneMonthLater.setMonth(today.getMonth() + 1); // Set max date to one month later

    setMinDate(tomorrow.toISOString().split('T')[0]);
    setMaxDate(oneMonthLater.toISOString().split('T')[0]);
    fetchAllReservation();
  
  }, []);


  const ReservationConfirm = async () =>{
    //event.preventDefault();
    // console.log(url);
    if (isLogged){
        // Check if there are already 5 reservations for the selected date & time
        const existingReservations = reserves.filter((res) => {
          const resDate = new Date(res.Date).toISOString().split("T")[0]; // Convert to YYYY-MM-DD
          return resDate === data.date  && res.Time === data.time && res.Payment===true && res.Status=="Booked";
        });
        console.log(existingReservations);
        
    if (existingReservations.length >= 5) {
    toast.error("Max limit reached for this date and time slot!");
    return;
    }else{
    let response = await axios.post(url+"/api/reservation/reserve",data,{headers:{token}})
    // console.log(response);
    if(response.data.success){
      const {session_url} = response.data;
      window.location.replace(session_url)
    }
    else{
      alert("errrrrrr")
    }
  }
  }else{
    toast.error("You need to Login")
  }
  }

  {isSubmit?document.body.style.overflow = "hidden": document.body.style.overflow = "auto"}

  
  return (
    <div>
  
    <div className="res-container">
      <div className="res-header">
        <div className="booknow-header">
          <h1>RESERVE TABLE NOW</h1>
        </div>
        <div className="sub-header">
          <h3>Reserve Your Table Now And Have Great Meal!</h3>
        </div>
      </div>
      <div className="detail-form">
        <form onSubmit={(e)=>{isLogged?setIsSubmit(true):toast.error("You Need to login First");
          e.preventDefault();}}>
          <div className="detail-row">
            <div className="fields">
              <label htmlFor="Res_first_name">First Name</label>
              <input onChange={onChangeHandler} value={data.firstname} type="text" placeholder="First Name" name='firstname' required id="Res_first_name" />
            </div>
            <div className="fields">
              <label htmlFor="Res_last_name">Last Name</label>
              <input onChange={onChangeHandler} value={data.lastname} type="text" placeholder="Last Name" name='lastname' id="Res_last_name" required/>
            </div>
          </div>
          <div className="detail-row">
            <div className="fields">
              <label htmlFor="Res_name">No. of people</label>
              <select onChange={onChangeHandler} value={data.people} name="people" id="num_of_guest" required>
                <option value="" disabled>select</option>
                <option value="1">1 Person</option>
                <option value="2">2 People</option>
                <option value="3">3 People</option>
                <option value="4">4 People</option>
                <option value="5">5 People</option>
                <option value="6">6 People</option>
                <option value="7">7 People</option>
                <option value="8">8 People</option>
              </select>
            </div>
            <div className="fields">
              <label htmlFor="Res_time">Time</label>
              <select name="time" onChange={onChangeHandler} value={data.time} id="time" required defaultValue="">
                <option value="" disabled>select</option>
                <option value="07:00 PM - 08:00 PM">07:00 PM - 08:00 PM</option>
                <option value="08:00 PM - 09:00 PM">08:00 PM - 09:00 PM</option>
                <option value="09:00 PM - 10:00 PM">09:00 PM - 10:00 PM</option>
                <option value="10:00 PM - 11:00 PM">10:00 PM - 11:00 PM</option>
                <option value="11:00 PM - 12:00 AM">11:00 PM - 12:00 AM</option>
              </select>
            </div>
          </div>
          <div className="detail-row">
            <div className="fields">
              <label htmlFor="Res_date">Date</label>
              <input onChange={onChangeHandler} value={data.date} type="date" required id="Res_date" name='date' min={minDate} max={maxDate} />
            </div>
            <div className="fields">
            <label htmlFor="Res_num">Mobile No.</label>
              <input onChange={onChangeHandler} value={data.mobileno}
                type="text" name='mobileno'
                placeholder="Enter 10-digit mobile number" 
                required 
                id="Res_num" 
                maxLength="10" 
              />
            </div>
          </div>
          <div className="note">
            <p className="info-text">
              *Food delivery and dining at restaurants are available only in Ahmedabad.
            </p>
            <br />
            <h3 className="info-amount" name='amt' >Amount: ₹ 100</h3>
            <br />
            <p className="info-text">The Reservation amount will be deducted from your bill at the restaurant.</p>
            <br />
          </div>
          <button className="btn"  type="submit">
            Reserver Table
          </button>
      
        </form>
        
        <div className={isSubmit?(isLogged?'Conform-box-active':'Conform-box-deactive'):'Conform-box-deactive'}>
        
          <p className="info-text">No refund in case of cancellation.</p>
           <p>Are You Sure?</p>
           <div className='buttons'>
           <button type='submit' onClick={()=>{ReservationConfirm();setIsSubmit(false);document.body.style.overflow = "auto"}}>Yes</button>
           <button onClick={()=>{setIsSubmit(false);document.body.style.overflow = "auto";}}>No</button>
           </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Reservation;
