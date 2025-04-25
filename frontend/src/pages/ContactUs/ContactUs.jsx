import React, { useContext, useState,useRef,useEffect } from 'react'
import './ContactUs.css'
import { toast } from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'
const ContactUs = () => {
    const{user,isLogged,url}=useContext(StoreContext)

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const[ispublic,setIsPublic]= useState(true)
    const [data,setData]= useState({
    userId:'',
    userName:'',
    email:'',
    isPublic:ispublic ? true:false ,
    feedbacktxt:''
})

const onChangeHandler = (event) => {
  const name = event.target.name;
  const value = event.target.value;
  setData(data => ({ ...data, [name]: value }))
}

const onSubmmitHandler = async (e)=>{
  if(isLogged){
   
  e.preventDefault()
  data.isPublic=ispublic
  data.userId=user._id
  data.userName=user.name
  console.log(data)
  const response= await axios.post(`${url}/api/contact/add`,data)
      if (response.data.success) {
          setData({
            userId:'',
            email:'',
            isPublic:false,
            feedbacktxt:''
          })
          toast.success(response.data.message)
          console.log("success")
        } else {
  
          toast.error(response.data.message)
        }
      }
}

useEffect(() => {
  if (isLogged) {
    setUsername(user.name || ""); 
    setEmail(user.email || "");
    console.log(user.name)
  }else{
      
  }
 
}, [isLogged, user]);

  return (
    <div className='fed-outer-container'>
        <h1 className='feed-h1'>GIVE US YOUR VALUEBLE REVIEW</h1>
    <form onSubmit={ isLogged ?onSubmmitHandler : (e)=>{e.preventDefault();toast.error("You Need To Login")} }>
        <div className='fed-inner-container'>
        <div className='fed-filed'>
      <label htmlFor="username">Username:</label>
      <input type="text"  id="username" name="username" placeholder="Enter Your Name" required value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className='fed-filed'>
      <label htmlFor="Email">Email Adress(Will not be published):</label>
      <input type="text" id='Email'  placeholder="example123@gmail.com"  name='email' value={email} onChange={(e) => setUsername(e.target.value)} />
       </div>
         <div className='fed-filed'>
        <p>Are you want to share this publicly?</p>
        <div className="fed-radio-button">
           <div>
        <label htmlFor="yes">Yes</label>
        <input type="radio" id="yes" name="IsPublic" value="true"  checked={ispublic === true} onChange={() => setIsPublic(true)}/>
          </div>
          <div>
        <label htmlFor="no">No</label>
        <input type="radio" id="no" name="IsPublic"  value="false"  checked={ispublic === false} onChange={() => setIsPublic(false)}/>
          </div>   
      
        </div>
       </div>
       <div className='fed-filed'>
     <label htmlFor="feedbacktext">What you want to say?</label>
     <textarea rows="8" cols="45" name="feedbacktxt" id="feedbacktext" required placeholder="Give us your experience" value={data.feedbacktxt} onChange={onChangeHandler}></textarea>
      </div>
     <button type="submit" id='submit'>Submit</button>
      </div>
     </form>
     
    </div>
  ) 
}

export default ContactUs