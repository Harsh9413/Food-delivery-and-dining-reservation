// import React, { useContext } from 'react'
// import './FoodDisplay.css'
// import { StoreContext } from '../../Context/StoreContext';
// import FoodItem from '../FoodItem/FoodItem';

// const FoodDisplay = (category) => {

//     const {food_list} = useContext(StoreContext);

//   return (
//     <div className='food-display' id='food-display'>
//         <h2>Top Dishes</h2>
//         <div className="food-display-list">
//             {food_list.map((item,index)=>{
//                 if(category==="All" || category === item.category){
//                     return <FoodItem key={index} id={item._id} name={item.name} description={item.description} price={item.price} image={item.image} />
//                 }
//             })}
//         </div>
//     </div>
//   )
// }

// export default FoodDisplay
import React, { useContext } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../Context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category = "All" }) => {
    const { food_list,categoryList} = useContext(StoreContext);
    const updatedFoodList = food_list.map(item => {
        const categoryData = categoryList.find(cat => cat._id === item.category);
        // If the category's status is false, set the food item's status to false
        return {
            ...item,
            status: item.status && categoryData?.status, // Ensure both item and category are active
        };
    });
    const sortedFoodList = [...updatedFoodList].sort((a, b) => b.status - a.status);
    return (
        <div className='food-display' id='food-display'>
            <h2>Top Dishes</h2>
            <div className="food-display-list">
                {sortedFoodList.map((item, index) => {
                    const cnt = categoryList.find(obg=>obg._id===item.category)
                 
                    if((category === "All") || (category === item.category)){
                        return (<FoodItem
                            key={index}
                            id={item._id}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            image={item.image}
                            status={item.status}
                        />
                    )}
                    else{
                            null}
})}
            </div>
        </div>
    );
};

export default FoodDisplay;
