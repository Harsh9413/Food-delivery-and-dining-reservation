import React, { useContext } from 'react'
import { useState,useEffect } from 'react';
import axios from 'axios';
import {toast} from 'react-toastify'
import {assets} from '../../assets/assets.js'
import './UpdatePopUp.css'
import { AdminContext } from '../../contexts/AdminContext.jsx';

const UpdatePopUp = ({setUpdatePopUp,item,url}) => {
  const {setFocus,fetchList} = useContext(AdminContext)
  const [catList, setCatList] = useState([]);
  const [image, setImage] = useState(null);
  const [data, setData] = useState({
    id:item._id,
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    img:image,
  })
  const baseUrl = "http://localhost:4000";
  const imageUrl = `${baseUrl}/uploads/${item.image}`;

  const fetchCategory = async () => {
    try {
      const response = await axios.get(`${url}/api/food/add`);
      if (response.data.success) {
        setCatList(response.data.data);
      } else {
        toast.error(response.data.message || "Failed to fetch categories.");
      }
    } catch (error) {
      toast.error("Error fetching categories.");
    }
  };
  
  

  useEffect(() => {
    //document.body.style.overflow = "hidden";
    fetchCategory();
  }, [])

  
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
    if (!data.name || !data.description || !data.price || !data.category) {
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
    const response = await axios.post(`${url}/api/food/update`, formData, {
    headers: {
            "Content-Type": "multipart/form-data",
        },
    });

     
      if (response.data.success) {
        setUpdatePopUp(false)
        toast.success(response.data.message)
        formData.delete("prevImage")
        fetchList()
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
    const response = await axios.post(`${url}/api/food/update`, formData, {
    headers: {
            "Content-Type": "multipart/form-data",
        },
    });

      if (response.data.success) {
        setUpdatePopUp(false)
        toast.success(response.data.message)
        formData.delete("prevImage")
        fetchList()
      } else {
        toast.error(response.data.message)

 }
 }
}


  return (
    <div className='update'>
    <div className='update-container'>
    <img  className="close" onClick={() => {setUpdatePopUp(false);setFocus(true)}} src={assets.cross_icon} alt="" />
          <form onSubmit={onSubmitHandler} className="flex-col">
            <div className="update-img-uplode flex-col">
              <p>Uplode Image</p>
              <label htmlFor="image">
                <img src={image ? URL.createObjectURL(image) :imageUrl} alt="" />
                
              </label>
              <input onChange={(e) => setImage(e.target.files[0])} type="file" accept=".jpg" id="image" hidden/>
            </div>
            <div className="update-product-name flex-col">
              <p>Dish name</p>
              <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type here' />
            </div>
            <div className="update-product-description flex-col">
              <p>Dish description</p>
              <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='Write content here' required></textarea>
            </div>
            <div className="update-category-price">
              <div className="update-category flex-col">
                <p>Dish Category</p>
                <select onChange={onChangeHandler} id="slt" name="category" value={data.category}  required>
                  <option value="" disabled selected>
                    Select Category
                  </option>
                  {catList.map((cat, index) =>
                    cat.name ? (
                      <option key={index} value={cat._id}>
                        {cat.name}
                      </option>
                    ) : null
                  )
                    }
              
                </select>
              </div>
              <div className="update-price flex-col">
                <p>Dish price</p>
                <input onChange={onChangeHandler} value={data.price} type="Number" name="price" placeholder='₹20' />
              </div>
            </div>
            <button className='update-button' type='submit'>Update</button>
          </form>
          </div>
        </div>
        
  )
}

export default UpdatePopUp