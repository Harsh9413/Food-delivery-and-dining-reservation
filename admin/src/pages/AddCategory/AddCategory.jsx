import React, {useState ,useEffect} from 'react'
import './AddCategory.css'
import {assets} from "../../assets/assets"

import axios from 'axios'


const AddCategory = ({url}) => {
  const [image,setImage] = useState(false);
  const [data,setData] =useState({
    name:"",
    details:"",
  })

  
   
  const onChangeHandler = (event) =>{
    const name=event.target.name;
    const value=event.target.value;
    setData(data=>({...data,[name]:value}))
  }

  const onSubmitHandler =async (event) =>{
    event.preventDefault();
    const formData = new FormData();
    formData.append("name",data.name)
    formData.append("details",data.details)
    formData.append("image",image)
      
    const response =await axios.post(`${url}/api/food/addcategory`,formData)
    if(response.data.success){
          setData({
            name:"",
            details:"",
            status: true
          })
          setImage(false)
          toast.success(response.data.message)
    }else{

           toast.error(response.data.message)
    } 
  }
   



  return(
    <div className='add'>
      
      <form  onSubmit={onSubmitHandler} className="flex-col">
        <div className="add-img-uplode flex-col">
            <p>Uplode Image</p>
            <label htmlFor="image">
              <img src={image?URL.createObjectURL(image):assets.upload_area} alt="" />
            </label>
            <input onChange={(e)=>setImage(e.target.files[0])} type="file" accept=".jpg" id="image" hidden required />
        </div>
        <div className="add-product-name flex-col">
          <p>Category name</p>
          <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type here' />
        </div>
        <div className="add-product-description flex-col">
          <p>Category details</p>
          <textarea onChange={onChangeHandler} value={data.details} name="details" rows="6" placeholder='Write content here' required></textarea>
        </div>
        <button className='add-button' type='submit'>ADD</button>
      </form>

    </div>
  )
}

import { Form } from 'react-router-dom'
import { toast } from 'react-toastify'

export default AddCategory