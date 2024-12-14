import React from 'react'

export default function Spinner() {
  return (
    <div className='d-flex justify-content-center align-items-center vh-100'>
        <div className="spinner-grow" role="status">
            <span className="sr-only"></span>
        </div>
    </div>
  )
}
