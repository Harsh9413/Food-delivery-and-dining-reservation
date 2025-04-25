import React, { useState } from 'react'
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home/Home'
import Menu from './pages/Menu/Menu'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Reservation from './pages/Reservation/Reservation'
import Footer from './components/Footer/Footer';
import LoginPopup from './components/LoginPopup/LoginPopup'
import Verify from './pages/verify/verify'
import MyOrders from './pages/MyOrders/MyOrders'
import MyReservation from './pages/MyReservation/MyReservation'
import MyProfile from './pages/MyProfile/MyProfile'
import ContactUs from './pages/ContactUs/ContactUs'
import { ToastContainer } from 'react-toastify'
import Verifi from './pages/Verifi/Verifi'
import Reviews from './pages/Reviews/Reviews'

const App = () => {

  const [showLogin,setShowLogin] =useState(false)
  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin} />:<></>}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin}/>
        <ToastContainer />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/menu' element={<Menu />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/reservation' element={<Reservation />} />
          <Route path='/verify' element={<Verify/>} />
          <Route path='/myorders' element={<MyOrders/> } />
          <Route path='/myreservation' element={<MyReservation/>} />
          <Route path='/myprofile' element={<MyProfile/>} />
          <Route path='/contactus' element={<ContactUs/>}/>
          <Route path='/verifi' element={<Verifi/>}></Route>
          <Route path='/reviews' element={<Reviews/>}></Route>
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App