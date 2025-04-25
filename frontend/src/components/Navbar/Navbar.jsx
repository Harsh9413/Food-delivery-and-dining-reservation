import React, { useContext, useState ,useEffect} from 'react'
import './Navbar.css'
import {assets} from '../../assets/assets'
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';

const Navbar = ({setShowLogin}) => {

  const [menu,setMenu] = useState("Home");
  const {getTotalCartAmount,token,setToken,isLogged,setIsLogged,setUser} =useContext(StoreContext)
  const navigate = useNavigate()

 useEffect(() => {
    localStorage.setItem("isLogged", isLogged);
    console.log(isLogged)
  }, [isLogged])

  const logout = () =>{
    localStorage.removeItem("token");
    setToken("");
    navigate("/")
    setIsLogged(false)
    localStorage.setItem("isLogged",{});
    setUser({})
  }

  return (
    <div className='navbar'>
      <Link to='/' onClick={()=>setMenu("Home")} ><img src={assets.logoes} alt="" className="logo" /></Link>
      <ul className="navbar-menu">
        <li onClick={()=>setMenu("Home")} className={menu==="Home"?"active":""}><NavLink to="/">HOME</NavLink></li>
        <li onClick={()=>setMenu("Menu")} className={menu==="Menu"?"active":""}><NavLink to="/menu">MENU</NavLink></li>
        <li onClick={()=>setMenu("Reservation")} className={menu==="Reservation"?"active":""}><NavLink to="/reservation">RESERVATION</NavLink></li>
        <li onClick={()=>setMenu("Reviews")} className={menu==="Reviews"?"active":""}><NavLink to="/reviews">REVIEWS</NavLink></li>
        <li onClick={()=>setMenu("Contact-us")} className={menu==="Contact-us"?"active":""}><NavLink to="/contactus">CONTACT US</NavLink></li>
      </ul>
      <div className="navbar-right">
        <div className="navbar-search-icon">
          <Link to='/cart'onClick={()=>setMenu("Cart")} className={menu==="Cart"?"active":""}><img src={assets.bag_icon} alt="" /></Link>
          <div className={getTotalCartAmount()===0?"":"dot"}></div>
        </div>
        {!token?<button onClick={()=>setShowLogin(true)}>Sign In</button>
        :<div className='navbar-profile'>
          <img src={assets.profile_icon} alt="" />
          <ul className='nav-profile-dropdown'>
          <li onClick={()=>navigate('/myprofile')}><img src={assets.profile_drop} alt="" /><p>Profile</p></li>
          <hr />
          <li onClick={()=>navigate('/myorders')}><img src={assets.bag} alt="" /><p>Orders</p></li>
          <hr />
          <li onClick={()=>navigate('/myreservation')}><img src={assets.res_drop} alt="" /><p>Reservation</p></li>
          <hr />
          <li onClick={logout}><img src={assets.logout_icon} alt="" /><p>Logout</p></li>

          </ul>
          </div>}
        
      </div>
    </div>
  )
}

export default Navbar