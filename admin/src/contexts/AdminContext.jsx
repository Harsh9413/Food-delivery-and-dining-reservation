import { createContext, useEffect, useState } from "react";
import axios from 'axios';

export const AdminContext = createContext(null);


const AdminContextProvider = (props)=>{
    const url ="http://localhost:4000" 
    const [focus,setFocus] =useState(true)
    const [dishCount,setDishcount]=useState()
    const [list,setList] =useState([]);
    const [catlist,setCatList] =useState([]);
    const [cat,setCat] = useState({})



    const fetchList = async () => {
     const response = await axios.get(`${url}/api/food/listfood`)
     const catResponse = await axios.get(`${url}/api/food/list`);
     const categories = catResponse.data.data; 
     setCat(categories)
     if(response.data.success){
       setList(response.data.data);
     }else{
       toast.error("Error") 
     }
   }

   const fetchcatList = async () => {
    try {
        const catResponse = await axios.get(`${url}/api/food/list`);
        const dishResponse = await axios.get(`${url}/api/food/listfood`);
        
        //  Extract correct data structure
        const categories = catResponse.data.data; // Ensure it's an array
        const dishes = dishResponse.data.data;
        //  Check if categories is an array before using .map()
        if (!Array.isArray(categories)) {
            throw new Error("Categories data is not an array");
        }
        
        // Use .map() safely
        const catDishCount = categories.map((category) => {
            const count = dishes.filter(dish => 
                dish.category === category._id// Ensure matching logic is correct
            ).length;
            return {
                category: category.name,
                totalDishes: count
            };
        });
    // // Debugging output
    // console.log("Categories:", categories);
    // console.log("Dishes:", dishes);
    // console.log("Category-wise Dish Count:", catDishCount);

        // Only update state if request was successful
        if (catResponse.data.success) {
            setCatList(categories); // Use extracted categories array
            setDishcount(catDishCount);
        } else {
            toast.error("Error fetching categories");
        }
    } catch (error) {
        console.error("Error in fetchcatList:", error);
        toast.error("Failed to fetch category list");
    }
};
   
       
    const contextValue = {
      focus,
      setFocus,
      fetchList,
      list,
      fetchcatList ,
      catlist,
      dishCount,
      cat
    }

    return (
            <AdminContext.Provider value={contextValue}>
                {props.children}
            </AdminContext.Provider>
        )
}

export default AdminContextProvider