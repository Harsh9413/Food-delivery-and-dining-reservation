import React, { useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import {Route, Routes} from 'react-router-dom'
import Add from './pages/Add/Add'
import AddCategory from './pages/AddCategory/AddCategory'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import UpdatePopUp from './components/UpdatePopUp/UpdatePopUp'
import Reservations from './pages/Reservations/Reservations'
import CategoryList from './pages/CategoryList/CategoryList'
import Feedback from './pages/Feedback/Feedback'
import { CatUpdatePopUp } from './components/CatUpdatePopUp/CatUpdatePopUp'
import Reports from './pages/Reports/Reports'
import DashBoard from './pages/DashBoard/DashBoard'

const App = () => {
 const [updatePopUp,setUpdatePopUp] =useState(false)
 const [catUpdatePopUp,setCatUpdatePopUp] =useState(false)
 const [data,setData] =useState({})
 const [catdata,setCatData] =useState({})

 const url ="http://localhost:4000" 

  return (
    <div>
      <ToastContainer/>
      <Navbar/>
      
      <div className="app-content">
        <Sidebar/>
        {updatePopUp?<UpdatePopUp setUpdatePopUp={setUpdatePopUp} item={data} url={url}/>:<></> }
        {catUpdatePopUp?<CatUpdatePopUp setCatUpdatePopUp={setCatUpdatePopUp} item={catdata} url={url}/>:<></> }
        <Routes>
          <Route path="/add" element={<Add url={url}/>}/>
          <Route path="/addcategory" element={<AddCategory url={url}/>}/>
          <Route path="/list" element={<List url={url} setUpdatePopUp={setUpdatePopUp} setData={setData}/>}/>
          <Route path="/categorylist" element={<CategoryList url={url} setCatUpdatePopUp={setCatUpdatePopUp} setData={setCatData}/>}/>
          <Route path="/orders" element={<Orders url={url}/>}/>
          <Route path='/reservations' element={<Reservations url={url}/>} />
          <Route path='/feedback' element={<Feedback url={url}/>} />
          <Route path='/reports' element={<Reports url={url}/>} />
          <Route path='/dashboard' element={<DashBoard url={url}/>} />
        </Routes>
      </div>
    </div>
  )
}

export default App
