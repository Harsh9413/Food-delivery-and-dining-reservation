import React from 'react'
import { useState } from 'react'
import './Report.css'
import { useEffect } from 'react'
import axios from 'axios'
import jsPDF from 'jspdf';
import { assets } from '../../assets/assets.js'
import autoTable from 'jspdf-autotable';

const Reports = ({ url }) => {
  const [showSecList, setShowSecList] = useState(true)
  const [model, setModel] = useState()
  const [startingDate, setStartDate] = useState()
  const [endingDate, setEndDate] = useState()
  const [all, setAll] = useState(false)
  const [data, setData] = useState([])
  const [isDateRequired, setIsDateRequired] = useState(true);
  const [isSubmit, setIsSubmit] = useState(false)
  const [isModelSelct, setIsModelSelect] = useState("")
  const [isRangeSelct, setIsRangeSelect] = useState("")
  const [isCostome,setIsCustome]=useState(false)
  const [isSorted, setIsSorted] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
 
  const sortData = () => {
    const sortedData = [...filteredData].sort((a, b) => {
      let key = "";
  
      switch (isModelSelct) {
        case "userModel":
          key = "name"; // Customer Name
          break;
        case "foodModel":
          key = "name"; // Dish Name
          break;
        case "ReservationModel":
          key = "First_Name"; // First Name (Reservations)
          break;
        case "orderModel":
          key = "address"; // Customer Name in Orders
          return isSorted 
            ? b[key]?.name?.localeCompare(a[key]?.name)
            : a[key]?.name?.localeCompare(b[key]?.name);
        case "Payments":
          key = "user"; // Customer Name in Payments
          return isSorted 
            ? b[key]?.name?.localeCompare(a[key]?.name)
            : a[key]?.name?.localeCompare(b[key]?.name);
        case "FeedbackModel":
          key = "userName"; // Customer Name in Feedback
          break;
        default:
          return 0; // No sorting if no matching model
      }
  
      return isSorted
        ? b[key]?.toString().localeCompare(a[key]?.toString())
        : a[key]?.toString().localeCompare(b[key]?.toString());
    });
  
    setFilteredData(sortedData);
    setIsSorted(!isSorted);
  };
  


  const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };


const downloadPDF = () => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.width;
  const pageHeight = pdf.internal.pageSize.height;
  let pageNumber = 1;

  const formattedModel = capitalizeFirstLetter(isModelSelct.replace("Model", ""));
  const formattedRange = capitalizeFirstLetter(isRangeSelct);
  let title = "";
  if (isModelSelct === "foodModel") {
    title = `Current Menu Report`;
  } else {
    title = `${formattedModel} Report of ${formattedRange}`;
  }

  // Add Image (Logo) - Left Side
  const imageUrl = assets.logo;
  const imageWidth = 30;
  const imageHeight = 30;
  const imageX = 10;
  const imageY = 10;

  pdf.addImage(imageUrl, 'JPEG', imageX, imageY, imageWidth, imageHeight);

  // Add Address (Right-Aligned, Same Line as Logo)
  const addressX = pageWidth - 10;
  const addressY = imageY + 5;

  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.text("Global Restaurant, Vaishnodevi Circle,", addressX, addressY, { align: 'right' });
  pdf.text("Sardar Patel Ring Rd, Ahmedabad, Gujarat 382470", addressX, addressY + 7, { align: 'right' });
  pdf.text("Contact: +91-6355348056", addressX, addressY + 14, { align: 'right' });

  // Add Horizontal Line Below Header
  const lineY = imageY + imageHeight + 5;
  pdf.setDrawColor(0);
  pdf.line(10, lineY, pageWidth - 10, lineY);

  // Add Report Title (Centered)
  pdf.setFontSize(16);
  const titleWidth = pdf.getTextWidth(title);
  pdf.text(title, (pageWidth - titleWidth) / 2, lineY + 10);

  // ✅ Add today's date below title
  const todayDate = new Date().toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
  const dateText = `Date: ${todayDate}`;
  pdf.setFontSize(12);
  const dateWidth = pdf.getTextWidth(dateText);
  pdf.text(dateText, (pageWidth - dateWidth) / 2, lineY + 18);

  // Add Table Below Title + Date
  let tableStartY = lineY + 25;

  let headers = [];
  let tableData = [];

  switch (isModelSelct) {
    case "userModel":
      headers = ["Customer Name", "Email", "Phone No.", "Area", "City"];
      tableData = filteredData.map(item => [
        item.name, item.email, item.phoneNo || "N/A", item.areaId?.area || "N/A", item.city
      ]);
      break;

    case "foodModel":
      headers = ["Dish Name", "Price", "Category", "Status", "Description"];
      tableData = filteredData.map(item => [
        item.name, item.price, item.category?.name || "N/A",
        item.status ? "Available" : "Out of Stock",
        item.description.length > 15 ? item.description.substring(0, 15) + "..." : item.description
      ]);
      break;

    case "ReservationModel":
      headers = ["Customer Name", "People", "Time", "Date", "Status"];
      tableData = filteredData.map(item => [
        `${item.First_Name} ${item.Last_name}`, item.People, item.Time,
        new Date(item.Date).toLocaleDateString('en-GB'), item.Status
      ]);
      break;

    case "orderModel":
      headers = ["Customer", "Items", "Date", "Amount", "Area"];
      tableData = filteredData.map(item => [
        item.address?.name,
        item.items.map(subItem => `${subItem.name} x (${subItem.quantity})`).join(", "),
        new Date(item.date).toLocaleDateString('en-GB'),
        item.amount,
        item.address?.areaName
      ]);
      break;

    case "Payments":
      headers = ["Customer Name", "Email", "Amount", "Status", "Type"];
      tableData = filteredData.map(item => [
        item.user?.name, item.user?.email, item.amount, item.status, item.type
      ]);
      break;

    case "FeedbackModel":
      headers = ["Customer Name", "Date", "Time", "Is Public", "Review"];
      tableData = filteredData.map(item => [
        item.userName,
        new Date(item.feedbackDT).toLocaleDateString('en-GB'),
        new Date(item.feedbackDT).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }),
        item.isPublic ? "Yes" : "No",
        item.feedbackText.length > 15 ? item.feedbackText.substring(0, 15) + "..." : item.feedbackText
      ]);
      break;

    default:
      headers = ["No Data Available"];
      tableData = [];
      break;
  }

  autoTable(pdf, {
    head: [headers],
    body: tableData,
    startY: tableStartY,
    theme: "striped",
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [100, 100, 100], textColor: 255 },
    margin: { top: 45, bottom: 20 },
    didDrawPage: () => {
      pdf.setFontSize(8);
      pdf.text("Email: sdpproject@gmail.com", pageWidth - 40, pageHeight - 10, { align: 'right' });

      pdf.setFontSize(10);
      pdf.text(`Page ${pageNumber}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
      pageNumber++;
    }
  });

  pdf.save(`${title}.pdf`);
};



  const handleSelectModel = (event) => {
    const selectedValue = event.target.value;




    if (selectedValue === "foodModel") {
      setShowSecList(false)
      setIsDateRequired(false);
    } else {
      setShowSecList(true)
      setIsDateRequired(true);
    }
    setModel(selectedValue)
    setSelectedFilters({}); // Reset filters
    setFilteredData([]); 
  };

  const handleSelectRange = (event) => {
    const selectedRange = event.target.value;
    let startDate, endDate;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedRange === "Last Month") {
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      setAll(false)
    } else if (selectedRange === "This Month") {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      setAll(false)
    } else if (selectedRange === "This Week") {
      const firstDayOfWeek = new Date(today);
      firstDayOfWeek.setDate(today.getDate() - today.getDay()); // Get Sunday of the week
      startDate = firstDayOfWeek;
      today.setHours(23, 59, 59, 999);
      endDate = new Date(today);
      setAll(false)
    } else if (selectedRange === "Today") {
      startDate = new Date(today);
      today.setHours(23, 59, 59, 999);
      endDate = new Date(today);

      console.log(endDate)
      setAll(false)
    } else if (selectedRange === "Custome") {
      startDate=startingDate;
      endDate=endingDate;
    } else {
      setAll(true)
      startDate = null;
      endDate = null;
    }
    setStartDate(startDate)
    setEndDate(endDate)
    setIsRangeSelect(selectedRange)
  };


  const onSubmitHandler = async (e) => {

    e.preventDefault()
    if (model) {
      console.log(model)
      console.log(startingDate)
      console.log(endingDate)
      const params = {
        model: model,
        all: all,
      };
      // ✅ Only send startDate & endDate if "All" is NOT selected
      if (!all) {
        params.startDate = startingDate;
        params.endDate = endingDate;
      }
      try {
        const res = await axios.get(`${url}/api/report/getreport`, { params });
        //console.log(res.data.data);
        if (res.data.success) {
          setData(res.data.data)
          setIsSubmit(true)
          setIsModelSelect(model)
         
        }
      } catch (error) {
        console.error("Error fetching reports:", error.response?.data || error.message);
      }

    }
  }
  
  // useEffect(() => {
  //   // console.log(data)
  //   console.log(isRangeSelct)
  // }, [isRangeSelct])

 // Handle filter change
 const handleFilterChange = (filterKey, value) => {
  console.log("Filter Key:", filterKey, "Value Selected:", value);
  setSelectedFilters((prevFilters) => ({
    ...prevFilters,
    [filterKey]: value,
  }));
};

  // Apply filtering when filters change
  useEffect(() => {
    let filtered = [...data];
  
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value !== "All") {
        filtered = filtered.filter((item) =>
          key.includes(".") // Check if key is nested (e.g., "areaId.area")
            ? key.split(".").reduce((acc, k) => acc?.[k], item) === value
            : item[key] === value
        );
      }
    });
  
    setFilteredData(filtered);
  }, [selectedFilters, data]);
  useEffect(() => {
    setFilteredData(data); // ✅ Update filteredData whenever data changes
  }, [data]);

  return (
    <div className='outer'>
      <h2 className='header' >Reports</h2>
      <form onSubmit={onSubmitHandler}>
        <div className='head'>

          <div className='list'>
            <label htmlFor="main-list">Filter by</label>
            <select onChange={(e) => handleSelectModel(e)} id="main-list" name="main-list" required>
              <option value="" disabled selected> Select Option</option>
              <option value="userModel" >Customers Details</option>
              <option value="foodModel" >Current Menu</option>
              <option value="ReservationModel">Reservations Details</option>
              <option value="orderModel">Orders Details</option>
              <option value="Payments">Payments Details</option>
              <option value="FeedbackModel">All Reviews</option>
            </select>
          </div>
          <div className={showSecList ? 'list' : 'hide'}>
            <label htmlFor="second-list">Date range</label>
            <select onChange={(event)=>{handleSelectRange(event);event.target.value=="Custome"?setIsCustome(true):setIsCustome(false)}} id="second-list" name="second-list" required={isDateRequired}>
              <option value="" disabled selected>Select Time</option>
              <option value="Last Month">Last Month</option>
              <option value="This Month">This Month</option>
              <option value="This Week">This Week</option>
              <option value="Today">Today</option>
              <option value="Custome">Custome</option>
              <option value="All">All</option>
            </select>
          </div>
         <div className={isCostome ? 'Dates' : 'hide'}>
            <div className="st Dates">
              <label htmlFor="startdate" required={isCostome}>Start Date</label>
              <input
                type="date"
                name="startdate"
                onChange={(e) => {
                  const formattedDate = new Date(e.target.value).toString();
                  setStartDate(formattedDate);
                }}
              />
            </div>
            <div className="en Dates">
              <label htmlFor="lastdate" required={isCostome}>Last Date</label>
              <input
                type="date"
                name="lastdate"
                onChange={(e) => {
                  const formattedDate = new Date(e.target.value).toString();
                  setEndDate(formattedDate);
                }}
              />
            </div>
          </div>
          <button type='submit'>Generate</button>
          {/* <div className='Downlode'>
            <button onClick={downloadPDF}><img src={assets.download} alt="downloading-updates"/></button>
            </div> */}
          <div className='Downlode'>
            <button
              onClick={downloadPDF}
              disabled={!isSubmit || data.length === 0}
              style={{ opacity: (!isSubmit || data.length === 0) ? 0.5 : 1, cursor: (!isSubmit || data.length === 0) ? 'not-allowed' : 'pointer' }}>
              <img src={assets.download} alt="downloading-updates" />
            </button>
          </div>

        </div>

      </form>

      {isSubmit ? (
        <div className='body'>
          <div className='list-data'>
          {isSubmit && data.length > 0 && (
          <button type='button' onClick={sortData}> ⬆⬇</button>
            )}
            <div className='data-heading'>
          
              {isModelSelct === "userModel" && (
                <>
                  <b>Caustomer Name</b> <b>Email</b> <b>Phone no.</b> 
                  <select name="type" id="type" onChange={(e) => handleFilterChange("areaId.area", e.target.value)}>
                  <option value="" disabled selected>Area</option>
                    <option value="Navrangpura">Navrangpura</option>
                    <option value="Maninagar">Maninagar</option>
                    <option value="Ghatlodiya">Ghatlodiya</option>
                    <option value="Vastrapur">Vastrapur</option>
                    <option value="Satelite">Satelite</option>
                    <option value="Nikol">Nikol</option>
                    <option value="Paldi">Paldi</option>
                    <option value="Lal Darwaja">Lal Darwaja</option>
                    <option value="All">All</option>
                  </select>
                  <b>City</b>
                </>
              )}
              {isModelSelct === "orderModel" && (
                <>
                  <b>Customer</b> <b>Items</b> <b>Date</b> <b>Amount</b> 
                  <select name="type" id="type" onChange={(e) => handleFilterChange("address.areaName", e.target.value)}>
                  <option value="" disabled selected>Area</option>
                    <option value="Navrangpura">Navrangpura</option>
                    <option value="Maninagar">Maninagar</option>
                    <option value="Ghatlodiya">Ghatlodiya</option>
                    <option value="Vastrapur">Vastrapur</option>
                    <option value="Satelite">Satelite</option>
                    <option value="Nikol">Nikol</option>
                    <option value="Paldi">Paldi</option>
                    <option value="Lal Darwaja">Lal Darwaja</option>
                    <option value="All">All</option>
                  </select>
                </>

              )}
              {isModelSelct === "foodModel" && (
                <>
                  <b>Dish Name</b>  <b>Price</b> 
                  <select name="type" id="type" onChange={(e) => handleFilterChange("category.name", e.target.value)}>
                  <option value="" disabled selected>Categoty</option>
                    <option value="Gujrati ">Gujrati</option>
                    <option value="Punjabi">Punjabi</option>
                    <option value="Deserts">Deserts</option>
                    <option value="Rajasthani">Rajasthani</option>
                    <option value="South-Indian">South-Indian</option>
                    <option value="Marathi-Food">Marathi-Food</option>
                    <option value="Fast-Food">Fast-Food</option>
                    <option value="Extra">Extra</option>
                    <option value="All">All</option>
                  </select>
                   <b>Status</b> <b>Description</b>
                </>
              )}
              {isModelSelct === "ReservationModel" && (
                <>
                  <b>Caustomer Name</b> <b>People</b> <b>Time</b> <b>Date</b> 
                  <select name="type" id="type" onChange={(e) => handleFilterChange("Status", e.target.value)}>
                  <option value="" disabled selected>Status</option>
                    <option value="Booked">Booked</option>
                    <option value="Cancelled">Cancelled</option>
                    <option value="All">All</option>
                  </select>
                </>
              )}
              {isModelSelct === "FeedbackModel" && (
                <>
                  <b>Caustomer Name</b> <b>Date</b> <b>Time</b> <b>Is Public</b> <b>Review</b>
                </>
              )}
              {isModelSelct === "Payments" && (
                <>
                  <b>Caustomer Name</b> <b>Email</b> <b>Amount</b> <b>Status</b> 
                  <select name="type" id="type"  onChange={(e) =>  handleFilterChange("type", e.target.value)}>
                  <option value="" disabled selected>Type</option>
                    <option value="Online Order">Order</option>
                    <option value="Reservation">Reservation</option>
                    <option value="All">All</option>
                  </select>
                </>
              )}

            </div>
            <div>
              {filteredData .length > 0 ? (
                filteredData.map((item) => {
                  switch (isModelSelct) {
                    case "userModel":
                      return (
                        <div key={item.id} className="dataList-user">
                          <p>{item.name}</p>
                          <p>{item.email}</p>
                          <p>{item.phoneNo || "N/A"}</p>
                          <p>{item.areaId?.area || "N/A"}</p>
                          <p>{item.city}</p>
                        </div>
                      );

                    case "foodModel":
                      return (
                        <div key={item.id} className="dataList-food">
                          <p>{item.name}</p>
                          <p>{item.price}</p>
                          <p>{item.category?.name || "N/A"}</p>
                          <p>{item.status ? "Available" : "Out of Stock"}</p>
                          <p>{item.description ? (item.description.length > 15 ? item.description.substring(0, 15) + "..." : item.description) : "N/A"}</p>


                        </div>
                      );

                    case "ReservationModel":
                      return (
                        <div key={item.id} className="dataList-res">
                          <p>{item.First_Name + " " + item.Last_name}</p>
                          <p>{item.People}</p>
                          <p>{item.Time}</p>
                          <p>{new Date(item.Date).toLocaleDateString('en-GB')}</p>
                          <p>{item.Status}</p>
                        </div>
                      );

                    case "orderModel":
                      return (
                        <div key={item.id} className="dataList-odr">
                          <p>{item.address?.name}</p>
                          <p>
                            {item.items?(item.items.map((subItem, index) => (
                              subItem.name + " x (" + subItem.quantity + ") "

                            ))):"N/A"}
                          </p>
                          <p>{new Date(item.date).toLocaleDateString('en-GB')}</p>
                          <p>{item.amount}</p>
                          <p>{item.address?.areaName}</p>
                        </div>
                      );

                    case "Payments":
                      return (
                        
                        <div key={item.id} className="dataList-pay">
                          <p>{item.user?.name}</p>
                          <p>{item.user?.email}</p>
                          <p>{item.amount}</p>
                          <p>{item.status}</p>
                          <p>{item.type}</p>
                        </div>
                      );
                    case "FeedbackModel":
                      return (
                        <div key={item.id} className="dataList-fed">
                          <p>{item.userName}</p>
                          <p>{new Date(item.feedbackDT).toLocaleDateString('en-GB')}</p>
                          <p>{new Date(item.feedbackDT).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}</p>
                          <p>{item.isPublic === true ? "Yes" : "No"}</p>
                          <p>{item.feedbackText?(item.feedbackText.length > 15 ? item.feedbackText.substring(0, 15) + "..." : item.feedbackText):"N/A"}</p>
                          
                          
                        </div>
                      );
                    default:
                      return (
                        <div key={item.id} className="dataList">
                          <p>No data available</p>
                        </div>
                      );
                  }
                })
              ) : (
                <p>No Data Available</p>
              )}

            </div>

          </div>
        </div>

      ) : null}
    </div>
  )
}

export default Reports