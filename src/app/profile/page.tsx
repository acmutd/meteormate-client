"use client";
import React, { useEffect, useState } from "react";
import { getCurrentUserIdToken } from "@/firebase/auth";

// Following "class UserResponse(BaseModel):" schema from backend
type UserProfile = {
  id: string;
  email: string;
  // first_name: string;
  // last_name: string;
  // age?: number;
  // birthdate?: Date;
  created_at?: Date;
  utd_id?: string;
};

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchuser = async () => {
      try {
        const token = await getCurrentUserIdToken();
        const res = await fetch("http://127.0.0.1:8000/api/auth/me", {
          // Todo: Change this
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

  return (
    // Testing response
    <div className="min-h-screen w-screen flex flex-col justify-center items-center relative">
      <div className="w-[60%] min-h-180 flex flex-col items-center bg-[#EEE5D8] rounded-2xl shadow-md shadow-gray-700">
        <div className="grid grid-cols-2 gap-4 w-full p-4">
          <div className="text-md">
            Name
            <div className="bg-white rounded shadow h-8 w-full overflow-hidden flex items-center text-center text-black">
              <p className="ml-2">
                {userData.first_name} {userData.last_name} {/* Missing First Last name from API */}
              </p>
            </div>
          </div>

          <div className="text-md">
            UTD Email
            <div className="bg-white rounded shadow h-8 w-full overflow-hidden flex items-center text-center text-black">
              <p className="ml-2">{userData.email}</p>
            </div>
          </div>

          <div className="text-md">
            UTD ID
            <div className="bg-white rounded shadow h-8 w-full overflow-hidden flex items-center text-center text-black">
              <p className="ml-2">{userData.utd_id}</p>
            </div>
          </div>

          <div className="text-md">
            Account created
            <div className="bg-white rounded shadow h-8 w-full overflow-hidden flex items-center text-center text-black">
              <p className="ml-2">{userData.created_at ? new Date(userData.created_at).toLocaleDateString() : "N/A"}</p>
            </div>
          </div>

          <div className="text-md">
            ID
            <div className="bg-white rounded shadow h-8 w-full overflow-hidden flex items-center text-center text-black">
              <p className="ml-2">{userData.id}</p>
            </div>
          </div>

          <div className="text-md">
            Completed Survey?
            <div className="bg-white rounded shadow h-8 w-full overflow-hidden flex items-center text-center text-black">
              <p className="ml-2">{user.survey_done ? "Yes" : "No"}</p> {/* Todo: Fix */}
            </div>
          </div>

        </div>
        {/* Debug: To see backend fetch response */}
          {/* <div>User data:</div>
          <pre>{JSON.stringify(user, null, 2)}</pre> */}
      </div>
    </div>
  );
}
