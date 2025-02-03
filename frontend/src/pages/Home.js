import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'

const Home = () => {
  return (
    <div>
      
      <BannerProduct/>
      <VerticalCardProduct category={"mobiles"} heading={"Mobiles"}/>
      <HorizontalCardProduct category={"airpodes"} heading={"Popular's Airpodes"}/>
     
      <VerticalCardProduct category={"camera"} heading={"Camera & Photography"}/>
      <VerticalCardProduct category={"earphones"} heading={"Wired Earphones"}/>
    </div>
  )
}

export default Home