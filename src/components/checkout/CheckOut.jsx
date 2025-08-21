import React from 'react'
import { useState } from 'react'
import Address from './Address'
import Payment from './Payment'
import BuyingNowProducts from './BuyingNowProducts'
import CheckoutNavbar from './CheckoutNavbar'
const Checkout = () => {
    
  return (
    <div>
        {/* <CheckoutNavbar/> */}
      <Address/>
      {/* <Payment/>
      <BuyingNowProducts/> */}
    </div>
  )
}

export default Checkout
