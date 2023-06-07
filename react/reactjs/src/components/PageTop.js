import React from 'react'
import "./PageTop.css"
import {FaArrowAltCircleUp} from "react-icons/fa"

const PageTop = () => {
  return (
    <div className='top-button-div'>
    <FaArrowAltCircleUp className='icon'/><button className='top-btn' onClick={() => window.scrollTo(0,0)}>
        Go to top
    </button></div>
  )
}
export default PageTop
