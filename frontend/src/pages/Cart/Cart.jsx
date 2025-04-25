import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../Context/StoreContext';
import {useNavigate} from  'react-router-dom'
import { assets } from '../../assets/assets';

const Cart = () => {

   
  const {cartItems,food_list,addToCart,removeFromCart,getTotalCartAmount,deleteFromCart,url} = useContext(StoreContext);
  const navigate = useNavigate();

  return (
    <div className="cart">
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Items</p>
          <p>Title</p>
          <p>Price</p>
          <p>Quantity</p>
          <p className='Total'>Total</p>
          <p className='Remove'>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item,index)=>{
            if(cartItems[item._id] > 0)
            {
              return(
                <div key={index}>
                  <div className='cart-items-title cart-items-item'>
                    <img src={url+"/images/"+item.image} alt="" />
                    <p>{item.name}</p>
                    <p>₹ {item.price}</p>
                    <div className='food-item-counter1'>
                                        <img onClick={()=>removeFromCart(item._id)} src={assets.remove_icon_red}/>
                                        <p>{cartItems[item._id]}</p>
                                        <img onClick={()=>addToCart(item._id)} src={assets.add_icon_green}></img>
                     </div>
                    <p>₹ {item.price * cartItems[item._id]}</p>
                    <p onClick={()=>(deleteFromCart(item._id))}className="cross">x</p>
                  </div>
                  <hr />
                </div>
              )
            }
        })}
      </div>
      <div className="cart-bottom">
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
          <button onClick={()=>navigate('/order')}>PROCEED TO CHECKOUT</button>
         </div>
         
      </div>
    </div>
  )
}

export default Cart