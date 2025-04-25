import React, { useState } from 'react'
import './Menu.css'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/foodDisplay/FoodDisplay'
const Menu = () => {
    const [category,setCategory] = useState("All");
  return (
    <>
    <div>
    <ExploreMenu category={category} setCategory={setCategory} />
    <FoodDisplay category={category} />
    </div>
    </>
  )
}

export default Menu


