// "use client";
import React, { useState } from 'react';
import Spline from '@/components/spline/signin';
import Component from '@/components/cardforlogin';
import SignupComponent from '@/components/cardforsignup';

// const SignUp: React.FC = () => {
//   const [name, setName] = useState<string>('');
//   const [email, setEmail] = useState<string>('');
//   const [password, setPassword] = useState<string>('');
//   const [error, setError] = useState<string>('');

//   const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();

//     if (name && email && password) {
//       // Handle successful signup, e.g., API call to register the user
//     } else {
//       setError('Please fill out all fields');
//     }
//   };
export default function page(){
  return (
    <div className="flex w-full h-screen">
      {/* Right Half - Spline Model */}
     
        <Spline/>
        <div className='absolute top-[0vh] left-[70vw] w-[30vw] z-10'>
<SignupComponent/>
</div>
<img src='/images/signinlogo.jpeg' className="h-[10vh] absolute top-[0vh] left-5 mix-blend-lighten" />

      {/* Left Half - Sign Up Form */}
      {/* <div className="w-1/2 flex items-center justify-center bg-[#f8bcac] bg-opacity-90 border rounded-lg">
        <div className="w-3/4 space-y-4 p-8 rounded">
          <h2 className="text-2xl font-bold text-center text-white">Sign Up</h2> */}
          {/* {error && <p className="text-red-500">{error}</p>} */}
          {/* <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium text-white">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Sign Up
            </button>
          </form>
        </div> 
      </div>*/}
    </div>
  );
};

// export default SignUp;
