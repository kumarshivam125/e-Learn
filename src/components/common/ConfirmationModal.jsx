import React from 'react'
// import { IconBtn } from './IconBtn'

export const ConfirmationModal = ({ modalData }) => {
  return (
    <div className='text-black bg-white bg-opacity-75 fixed top-0 left-0 w-[100vw] h-[100vh] flex justify-center items-center '>
      <div className='bg-richblack-200 px-[30px] py-[30px] rounded-lg flex flex-col gap-y-2 border border-richblack-900 '>
        <p className='text-[25px] font-bold'>{modalData.text1}</p>
        <p className='text-[20px]'>{modalData.text2}</p>
        <div className='flex gap-x-8 '>
          <button onClick={modalData?.btn1Handler} className='bg-yellow-50 p-2 rounded-lg font-semibold'>{modalData?.btn1Text}</button>
          <button onClick={modalData?.btn2Handler} className='bg-richblack-700  text-white p-2 rounded-lg font-semibold'>{modalData?.btn2Text}</button>
        </div>
      </div>

    </div>
  )
}
