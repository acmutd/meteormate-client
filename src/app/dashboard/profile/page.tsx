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
  const router = useRouter();

  const [major, setMajor] = useState("");
  const [gender, setGender] = useState("");
  const [classification, setClassification] = useState("");
  const [bio, setBio] = useState("");
  const [age, setAge] = useState("");

  const BIO_CHAR_LIMIT = 250;

  useEffect(() => {
    const fetchuser = async () => {
      try {
        const token = await getCurrentUserIdToken();
        const data = await fetchCurrentUser(token);
        setUser(data);
        if (data.profile) {
          setMajor(data.profile.major || "");
          setGender(data.profile.gender || "");
          setClassification(data.profile.classification || "");
          setBio(data.profile.bio || "");
          setAge(data.profile.age || "");
        }
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

  const handleUpdateProfile = async () => {
    try {
      const token = await getCurrentUserIdToken();
      const response = await fetch("/api/profiles/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          major,
          gender,
          classification,
          bio,
          age
        }),
      });
      if (!response.ok) throw new Error("Failed to update profile");
      const updatedData = await fetchCurrentUser(token);
      setUser(updatedData);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update profile");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data found</div>;
  const userData = user;

  const inputStyle =
    "w-full px-4 py-3 border border-[#FF9100] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9100] bg-white";
  const selectStyle = "w-full px-4 py-3 border border-[#FF9100] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9100] bg-white appearance-none cursor-pointer";

  return (
    <div
      className="flex flex-col justify-center items-center relative"
      style={{
        backgroundImage: "url('/stars_orange.svg')",
        backgroundSize: "cover",
      }}
    >
      <div className="w-[76%] min-h-180 bg-[#FFFFFF] rounded-2xl shadow-2xl ">
        <div className="mt-4 ml-6">
          <ProfileGallery userId={userData.id} />
        </div>
        <div className="grid grid-cols-2 gap-4 w-full p-4">
          <div className="text-md">
            <p className="mb-2">Name</p>
            <div
              className={`${inputStyle} bg-gray-50 text-gray-500 relative pr-10`}
            >
              <p>
                {userData.profile?.first_name
                  ? userData.profile?.first_name
                  : "(First Name Not Provided)"}{" "}
                {userData.profile?.last_name
                  ? userData.profile.last_name
                  : "(Last Name Not Provided)"}
              </p>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>

          <div className="text-md">
            <p className="mb-2">UTD Email</p>
            <div
              className={`${inputStyle} bg-gray-50 text-gray-500 relative pr-10`}
            >
              <p>
                Your email is:{" "}
                {userData.email ? userData.email : "(Email Not Provided)"}
              </p>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </div>

          <div className="text-md">
            <p className="mb-2">Major</p>
            <div className="relative">
              <select
                name="major"
                className={selectStyle}
                value={major}
                onChange={(e) => setMajor(e.target.value)}
              >
                {/* IM MOVING THIS LIST SOMEWHERE ELSE GOOD LORD ITS SO MESSY */}
                <option value="" disabled>
                  Select an option...
                </option>
                <option value="biomedical-engineering">Biomedical Engineering</option>
                <option value="computer-engineering">Computer Engineering</option>
                <option value="computer-science">Computer Science</option>
                <option value="data-science">Data Science</option>
                <option value="electrical-engineering">Electrical Engineering</option>
                <option value="mechanical-engineering">Mechanical Engineering</option>
                <option value="software-engineering">Software Engineering</option>
                <option value="accounting">Accounting</option>
                <option value="business-administration">Business Administration</option>
                <option value="business-analytics">Business Analytics</option>
                <option value="finance">Finance</option>
                <option value="global-business">Global Business</option>
                <option value="healthcare-management">Healthcare Management</option>
                <option value="human-resource-management">Human Resource Management</option>
                <option value="information-technology-systems">Information Technology and Systems</option>
                <option value="marketing">Marketing</option>
                <option value="supply-chain-management">Supply Chain Management</option>
                <option value="animation-games">Animation and Games</option>
                <option value="arts-technology-emerging-communication">Arts, Technology, and Emerging Communication (ATEC)</option>
                <option value="art-history">Art History</option>
                <option value="history">History</option>
                <option value="interdisciplinary-studies">Interdisciplinary Studies</option>
                <option value="literature">Literature</option>
                <option value="philosophy">Philosophy</option>
                <option value="visual-performing-arts">Visual and Performing Arts</option>
                <option value="child-learning-development">Child Learning and Development</option>
                <option value="cognitive-science">Cognitive Science</option>
                <option value="neuroscience">Neuroscience</option>
                <option value="psychology">Psychology</option>
                <option value="speech-language-hearing">Speech, Language, and Hearing Sciences</option>
                <option value="criminology-criminal-justice">Criminology and Criminal Justice</option>
                <option value="economics">Economics</option>
                <option value="geospatial-information-sciences">Geospatial Information Sciences</option>
                <option value="international-political-economy">International Political Economy</option>
                <option value="political-science">Political Science</option>
                <option value="public-affairs">Public Affairs</option>
                <option value="public-policy">Public Policy</option>
                <option value="sociology">Sociology</option>
                <option value="actuarial-science">Actuarial Science</option>
                <option value="biochemistry">Biochemistry</option>
                <option value="biology">Biology</option>
                <option value="chemistry">Chemistry</option>
                <option value="geosciences">Geosciences</option>
                <option value="mathematics">Mathematics</option>
                <option value="molecular-biology">Molecular Biology</option>
                <option value="physics">Physics</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="text-md">
            <p className="mb-2">Gender</p>
            <div className="relative">
              <select
                name="gender"
                className={selectStyle}
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="" disabled>
                  Select an option...
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="non_binary">Non-binary</option>
                <option value="other">Other</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="text-md">
            <p className="mb-2">Classification</p>
            <div className="relative">
              <select
                name="classification"
                className={selectStyle}
                value={classification}
                onChange={(e) => setClassification(e.target.value)}
              >
                <option value="" disabled>
                  Select an option...
                </option>
                <option value="freshman">Class of 2030</option>
                <option value="sophomore">Class of 2029</option>
                <option value="junior">Class of 2028</option>
                <option value="senior">Class of 2027</option>
                <option value="graduate">Class of 2026</option>
              </select>
              <svg
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="text-md">
            <p className="mb-2">Age</p>
            <div className="relative">
              <input
                type="number"
                className={`${inputStyle}`}
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Enter your age"
              />
            </div>
          </div>

          <div className="text-md col-span-2">
            <p className="mb-2">Bio</p>
            <div className="relative">
              <textarea
                placeholder="Write your Bio here e.g your hobbies, interests ETC"
                className={`${inputStyle} resize-none h-28`}
                value={bio}
                onChange={(e) => {
                  if (e.target.value.length <= BIO_CHAR_LIMIT) {
                    setBio(e.target.value);
                  }
                }}
                maxLength={BIO_CHAR_LIMIT}
              />
              <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                {bio.length}/{BIO_CHAR_LIMIT}
              </div>
            </div>
          </div>

        </div>
        <div className="flex justify-center gap-6 mr-[1%]">
          <button
            type="button"
            onClick={handleUpdateProfile}
            className="px-6 py-2 rounded-lg text-black font-medium shadow bg-linear-60 from-[#F28C00] to-[#FFC243]"
          >
            Update Profile
          </button>
          <button
            type="button"
            className="px-6 py-2 rounded-lg bg-[#FBD7A8] text-black font-medium shadow"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
}
