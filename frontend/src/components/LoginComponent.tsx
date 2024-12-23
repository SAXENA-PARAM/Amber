// components/LoginComponent.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';
import Spline from '@splinetool/react-spline/next';

const LoginComponent = () => {
  const { user, error, isLoading } = useUser();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  
  useEffect(() => {
    const fetchAccessToken = async () => {
      if (user) {
        try {
          const res = await fetch('/api/auth/token');
          const data = await res.json();
          setAccessToken(data.accessToken || null);
          setIdToken(data.idToken || null);
        } catch (error) {
          console.error("Error fetching access token:", error);
        }
      }
    };
    fetchAccessToken();
  }, [user]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div>
      {user ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <p>Access Token: {accessToken || "Token not available"}</p>
          <div className="flex w-full h-screen">
            <div className="w-1/2 h-full">
              <Spline
                scene="https://prod.spline.design/RDgrQ7VBrW9D-a90/scene.splinecode"
                className="w-full h-full"
                style={{ minHeight: '400px', border: '1px solid #ccc' }}
              />
            </div>
            <div className="w-1/2 flex items-center justify-center bg-[#f8bcac] bg-opacity-90 border rounded-lg">
              <div className="w-3/4 space-y-4 p-8 rounded">
                <h2 className="text-2xl font-bold text-center text-white">Login</h2>
                <form className="space-y-4">
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
                    Log in
                  </button>
                </form>
              </div>
            </div>
          </div>
          <a href="/api/auth/logout" className="btn btn-primary btn-margin">
            Log out
          </a>
        </div>
      ) : (
        <a href="/api/auth/login" className="btn btn-primary btn-margin">
          Log in
        </a>
      )}
    </div>
  );
};

export default LoginComponent;
