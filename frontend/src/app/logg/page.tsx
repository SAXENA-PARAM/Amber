"use client";
import React, { useEffect, useState } from 'react';
import { useUser } from '@auth0/nextjs-auth0/client';

const Page = () => {
  const { user, error, isLoading } = useUser();
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [idToken,setIdToken] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccessToken = async () => {
      if (user) {
        try {
          const res = await fetch('/api/auth/token');
          
          if (!res.ok) {
            const errorData = await res.json();
            console.error("Error response from token API:", errorData);
            return;
          }

          const data = await res.json();
          if (data.accessToken) {
            setAccessToken(data.accessToken);
            setIdToken(data.idToken);
            console.log(data);

            console.log("Access Token:", data.accessToken);
            console.log("Access Token2", data);

            
          } else {
            console.error("No access token found in response data:", data);
          }
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
          <p>Id Token: {accessToken || "Token not available"}</p>
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

export default Page;