import React, { useContext, useEffect } from "react";
import './Verifi.css'
import { useNavigate, useSearchParams } from "react-router-dom";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";

const Verifi = () => {

    const [searchParams,setSearchParams] = useSearchParams()
    const success = searchParams.get("success")
    const reservationId = searchParams.get("reservationId")

    // console.log(success,reservationId);
    const {url} = useContext(StoreContext)
    const navigate = useNavigate()


    const verifiPayment = async ()=>{
        const response = await axios.post(url+"/api/reservation/verifi",{success,reservationId});
        // console.log(response.data);
        
        if(response.data.success){
            navigate("/myreservation");
        }
        else{
            navigate("/")
        }
    }

    useEffect(()=>{
        verifiPayment();
    },[])

  return (
    <div className="verifi">
        <div className="spinner"></div>
    </div>
  )
}

export default Verifi;