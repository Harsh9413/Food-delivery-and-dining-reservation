import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
    return (
        <div className='footer' id='footer'>
            <div className="footer-content">
                <div className="footer-content-left">
                    {/* <img src={assets.logoes} alt="" className='footer-content-left-logo'/> */}
                    <p>Follow Us:

                        Stay connected with us on social media for updates, special offers, and more!.</p>
                    <div className="footer-social-icons">
                        <img src={assets.facebook_icon} alt="" />
                        <a href='https://x.com/Food_del_reserv' target='_blank'><img src={assets.twitter_icon} alt="" /></a>
                        <a href='https://www.linkedin.com/in/food-delivery-dining-reserve?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app' target='_blank'> <img src={assets.linkedin_icon} alt="" /> </a>
                    </div>
                    <p><b>
                    Location: Vaishnodevi Circle, Sardar Patel Ring Rd, Ahmedabad, Gujarat 382470
                    </b></p>
                </div>
                <div className="footer-content-center">
                    <h2>COMPANY</h2>
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/menu">Menu</a></li>
                        <li><a href="/reservation">Reservation</a></li>
                        <li><a href="/contact">Contact Us</a></li>
                        <li><a href="/privacy-policy">Privacy Policy</a></li>
                    </ul>

                </div>
                <div className="footer-content-right">
                    <h2>GET IN TOUCH</h2>
                    <ul>
                        <li>+91-6355348056</li>
                        <li>sdpprojectbca@gmail.com</li>
                    </ul>
                </div>
            </div>
            <hr />
            <p className='footer-copy-right'>*Online Food Delivery And Dining Reservation</p>
        </div>
    )
}

export default Footer