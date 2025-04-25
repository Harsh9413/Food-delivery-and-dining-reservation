import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import{ toast }from 'react-toastify'
const PlaceOrder = () => {
  const{user,setUser} =useContext(StoreContext)
  const {getTotalCartAmount,token,food_list,cartItems,url}= useContext(StoreContext) 
  const [area,setArea]=useState([])
  const [defaults,setDefaults]=useState(false)
  const defaultarea = area.find((item) => item._id === user.areaId)
  const [data,setData] = useState({
    id:user._id,
    name:user.name,
    email:user.email,
    street:"",
    area:"",
    city:"Ahmedabad",
    zipcode:"",
    phone:user.phoneNo||""
  })

const onChangeHandler = (event) => {
  
  const name = event.target.name;
  const value = event.target.value;
  setData(data=>({...data,[name]:value}))
}

  // useEffect(()=>{
  //   console.log(data);
    
  // },[data])

  const placeOrder = async (event) =>{
    event.preventDefault();
    let res={}
    if(!user.areaId){
     res = await axios.post(url+"/api/user/adduserinfo",data);
    }
    if(user.areaId||res.data.success ){
      let orderItems = [];
      food_list.map((item)=>{
        if(cartItems[item._id] > 0){
          let itemInfo = item;
          itemInfo["quantity"] = cartItems[item._id];
          orderItems.push(itemInfo)
        }
      })
      let orderData = {
        address:defaults?{...data,street:user.address,
          area:user.area,
          zipcode:user.pincode}:data,
        items:orderItems,
        amount:getTotalCartAmount()+50,
      }
      let response = await axios.post(url+"/api/order/place",orderData,{headers:{token}});
      if (response.data.success){
        const {session_url} = response.data;
        window.location.replace(session_url);
      }
      else{
        toast.error("Can't Redirect To Stripe")
      }
    }else{
      toast.error("Can't Place Order")
    }




    
  }

  const fetchArea= async()=>{
    try {
      const response= await axios.get(url+"/api/area/arealist")
       if (response.data.success) {
            setArea(response.data.data);
          } else {
            console.log(response.data.message)
          }
    } catch (error) {
      console.log(error)
    }  
  }

  const navigate = useNavigate();



  
  useEffect(()=>{
    fetchArea();
    if(!token){
      navigate('/cart')
    }
    else if(getTotalCartAmount()===0){
      navigate('/cart')
    }
  },[token])

  return (
    <form className='place-order' onSubmit={placeOrder}>
      <div className="place-order-left">
         <p className="title">Delivery Information</p>
         <div className={user.address?"box-fields":"box-fields-hide"}>

         <input className='box' type="checkbox" name="IsDefault" id="IsDefault" onChange={()=>{setDefaults(!defaults)}} />
         <label htmlFor="IsDefault">Your Default Address</label>
         </div>
         <div className="multi-fields">
           <input readOnly name='lastName' onChange={onChangeHandler} value={data.name} type="text" placeholder="Enter Name"/>
         </div>
        <input readOnly name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Email address'/>
        <input required name='street' minLength="10" maxLength="50" onChange={onChangeHandler} value={defaults?user.address:data.street} type="text" placeholder='Street'/>
        <div className="multi-fields">
          
        <select onChange={(e) => {
            const selectedAreaId = e.target.value; 
            const selectedArea = area.find((item) => item._id === selectedAreaId); // Find matching area
          setData({
          ...data,
          area: selectedAreaId, // Set selected area
          zipcode: selectedArea ? selectedArea.pincode : "", // Auto-update pincode
          });
        }} name="Area" value={defaults?defaultarea?._id:data.area} required>
              <option value="" disabled selected>
                Select Area
              </option>
              {area.map((item, index) =>
                item.area ? (
                  <option key={index} value={item._id}>
                    {item.area}
                  </option>
                ) : null
              )}
            </select>
           <input readOnly name='zipcode' onChange={onChangeHandler}  value={defaults?defaultarea?.pincode:data.zipcode} type="number" placeholder="Pin-Code"/>
         </div>
         <div className="multi-fields">
           <input readOnly name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='City'/>
           <input required name='phone' onChange={onChangeHandler} value={data.phone} type="text" placeholder='Phone-No' minLength="10" maxLength="10" pattern="^\d{10}$" onInput={(e) => e.target.value = e.target.value.replace(/\D/g, '')}/>
          </div>
      </div>
      <div className="place-order-right">
      <div className="cart-total">
          <h2>Cart Totals</h2>
          <div className="cart-total-details">
            <p>Subtotal</p>
            <p>₹ {getTotalCartAmount()}</p>
          </div>
          <hr />
          <div className="cart-total-details">
            <b>Delivery Fee</b>
            <b>₹ {getTotalCartAmount()===0?0:50}</b>
          </div>
          <hr />

          <div className="cart-total-details">
            <p>Total</p>
            <p>₹ {getTotalCartAmount()===0?0:getTotalCartAmount()+50}</p>
          </div>
          <button type='submit'>PROCEED TO PAYMENT</button>
         </div>
      </div>
    </form>
  )
}

export default PlaceOrder