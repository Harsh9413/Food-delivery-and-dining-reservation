import React, { useContext, useEffect, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

const LoginPopup = ({ setShowLogin }) => {
  const { url, setToken, setUser, setIsLogged, isLogged, user } = useContext(StoreContext);

  const [currState, setCurrState] = useState('Login');
  const [uemail, setUemail] = useState({
    emails: '',
  });
  const [data, setData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [notification, setNotification] = useState(null);
  const [formVisible, setFormVisible] = useState(true);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false); // New state for OTP verification
  const [newPassword, setNewPassword] = useState(''); // New state for new password
  const [confirmNewPassword, setConfirmNewPassword] = useState(''); // New state for confirm password

  useEffect(() => {
    localStorage.setItem('isLogged', isLogged);
    localStorage.setItem('User', JSON.stringify(user));
  }, [isLogged]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
      setShowLogin(false);
    }, 2000);
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    if (name === 'name' && !/^[a-zA-Z\s]*$/.test(value)) return;
    setData((prevData) => ({ ...prevData, [name]: value }));
    setUemail((prevData) => ({ ...prevData, [name]: value }));
  };

  const onOtpChange = (event) => {
    const { value } = event.target;
    // Allow only digits and limit to 6 characters
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
    }
  };

  const onLogin = async (event) => {
    event.preventDefault();

    if (currState === 'Sign Up') {
      const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!strongPasswordRegex.test(data.password)) {
        showNotification('Password must meet security requirements.', 'error');
        return;
      }
      if (data.password !== data.confirmPassword) {
        showNotification('Passwords do not match.', 'error');
        return;
      }
    }

    let newUrl = url + (currState === 'Login' ? '/api/user/login' : '/api/user/register');

    try {
      const response = await axios.post(newUrl, data);
      if (response.data.success) {
        if (currState === 'Login') {
          setToken(response.data.token);
          localStorage.setItem('token', response.data.token);
          setIsLogged(true);
          setUser(response.data.user);
          showNotification('Login successful!', 'success');
          setFormVisible(false);
        } else {
          showNotification('Account created successfully! Please login.', 'success');
          setCurrState('Login');
          setData({ name: '', email: '', password: '', confirmPassword: '' });
        }
      } else {
        showNotification(response.data.message, 'error');
      }
    } catch (error) {
      console.error('Error during login/register:', error);
      showNotification('An error occurred. Please try again.', 'error');
    }
  };

  const onForgotPassword = async (event) => {
    event.preventDefault();
    const response = await axios.post(`${url}/api/user/forgot-password`, { email: forgotPasswordEmail });
    if (response.data.success) {
      setNotification({ message: 'OTP sent to your email.', type: 'success' });  
      setOtpSent(true);
      setCurrState('Otp Sent');
      setTimeout(() => {
        setNotification(null);
      }, 2000);
    } else {
      showNotification(response.data.message, 'error');
    }
  };

  const onVerifyOtp = async (event) => {
    event.preventDefault();
    if (otp.length !== 6) {
      showNotification('OTP must be 6 digits.', 'error');
      return;
    }
    try {
      const response = await axios.post(`${url}/api/user/verify-otp`, {
        email: forgotPasswordEmail,
        otp: otp,
      });
      if (response.data.success) {
        setNotification({ message: 'OTP verified success fully.', type: 'success' });
        setIsOtpVerified(true); // Set OTP verification to true
        setTimeout(() => {
          setNotification(null);
        }, 2000);
      } else {
        setNotification({ message: response.data.message, type: 'error' });
        setOtp(''); // Reset OTP field
      setTimeout(() => {
        setNotification(null);
      }, 2000);
      }
    } catch (error) {
      console.error('Error during OTP verification:', error);
      showNotification('An error occurred. Please try again.', 'error');
    }
  };

  const onResetPassword = async (event) => {
    event.preventDefault();
    if (newPassword !== confirmNewPassword) {
      showNotification('Passwords do not match.', 'error');
      return;
    }
    // console.log(forgotPasswordEmail);
    // console.log(newPassword);
    try { 
      const response = await axios.post(`${url}/api/user/reset-password`, {
        email: forgotPasswordEmail,
        newPassword: newPassword,
      });

      if (response.data.success) {
        showNotification('Password reset successfully!', 'success');
        setCurrState('Login');
        setIsOtpVerified(false); // Reset OTP verification state
        setNewPassword('');
        setConfirmNewPassword('');
      } else {
        showNotification(response.data.message, 'error');
      }
    } catch (error) {
      
      console.error('Error during password reset:', error);
      showNotification('An error occurred. Please try again.', 'error');
    }
  };

  return (
    <div className="login-popup">
      {notification && (
        <div
          className={`notification ${notification.type}`}
          style={{
            position: 'fixed',
            top: '80px',
            right: '20px',
            backgroundColor: notification.type === 'success' ? '#4caf50' : '#f44336',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
            zIndex: 1000,
          }}
        >
          <p>{notification.message}</p>
        </div>
      )}

      {formVisible && (
        <form onSubmit={onLogin} className="login-popup-container">
          <div className="login-popup-title">
            <h2>{currState}</h2>
            <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
          </div>

          {currState === 'Forgot Password' ? (
            <>
              <p>Enter your email address to reset your password.</p>
              <input
                name="forgotPasswordEmail"
                onChange={(e) => setForgotPasswordEmail(e.target.value)}
                value={forgotPasswordEmail}
                type="email"
                placeholder="Your Email"
                required
              />
              <button type="submit" onClick={onForgotPassword}>Send OTP</button>
              <p>
                Remembered your password?{' '}
                <span onClick={() => setCurrState('Login')}>Login here</span>
              </p>
            </>
          ) : currState === 'Otp Sent' && !isOtpVerified ? (
            <>
              <p>Enter the OTP sent to your email.</p>
              <input
                name="otp"
                onChange={onOtpChange}
                value={otp}
                type="text"
                placeholder="Enter OTP"
                maxLength={6}
                required
              />
              <button type="submit" onClick={onVerifyOtp}>Verify OTP</button>
              <p>
                <span onClick={() => setCurrState('Login')}>Back to Login</span>
              </p>
            </>
          ) : isOtpVerified ? (
            <>
              <p>Enter your new password.</p>
              <div className="password-container">
                <input
                  name="newPassword"
                  onChange={(e) => setNewPassword(e.target.value)}
                  value={newPassword}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="New Password"
                  required
                />
                <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
              <div className="password-container">
                <input
                  name="confirmNewPassword"
                  onChange={(e) => setConfirmNewPassword(e.target.value)}
                  value={confirmNewPassword}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm New Password"
                  required
                />
                <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </span>
              </div>
              <button type="submit" onClick={onResetPassword}>Reset Password</button>
            </>
          ) : (
            <>
              <div className="login-popup-inputs">
                {currState === 'Login' ? null : (
                  <input
                    name="name"
                    onChange={onChangeHandler}
                    value={data.name}
                    type="text"
                    placeholder="Your Name"
                    required
                  />
                )}
                <input
                  name="email"
                  onChange={onChangeHandler}
                  value={data.email}
                  type="email"
                  placeholder="Your Email"
                  required
                />
                <div className="password-container">
                  <input
                    name="password"
                    onChange={onChangeHandler}
                    value={data.password}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Your Password"
                    required
                  />
                  <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </span>
                </div>
                {currState === 'Sign Up' && (
                  <div className="password-container">
                    <input
                      name="confirmPassword"
                      onChange={onChangeHandler}
                      value={data.confirmPassword}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      required
                    />
                    <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                  </div>
                )}
              </div>
              {currState === 'Sign Up' && <p className="info-text">*Service available only in Ahmedabad.</p>}
              <button type="submit">{currState === 'Sign Up' ? 'Create account' : 'Login'}</button>
              {currState === 'Login' ? (
                <p>
                  Create a new account?{' '}
                  <span onClick={() => setCurrState('Sign Up')}>Click here</span>
                  <br />
                  <br />
                  <span onClick={() => setCurrState('Forgot Password')}>Forgot Password?</span>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <span onClick={() => setCurrState('Login')}>Login here</span>
                </p>
              )}
            </>
          )}
        </form>
      )}
    </div>
  );
};

export default LoginPopup;