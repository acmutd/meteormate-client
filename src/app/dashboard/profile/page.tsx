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
  // const [showId, setShowId] = useState(false);
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

  const inputStyle =
    "w-full px-4 py-3 border border-[#FF9100] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9100] bg-white";

  return (
    <div
      className="flex flex-col justify-center items-center relative"
      style={{
        backgroundImage: "url('/stars_orange.svg')",
        backgroundSize: "cover",
      }}
    >
      <div className="w-[82%] min-h-180 bg-[#FFFFFF] rounded-2xl shadow-lg ">
        <div className="mt-4 ml-6">
          <ProfileGallery userId={userData.id} />
        </div>
        <div className="grid grid-cols-2 gap-4 w-full p-4">
          <div className="text-md">
            <p className="mb-2">Name</p>
            <div className={inputStyle}>
              <p>
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
            <p className="mb-2">UTD Email</p>
            <div className={inputStyle}>
              <p>
                Your email is: {userData.email ? userData.email : "(Email Not Provided)"}
              </p>
            </div>
          </div>

          {/* <div className="text-md">
            Account created
            <div className={inputStyle}>
              <p className="ml-2">
                {userData.created_at
                  ? new Date(userData.created_at).toLocaleDateString()
                  : "(Unknown)"}
              </p>
            </div>
          </div> */}

          <div className="text-md">
            <p className="mb-2">Major</p>
            <div className={inputStyle}>
              <p>
                {userData.profile?.major
                  ? userData.profile.major
                  : "(Not Provided)"}
              </p>
            </div>
          </div>

          <div className="text-md">
            <p className="mb-2">Gender</p>
            <div className={inputStyle}>
              <p>
                {userData.profile?.gender
                  ? userData.profile.gender
                  : "(Not Provided)"}
              </p>
            </div>
          </div>

          <div className="text-md">
            <p className="mb-2">Classification</p>
            <div className={inputStyle}>
              <p>
                {userData.profile?.classification
                  ? userData.profile.classification
                  : "(Not Provided)"}
              </p>
            </div>
          </div>

          <div className="text-md">
            <p className="mb-2">Age</p>
            <div className={inputStyle}>
              <p>
                {userData.profile?.age
                  ? userData.profile.age
                  : "(Not Provided)"}
              </p>
            </div>
          </div>

          <div className="text-md col-span-2">
            <p className="mb-2">Bio</p>
            <div className={inputStyle}>
              <p className="pb-30">
                {userData.profile?.bio
                  ? userData.profile.bio
                  : "(Not Provided)"}
              </p>
            </div>
          </div>

          {/* <div className="text-md">
            UTD ID
            <div className={inputStyle}>
              <p className="ml-2 ">
                {userData.utd_id ? userData.utd_id : "(UTD ID Not Provided)"}
              </p>
            </div>
          </div>

          <div className="text-md">
            Created Profile?
            <div className={inputStyle}>
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
            <div className={inputStyle}>
              <p className="ml-2">
                {userData.survey_done
                  ? "Yes"
                  : !userData.survey_done
                    ? "No"
                    : "(Unknown)"}
              </p>
            </div>
          </div> */}

          {/* <div className="text-md">
            ID
            <div
              className={`${inputStyle} overflow-hidden flex items-center text-center text-black justify-between`}
            >
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
          </div> */}
        </div>
      </div>
    </div>
  );
}
