import { AnyPtrRecord } from "dns";

export const fetchAccessToken = async (user: any) => {
    if (user) {
      try {
        const res = await fetch('/api/auth/token');
        
        if (!res.ok) {
          const errorData = await res.json();
          console.error("Error response from token API:", errorData);
          return;
        }

        const data = await res.json();
         
        return data;
      } catch (err) {
        console.error("Error fetching access token:", err);
      }
    }
  };
