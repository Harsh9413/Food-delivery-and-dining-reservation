import React, { useContext } from 'react'
import { useState,useEffect } from 'react';
import axios from 'axios';
import {toast} from 'react-toastify'
import {assets} from '../../assets/assets.js'
import './CatUpdatePopUp.css'
import { AdminContext } from '../../contexts/AdminContext.jsx';

export const CatUpdatePopUp = ({setCatUpdatePopUp,item, url}) => {
    const {setFocus,fetchcatList} = useContext(AdminContext)
    const [image, setImage] = useState(null);
    const [data, setData] = useState({
      id:item._id,
      name: item.name,
      details: item.details,
      img:image,
    })
    const baseUrl = "http://localhost:4000";
    const imageUrl = `${baseUrl}/uploads/${item.image}`;
  
    
   const onChangeHandler = (event) => {
      const name = event.target.name;
      const value = event.target.value;
      setData(prev => ({ ...prev, [name]: value }))
    }
  
  const onSubmitHandler = async (event) => {
      event.preventDefault();
  
  
      const formData = new FormData();
      if (!image) {
          
      }
      if (!data.name || !data.details) {
          console.error("Missing required fields in `data`");
          return;
      }
      // Validate Image Extension
     
     if (image){
      const extension = image.name.split('.').pop().toLowerCase();
      if (["jpeg", "jpg"].includes(extension)) {
        const formData = new FormData();
      // Append object data (Convert object values to strings if needed)
      Object.keys(data).forEach(key => {
      formData.append(key, data[key]);    
      });
  
      // Append image file (if available)
      formData.append("image", image); // Assuming `image` is a File object
      formData.append("prevImage",item.image)
  
      // Send request with FormData
      const response = await axios.post(`${url}/api/food/updatecat`, formData, {
      headers: {
              "Content-Type": "multipart/form-data",
          },
      });
  
       
        if (response.data.success) {
          setCatUpdatePopUp(false)
          toast.success(response.data.message)
          formData.delete("prevImage")
          fetchcatList()
        } else {
          toast.error(response.data.message)
        }
      } else {
        toast.error("Select JPG or JPEG file")
      }
   } else{
  
      Object.keys(data).forEach(key => {
      formData.append(key, data[key]);    
      });
   
      // Send request with FormData
      const response = await axios.post(`${url}/api/food/updatecat`, formData, {
      headers: {
              "Content-Type": "multipart/form-data",
          },
      });
  
        if (response.data.success) {
          setCatUpdatePopUp(false)
          toast.success(response.data.message)
          formData.delete("prevImage")
          fetchcatList()
        } else {
          toast.error(response.data.message)
  
   }
   }
  }



  return (
  
     <div className='Catupdate'>
        <div className='Catupdate-container'>
        <img  className="close" onClick={() => {setCatUpdatePopUp(false);setFocus(true)}} src={assets.cross_icon} alt="" />
              <form onSubmit={onSubmitHandler} className="flex-col">
                <div className="Catupdate-img-uplode flex-col">
                  <p>Uplode Image</p>
                  <label htmlFor="image">
                    <img src={image ? URL.createObjectURL(image) :imageUrl} alt="" />
                  </label>
                  <input onChange={(e) => setImage(e.target.files[0])} type="file" accept=".jpg" id="image" hidden/>
                </div>
                <div className="Catupdate-product-name flex-col">
                  <p>Category name</p>
                  <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type here' />
                </div>
                <div className="Catupdate-product-description flex-col">
                  <p>Category Details</p>
                  <textarea onChange={onChangeHandler} value={data.details} name="details" rows="6" placeholder='Write content here' required></textarea>
                </div>
                <button className='Catupdate-button' type='submit'>Update</button>
              </form>
              </div>
            </div>
  )
}
