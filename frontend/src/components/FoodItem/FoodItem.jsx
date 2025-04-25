import React, {  useContext } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext.jsx';

const FoodItem = ({id,name,price,description,image,status}) => {

    const {cartItems,addToCart, removeFromCart, url} = useContext(StoreContext);

  return (
    <div className={status === true ?"food-item":'food-item deactive'} >
        <div className="food-item-image-container">
            <img src={url+"/images/"+image} alt="" className="food-item-image" />
            {

                !cartItems[id] ?(status===true?<img className='add' src={assets.add_icon_white} alt='white-add-icon' onClick={()=>addToCart(id)}/>:null):
                <div className='food-item-counter'>
                    <img onClick={()=>removeFromCart(id)} src={assets.remove_icon_red} alt="" />
                    <p>{cartItems[id]}</p>
                    <img onClick={()=>addToCart(id)} src={assets.add_icon_green}></img>
                </div>
            }
        </div>
        <div className="food-item-info">
            <div className="food-item-name-rating">
                <p>{name}</p>
            </div>
            <p className="food-item-desc">{description}</p>
            <p className="food-item-price">₹ {price}</p>
        </div>
    </div>
  )
}

export default FoodItem