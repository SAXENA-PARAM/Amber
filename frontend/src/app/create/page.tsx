import React from 'react'

const page = () => {
  return (
    <div>
        <div className="text-black"><label>Course name</label>
        <div className="relative">
            <input type='text' className='w-[50vw] p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent'/>
        </div>
        <div>
            <label>category</label>
            <select className='text-black'>
            <option value="">Select category</option>
                <option value="programming">Programming</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
                <option value="marketing">Marketing</option>
            </select>
        </div>
        </div>
        <div className="bottom">
        <button className='bg-blue-600 m-10 px-5 py-1'>back</button>
        <button className='bg-blue-600 m-10 px-5 py-1'>continue</button></div>
    </div>
  )
}

export default page