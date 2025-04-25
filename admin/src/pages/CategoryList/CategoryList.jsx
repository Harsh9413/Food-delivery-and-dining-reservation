import React, { useContext, useEffect, useState } from 'react'
import './CategoryList.css'
import axios from 'axios'
import {toast} from 'react-toastify'
import {assets} from '../../assets/assets.js'
import { AdminContext } from '../../contexts/AdminContext.jsx'

const CategoryList = ({url,setCatUpdatePopUp,setData}) => {
  const{focus,setFocus,fetchcatList,catlist,dishCount} =useContext(AdminContext)
  const ActiveDeactiveFood =async(foodId,state) =>{
    const response = await axios.post(`${url}/api/food/removecat`,{id:foodId,status:state});
    await fetchcatList();
    if(response.data.success){
      toast.success(response.data.message)
    }else{
      toast.error("Error") 
    }
   }
       useEffect(()=>{
        fetchcatList();
       },[])








 return (
     <div className='clist add flex-col' >
       <h2 style={{color:"black"}}>All Category List</h2>
       <div className="clist-table">
         <div className="clist-table-format title">
           <b>Image</b>
           <b>Category</b>
           <b class='dishes'>Dishes</b>
           <b>Active</b>
           <b>Deactive</b>
           <b>Edit</b>
         </div>  
         {catlist.map((item,index)=>{
            const cnt = dishCount.find(obj => obj.category === item.name)
           return(
             
             <div key={index} className={item.status?"clist-table-format" : "clist-table-format deactive"}>
               <img src={`${url}/images/`+item.image} alt="" />
               <p>{item.name}</p>
               <p>{cnt?.totalDishes}</p>
               <p onClick={()=>ActiveDeactiveFood(item._id,true)}  className="active-mark">&#10003;</p>
               <p onClick={()=>ActiveDeactiveFood(item._id,false)}  className="remove">X</p>
               <img onClick={()=>{setCatUpdatePopUp(true);setData(item);setFocus}} className='Edit-Img' src={assets.Edit} alt=""/>
             </div>
           )
         
         })}
       </div>     
     </div>
   )
}

export default CategoryList