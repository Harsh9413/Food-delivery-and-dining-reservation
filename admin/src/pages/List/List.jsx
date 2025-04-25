import React, { useContext, useEffect, useState } from 'react'
import './List.css'
import axios from 'axios'
import {toast} from 'react-toastify'
import {assets} from '../../assets/assets.js'
import { AdminContext } from '../../contexts/AdminContext.jsx'

const List = ({url,setUpdatePopUp,setData}) => {
  const{focus,setFocus,fetchList,list,cat} =useContext(AdminContext)
   
   
   const ActiveDeactiveFood =async(foodId,state) =>{
    const response = await axios.post(`${url}/api/food/remove`,{id:foodId,status:state});
    await fetchList();
    if(response.data.success){
      toast.success(response.data.message)
    }else{
      toast.error("Error") 
    }
   }

   

   


   useEffect(()=>{
    fetchList();
   },[focus])


  return (
    <div className='list add flex-col' >
      <h2 style={{color:"black"}}>All Food List</h2>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Active</b>
          <b>Deactive</b>
          <b>Edit</b>
        </div>  
        <div className='list-cat'>
        {list.map((item,index)=>{
          const cnt = cat.find(obj => obj._id == item.category)
          return(
            
            <div key={index} className={item.status?"list-table-format" : "list-table-format deactive"}>
              <img src={`${url}/images/`+item.image} alt="" />
            {/* {console.log(cnt)} */}
              <p>{item.name}</p>
              <p>{cnt.name}</p>
              <p>₹ {item.price}</p>
              <p onClick={()=>ActiveDeactiveFood(item._id,true)}  className="active-mark">&#10003;</p>
              <p onClick={()=>ActiveDeactiveFood(item._id,false)}  className="remove">X</p>
              <img onClick={()=>{setUpdatePopUp(true);setData(item);setFocus}} className='Edit-Img' src={assets.Edit} alt=""/>
            </div>
          )
        
        })}
        </div>
      </div>     
    </div>
  )
}

export default List