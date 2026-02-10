"use client";
import React, { useEffect, useState } from "react";
import { getCurrentUserIdToken } from "@/firebase/auth";
import { useRouter } from "next/navigation";
import { fetchCurrentUser } from "@/api/auth";
import { UserProfile } from "@/types/userProfile";
import ProfileGallery from "@/components/imageHandling/ProfileGallery";

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showId, setShowId] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchuser = async () => {
      try {
        const token = await getCurrentUserIdToken();
        const data = await fetchCurrentUser(token);
        setUser(data);
      } catch (err) {
        console.error("Profile fetch error:", err);
        setError("Failed to load profile");
        router.push("/authentication?toast=not-signed-in");
      } finally {
        setLoading(false);
      }
    };
    fetchuser();
  }, [router]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data found</div>;
  const userData = user;

  return (
    <div className="min-h-screen w-screen flex flex-col justify-center items-center relative">
      <div className="w-[60%] min-h-180 flex flex-col items-center bg-[#EEE5D8] rounded-2xl shadow-md shadow-gray-700">
        <div className="mt-2">
          <ProfileGallery userId={userData.id} />
        </div>
        <div className="grid grid-cols-2 gap-4 w-full p-4">
          <div className="text-md">
            Name
            <div className="bg-white rounded shadow h-8 w-full overflow-hidden flex items-center text-center text-black">
              <p className="ml-2">
                {userData.profile?.first_name
                  ? userData.profile?.first_name
                  : "(First Name Not Provided)"}{" "}
                {userData.profile?.last_name
                  ? userData.profile.last_name
                  : "(Last Name Not Provided)"}
              </p>
            </div>
          </div>

          <div className="text-md">
            Account created
            <div className="bg-white rounded shadow h-8 w-full overflow-hidden flex items-center text-center text-black">
              <p className="ml-2">
                {userData.created_at
                  ? new Date(userData.created_at).toLocaleDateString()
                  : "(Unknown)"}
              </p>
            </div>
          </div>

          <div className="text-md">
            Gender
            <div className="bg-white rounded shadow h-8 w-full overflow-hidden flex items-center text-center text-black">
              <p className="ml-2">
                {userData.profile?.gender
                  ? userData.profile.gender
                  : "(Not Provided)"}
              </p>
            </div>
          </div>

          <div className="text-md">
            Major
            <div className="bg-white rounded shadow h-8 w-full overflow-hidden flex items-center text-center text-black">
              <p className="ml-2">
                {userData.profile?.major
                  ? userData.profile.major
                  : "(Not Provided)"}
              </p>
            </div>
          </div>

          <div className="text-md col-span-2">
            Bio
            <div className="bg-white rounded shadow h-8 w-full overflow-hidden flex items-center text-center text-black">
              <p className="ml-2">
                {userData.profile?.bio
                  ? userData.profile.bio
                  : "(Not Provided)"}
              </p>
            </div>
          </div>

          <div className="text-md">
            Age
            <div className="bg-white rounded shadow h-8 w-full overflow-hidden flex items-center text-center text-black">
              <p className="ml-2">
                {userData.profile?.age
                  ? userData.profile.age
                  : "(Not Provided)"}
              </p>
            </div>
          </div>

          <div className="text-md">
            Classification
            <div className="bg-white rounded shadow h-8 w-full overflow-hidden flex items-center text-center text-black">
              <p className="ml-2">
                {userData.profile?.classification
                  ? userData.profile.classification
                  : "(Not Provided)"}
              </p>
            </div>
          </div>

          <div className="text-md">
            UTD Email
            <div className="bg-white rounded shadow h-8 w-full overflow-hidden flex items-center text-center text-black">
              <p className="ml-2">
                {userData.email ? userData.email : "(Email Not Provided)"}
              </p>
            </div>
          </div>

          <div className="text-md">
            UTD ID
            <div className="bg-white rounded shadow h-8 w-full overflow-hidden flex items-center text-center text-black">
              <p className="ml-2 ">
                {userData.utd_id ? userData.utd_id : "(UTD ID Not Provided)"}
              </p>
            </div>
          </div>

          <div className="text-md">
            Created Profile?
            <div className="bg-white rounded shadow h-8 w-full overflow-hidden flex items-center text-center text-black">
              <p className="ml-2">
                {userData.profile_created
                  ? "Yes"
                  : !userData.profile_created
                    ? "No"
                    : "(Unknown)"}
              </p>
            </div>
          </div>

          <div className="text-md">
            Completed Survey?
            <div className="bg-white rounded shadow h-8 w-full overflow-hidden flex items-center text-center text-black">
              <p className="ml-2">
                {userData.survey_done
                  ? "Yes"
                  : !userData.survey_done
                    ? "No"
                    : "(Unknown)"}
              </p>
            </div>
          </div>

          <div className="text-md">
            ID
            <div className="bg-white rounded shadow h-8 w-full overflow-hidden flex items-center text-center text-black justify-between">
              <p className={`ml-2 ${showId ? "" : "blur"}`}>
                {userData.id ? userData.id : "(Unknown)"}
              </p>
              <button
                className="underline text-xs mr-2"
                onClick={() => setShowId(!showId)}
              >
                {showId ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </div>
        {/* Debug: To see fetch response */}
        {/* <div>User data:</div> */}
        {/* <pre>{JSON.stringify(user, null, 2)}</pre> */}
      </div>
    </div>
  );
}
