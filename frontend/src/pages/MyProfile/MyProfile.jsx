// import { useContext, useState, useEffect } from "react";
// import { StoreContext } from '../../Context/StoreContext';
// import './MyProfile.css';
// import axios from 'axios';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

// const MyProfile = () => {
//     const { user, token, url } = useContext(StoreContext);
//     const [showPasswordForm, setShowPasswordForm] = useState(false);
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");
    
//     const [data, setData] = useState({
//         id: user._id,
//         oldPassword: "",
//         newPassword: "",
//         confirmPassword: ""
//     });

//     useEffect(() => {
//         if (user?._id) {
//             setData((prev) => ({ ...prev, id: user._id }));
//         }
//     }, [user]);

//     const onChangeHandler = (event) => {
//         const { name, value } = event.target;
//         setData((prevData) => ({ ...prevData, [name]: value }));
//     };

//     const handlePasswordChange = async () => {
//         if (data.newPassword !== data.confirmPassword) {
//             setError("New passwords do not match.");
//             toast.error("New passwords do not match.");
//             return;
//         }

//         try {
//             const response = await axios.post(url + "/api/user/change-password", data, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });

//             if (response.data.success) {
//                 setSuccess("Password changed successfully!");
//                 setError("");
//                 setShowPasswordForm(false);
//                 toast.success("Password changed successfully!");
//             } else {
//                 setError(response.data.message || "Failed to change password.");
//                 toast.error(response.data.message || "Failed to change password.");
//             }
//         } catch (error) {
//             const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
//             setError(errorMessage);
//             toast.error(errorMessage);
//         }
//     };

//     return (
//         <div className="profile-container-h">
//             <ToastContainer position="top-right" autoClose={3000} />
            
//             <div className="profile-header">
//                 <div className="profile-icon">✔️</div>
//                 <h2 className="profile-name">{user?.name || "NA"}</h2>
//             </div>

//             <div className="profile-details">
//                 <div className="profile-item">
//                     <i className="fas fa-envelope"></i>
//                     <div>
//                         <p className="profile-label">Email</p>
//                         <p>{user?.email || "NA"}</p>
//                     </div>
//                 </div>

//                 <div className="profile-item">
//                     <i className="fas fa-phone"></i>
//                     <div>
//                         <p className="profile-label">Phone</p>
//                         <p>+91 {user?.phoneNo || " ----- -----"}</p>
//                     </div>
//                 </div>

//                 <div className="profile-item">
//                     <i className="fas fa-map-marker-alt"></i>
//                     <div>
//                         <p className="profile-label">City</p>
//                         <p>{user?.city || "Ahmedabad"}</p>
//                     </div>
//                 </div>

//                 <div className="profile-item">
//                     <i className="fas fa-home"></i>
//                     <div>
//                         <p className="profile-label">Address</p>
//                         <p>{user?.address || "NA"}</p>
//                     </div>
//                 </div>
//                 <div className="profile-item">
//                     <i className="fas fa-home"></i>
//                     <div>
//                         <p className="profile-label">Area</p>
//                         <p>{user?.areaId?.area  || "NA"}</p>
//                     </div>
//                 </div>
//                 <div className="profile-item">
//                     <i className="fas fa-home"></i>
//                     <div>
//                         <p className="profile-label">Pincode</p>
//                         <p>{user?.areaId?.pincode || "NA"}</p>
//                     </div>
//                 </div>
//                 {/* <div className="profile-item"> */}
//                     {/* <i className="fas fa-home"></i> */}
//                     <div className="update-info-btn-div">
//                         <button className="update-info-btn">Update Information</button>
//                     </div>
//                 {/* </div> */}
//             </div>

//             <div className="password-container">
//                 <div className="password-label">
//                     <i className="fas fa-key"></i>
//                     <p>Change Password</p>
//                 </div>
//                 <button
//                     className="update-password-btn"
//                     onClick={() => setShowPasswordForm(!showPasswordForm)}
//                 >
//                     Update Password
//                 </button>
//             </div>

//             {showPasswordForm && (
//                 <div className="password-form">
//                     <h3>Change Password</h3>

//                     {error && <p className="error-message">{error}</p>}
//                     {success && <p className="success-message">{success}</p>}

//                     <label>Current Password</label>
//                     <input
//                         name="oldPassword"
//                         type="password"
//                         placeholder="Enter current password"
//                         onChange={onChangeHandler}
//                         value={data.oldPassword}
//                     />

//                     <label>New Password</label>
//                     <input
//                         name="newPassword"
//                         type="password"
//                         placeholder="Enter new password"
//                         value={data.newPassword}
//                         onChange={onChangeHandler}
//                     />

//                     <label>Confirm New Password</label>
//                     <input
//                         name="confirmPassword"
//                         type="password"
//                         placeholder="Confirm new password"
//                         value={data.confirmPassword}
//                         onChange={onChangeHandler}
//                     />

//                     <div className="password-actions">
//                         <button className="save-btn" onClick={handlePasswordChange}>
//                             Save Changes
//                         </button>
//                         <button
//                             className="cancel-btn"
//                             onClick={() => setShowPasswordForm(false)}
//                         >
//                             Cancel
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// };

// export default MyProfile;

import { useContext, useState, useEffect } from "react";
import { StoreContext } from '../../Context/StoreContext';
import './MyProfile.css';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const MyProfile = () => {
    const { user, token, url } = useContext(StoreContext);
    const [areaList,setAreaList] = useState([])
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [showUpdateInfoForm, setShowUpdateInfoForm] = useState(false); // State for update info form
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    
    const [data, setData] = useState({
        id: user._id,
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [userInfo, setUserInfo] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phoneNo: user?.phoneNo || "",
        city: user?.city || "",
        address: user?.address || "",
        areaId: user?.areaId || { area: "", pincode: "" }
    });

    const fetchAreaList = async () => {
        try {
            const response = await axios.get(url + "/api/area/arealist");
            if (response.data.success) {
                setAreaList(response.data.data);
                // console.log(areaList);
                
            } else {
                toast.error(response.data.message || "Failed to fetch areas.");
            }
        } catch (error) {
            toast.error("Error fetching areas.");
        }
    };


    useEffect(() => {
        if (user?._id) {
            setData((prev) => ({ ...prev, id: user._id }));
            setUserInfo({
                id: user._id,
                name: user?.name || "",
                email: user?.email || "",
                phoneNo: user?.phoneNo || "",
                city: user?.city || "",
                address: user?.address || "",
                areaId: user?.areaId || { area: "", pincode: "" }
            });
        }
        fetchAreaList();
        fetchusedata();
    }, [user]);

    const onChangeHandler = (event) => {
        const { name, value } = event.target;
        setData((prevData) => ({ ...prevData, [name]: value }));
    };

    const onUserInfoChangeHandler = (event) => {
        const { name, value } = event.target;
        if (name === "area" || name === "pincode") {
            setUserInfo((prev) => ({
                ...prev,
                areaId: {
                    ...prev.areaId,
                    [name]: value
                }
            }));
        } else {
            setUserInfo((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handlePasswordChange = async () => {
        if (data.newPassword !== data.confirmPassword) {
            setError("New passwords do not match.");
            toast.error("New passwords do not match.");
            return;
        }

        try {
            const response = await axios.post(url + "/api/user/change-password", data, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (response.data.success) {
                setSuccess("Password changed successfully!");
                setError("");
                setShowPasswordForm(false);
                toast.success("Password changed successfully!");
            } else {
                setError(response.data.message || "Failed to change password.");
                toast.error(response.data.message || "Failed to change password.");
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
            setError(errorMessage);
            toast.error(errorMessage);
        }
    };

    const fetchusedata = async () => {
        const userdatas = await axios.post(url + "/api/user/userdata", { id: user._id });   
        console.log(userdatas);
    }
    

    const handleUpdateInfo = async (event) => {
        event.preventDefault();  // Now event is properly defined
        // console.log(userInfo);
        
        // console.log(userInfo.phoneNo);
    
        if(userInfo.phoneNo==user.phoneNo){

        }
        else{
            if (!userInfo.phoneNo || userInfo.phoneNo.length !== 10) {
                setError("Phone number must be 10 digits.");
                toast.error("Phone number must be 10 digits.");
                return;
            }
        }
    
        if (!userInfo.name || !userInfo.phoneNo || !userInfo.address || !userInfo.areaId._id) {
            setError("All fields are required.");
            toast.error("All fields are required.");
            return;
        }
    
        setError("");    
        console.log(userInfo);
        const response = await axios.post(url + "/api/user/update-info", userInfo);
        console.log(response);
        if (response.data.success) {
            setSuccess("Information updated successfully!");
            setError("");
            setShowUpdateInfoForm(false);
            toast.success("Information updated successfully!");
        } else {
            setError(response.data.message || "Failed to update information.");
            toast.error(response.data.message || "Failed to update information.");
        }

        // try {
        //     const response = await axios.put(url + "/api/user/update-info", userInfo, {
        //         headers: { Authorization: `Bearer ${token}` }
        //     });

        //     if (response.data.success) {
        //         setSuccess("Information updated successfully!");
        //         setError("");
        //         setShowUpdateInfoForm(false);
        //         toast.success("Information updated successfully!");
        //     } else {
        //         setError(response.data.message || "Failed to update information.");
        //         toast.error(response.data.message || "Failed to update information.");
        //     }
        // } catch (error) {
        //     const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
        //     setError(errorMessage);
        //     toast.error(errorMessage);
        // }
    };

    return (
        <div className="profile-container-h">
            <ToastContainer position="top-right" autoClose={3000} />
            
            <div className="profile-header">
                <div className="profile-icon">✔️</div>
                <h2 className="profile-name">{user?.name || "NA"}</h2>
            </div>

            <div className="profile-details">
                <div className="profile-item">
                    <i className="fas fa-envelope"></i>
                    <div>
                        <p className="profile-label">Email</p>
                        <p>{user?.email || "NA"}</p>
                    </div>
                </div>

                <div className="profile-item">
                    <i className="fas fa-phone"></i>
                    <div>
                        <p className="profile-label">Phone</p>
                        <p>+91 {user?.phoneNo || " ----- -----"}</p>
                    </div>
                </div>

                <div className="profile-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <div>
                        <p className="profile-label">City</p>
                        <p>{user?.city || "Ahmedabad"}</p>
                    </div>
                </div>

                <div className="profile-item">
                    <i className="fas fa-home"></i>
                    <div>
                        <p className="profile-label">Address</p>
                        <p>{user?.address || "NA"}</p>
                    </div>
                </div>
                <div className="profile-item">
                    <i className="fas fa-home"></i>
                    <div>
                        <p className="profile-label">Area</p>
                        <p>{user?.areaId?.area  || "NA"}</p>
                    </div>
                </div>
                <div className="profile-item">
                    <i className="fas fa-home"></i>
                    <div>
                        <p className="profile-label">Pincode</p>
                        <p>{user?.areaId?.pincode || "NA"}</p>
                    </div>
                </div>
                <div className="update-info-btn-div">
                    <button className="update-info-btn" onClick={() => setShowUpdateInfoForm(true)}>
                        Update Information
                    </button>
                </div>
            </div>

            <div className="password-container">
                <div className="password-label">
                    <i className="fas fa-key"></i>
                    <p>Change Password</p>
                </div>
                <button
                    className="update-password-btn"
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                >
                    Update Password
                </button>
            </div>

            {showPasswordForm && (
                <div className="password-form">
                    <h3>Change Password</h3>

                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}

                    <label>Current Password</label>
                    <input
                        name="oldPassword"
                        type="password"
                        placeholder="Enter current password"
                        onChange={onChangeHandler}
                        value={data.oldPassword}
                    />

                    <label>New Password</label>
                    <input
                        name="newPassword"
                        type="password"
                        placeholder="Enter new password"
                        value={data.newPassword}
                        onChange={onChangeHandler}
                    />

                    <label>Confirm New Password</label>
                    <input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm new password"
                        value={data.confirmPassword}
                        onChange={onChangeHandler}
                    />

                    <div className="password-actions">
                        <button className="save-btn" onClick={handlePasswordChange}>
                            Save Changes
                        </button>
                        <button
                            className="cancel-btn"
                            onClick={() => setShowPasswordForm(false)}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

{showUpdateInfoForm && (
    <div className="update-info-overlay">
        <div className="update-info-form">
            <h3>Update Information</h3>

            {error && <p className="error-message">{error}</p>}
            {success && <p className="success-message">{success}</p>}
        <div className="harsh-virani">
            <div className="form-group">
                <label>Name</label>
                <div className="harsh-virani2">
                <input
                    name="name"
                    type="text"
                    placeholder="Enter  name"
                    value={userInfo.name}
                    onChange={onUserInfoChangeHandler}
                />
                </div>
            </div>

            <div className="form-group">
                <label>Email</label>
                <div className="harsh-virani2">
                <input readOnly
                    name="email"
                    placeholder="Email"
                    value={userInfo.email}
                    onChange={onUserInfoChangeHandler}
                />
                </div>
            </div>
</div>
<div className="harsh-virani">
            <div className="form-group">
                <label>Phone</label>
                <div className="harsh-virani2">
                <input
    name="phoneNo"
    type="text"
    placeholder="Enter mobile no"
    value={userInfo.phoneNo || ""}  // Ensure it's never undefined
    onChange={(e) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        if (value.length <= 10) {  // Restrict length to 10
            setUserInfo((prev) => ({ ...prev, phoneNo: value }));
        }
    }}
    maxLength="10"
    required
/>

                </div>
            </div>

            <div className="form-group">
                <label>City</label>
                <div className="harsh-virani2">
                <input readOnly
                    name="price"
                    type="text"
                    placeholder="city"
                    value={userInfo.city}
                    onChange={onUserInfoChangeHandler}
                />
                </div>
            </div>
            </div>

            <div className="form-group">
                <label>Address</label>
                <div className="harsh-virani2">
                <input 
                    name="address"
                    type="text"
                    placeholder="city"
                    value={userInfo.address}
                    onChange={onUserInfoChangeHandler}
                />
                </div>
            </div>
            <div className="harsh-virani">
            <div className="form-group">
    <label>Select Area</label>
    <div className="harsh-virani2">
    <select
        name="areaId"
        value={userInfo.areaId._id || ""}
        onChange={(e) => {
            const selectedAreaId = e.target.value;
            const selectedArea = areaList.find((item) => item._id === selectedAreaId);

            setUserInfo((prev) => ({
                ...prev,
                areaId: {
                    ...prev.areaId,
                    _id: selectedAreaId,
                    area: selectedArea?.area || "",
                    pincode: selectedArea?.pincode || "",
                }
            }));
        }}
        required
    >
        <option value="" disabled>
            Select Area
        </option>
        {areaList.map((item) => (
            <option key={item._id} value={item._id}>
                {item.area}
            </option>
        ))}
    </select>
    </div>
</div>

<div className="form-group">
    <label>Pincode</label>
    <div className="harsh-virani2">
    <input
        name="pincode"
        type="text"
        placeholder="Pincode"
        value={userInfo.areaId.pincode}
        readOnly
    />
    </div>
</div>

            </div>
            <div className="form-actions">
                <button className="save-btn" onClick={handleUpdateInfo}>
                    Save Changes
                </button>
                <button
                    className="cancel-btn"
                    onClick={() => setShowUpdateInfoForm(false)}
                >
                    Cancel
                </button>
            </div>
        </div>
    </div>
)}
            
        </div>
    );
};

export default MyProfile;
