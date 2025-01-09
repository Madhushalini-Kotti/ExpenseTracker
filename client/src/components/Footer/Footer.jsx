import React from 'react'
import './Footer.css'

function Footer() {

    const year = new Date().getFullYear();
  return (
      <div className='Footer'>
          <span>Copyright © {year} Madhushalini</span>
    </div>
  )
}

export default Footer