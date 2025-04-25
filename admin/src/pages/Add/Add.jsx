import React, { useState, useEffect } from 'react'
import './Add.css'
import { assets } from "../../assets/assets"

import axios from 'axios'


const Add = ({ url }) => {
  const [catList, setCatList] = useState([]);
  const [image, setImage] = useState(false);
  const [data, setData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  })


  const fetchCategory = async () => {
    const response = await axios.get(`${url}/api/food/add`)

    if (response.data.success) {
      setCatList(response.data.data);
    } else {
      toast.error("Error")
    }
  }

  useEffect(() => {
    fetchCategory();
  }, [])

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }))
  }

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    const extension = image.name.split('.').pop().toLowerCase();
    if (extension === "jpeg" || extension === "jpg") {
      const formData = new FormData();
      formData.append("name", data.name)
      formData.append("description", data.description)
      formData.append("price", Number(data.price))
      formData.append("category", data.category)
      formData.append("image", image)

      const response = await axios.post(`${url}/api/food/add`, formData)
      if (response.data.success) {
        setData({
          name: "",
          description: "",
          price: "",
          category: "",
          status: true
        })
        setImage(false)
        toast.success(response.data.message)
      } else {

        toast.error(response.data.message)
      }
    } else {
      toast.error("Select JPG or JPEG file")
    }
  }




  return (
    <div className='add'>

      <form onSubmit={onSubmitHandler} className="flex-col">
        <div className="add-img-uplode flex-col">
          <p>Uplode Image</p>
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
          </label>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" accept=".jpg" id="image" hidden required />
        </div>
        <div className="add-product-name flex-col">
          <p>Dish name</p>
          <input onChange={onChangeHandler} value={data.name} type="text" name='name' placeholder='Type here' />
        </div>
        <div className="add-product-description flex-col">
          <p>Dish description</p>
          <textarea onChange={onChangeHandler} value={data.description} name="description" rows="6" placeholder='Write content here' required></textarea>
        </div>
        <div className="add-category-price">
          <div className="add-category flex-col">
            <p>Dish Category</p>
              {/* <select onChange={onChangeHandler}  name="category">
              {catList.map((item,index)=>(
                  !item.name ?null: <option key={index} value={item.name}>{item.name}</option>
                ))}
                { /*<option value="Salad">Salad</option>
                <option value="Rolls">Rolls</option>
                <option value="Deserts">Deserts</option>
                <option value="Sandwich">Sandwich</option>
                <option value="Cake">Cake</option>
                <option value="Pure Veg">Pure Veg</option>
                <option value="Pasta">Pasta</option>
                <option value="Noodles">Noodles</option> */
                //</select> */}
            }
            <select onChange={onChangeHandler} name="category" value={data.category} required>
              <option value="" disabled selected>
                Select Category
              </option>
              {catList.map((item, index) =>
                item.name ? (
                  <option key={index} value={item._id}>
                    {item.name}
                  </option>
                ) : null
              )}
            </select>
          </div>
          <div className="add-price flex-col">
            <p>Dish price</p>
            <input onChange={onChangeHandler} value={data.price} type="Number" name="price" placeholder='₹20' />
          </div>
        </div>
        <button className='add-button' type='submit'>ADD</button>
      </form>

    </div>
  )
}
import './Add.css'
import { toast } from 'react-toastify'

export default Add