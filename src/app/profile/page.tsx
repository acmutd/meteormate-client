"use client";
import React, { useEffect, useState } from "react";
import { getCurrentUserIdToken } from "@/firebase/auth";

// Following "class UserResponse(BaseModel):" schema from backend
type UserProfile = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  age?: number;
  birthdate?: Date;
};

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchuser = async () => {
      try {
        const token = await getCurrentUserIdToken();
        const res = await fetch("http://127.0.0.1:8000/api/auth/me", { // Todo: Change this 
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchuser();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data found</div>;
  const userData = user.user;

  return ( // Testing response
    <div>
      <h1>Profile Page!!!</h1>
      <div>
        <div>ID: {userData.id}</div>
        <div>Email: {userData.email}</div>
        <div>First Name: {userData.first_name}</div>
        <div>Last Name: {userData.last_name}</div>
        <div>Age: {userData.age ?? "N/A"}</div>
        <div>
          Birthdate:{" "}
          {userData.birthdate
            ? new Date(userData.birthdate).toLocaleDateString()
            : "N/A"}
        </div>

        <br></br>
        {/* Debug: To see backend fetch response */}
        <div>User data:</div>
        <pre>
          {JSON.stringify(user, null, 2)}
        </pre>
      </div>
    </div>
  );
}
