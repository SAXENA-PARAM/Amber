"use client"
import React, { useState } from 'react';
import Cookies from 'js-cookie';

const Page = () => {
  const [error, setError] = useState('');
  const [data, setData] = useState(null);

  async function fetchDashboardData() {
    try {
      const token = Cookies.get('accessToken'); // Get the token from the cookie
      console.log('Token:', token); // Log the token value
  
      const response = await fetch('http://localhost:5001/api/v1/user/web/dashboard', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          Authorization: `accessToken=${token}`,
        },
      });
  
      console.log('Response status:', response.status); // Log the response status
      console.log('Response headers:', response.headers); // Log the response headers
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Error response:', errorData); // Log the error response
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
  
      const responseData = await response.json();
      setData(responseData);
      setError('');
      console.log('Dashboard Data:', responseData);
    } catch (err) {
      setError(err.message);
      setData(null);
      console.error('Error fetching dashboard data:', err);
    }
  }

  return (
    <div className="p-4">
      <button 
        onClick={fetchDashboardData} 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Fetch Dashboard Data
      </button>
      
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}
      
      {data && (
        <pre className="mt-4 p-4 bg-gray-100 rounded overflow-auto">
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default Page;