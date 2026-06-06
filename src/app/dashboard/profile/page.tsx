"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchCurrentUser } from "@/utils/api/auth";
import { UserProfile } from "@/types/userProfile";
import { useToast } from "@/components/ui/ToastProvider";
import { apiFetch } from "@/utils/api/client";
import { UpdateUserProfileBody } from "@/types/profile";
import ProfileGallery from "@/components/imageHandling/ProfileGallery";
import { useUnsavedChangesGuard } from "@/hooks/useUnsavedChangesGuard";
import UnsavedChangesDialog from "@/components/navigation/UnsavedChangesDialog";
import { DatePicker } from "../../../components/DatePicker";
import { majors } from "@/constants/majors";
import { schools } from "@/constants/schools";

interface ProfileFormState {
  major: string;
  school: string;
  gender: string;
  classification: string;
  bio: string;
  dob: string;
}

export default function Profile() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [major, setMajor] = useState("");
  const [school, setSchool] = useState("");
  const [gender, setGender] = useState("");
  const [classification, setClassification] = useState("");
  const [bio, setBio] = useState("");
  const [birthday, setBirthday] = useState<string | null>(null);

  const [initialValues, setInitialValues] = useState<ProfileFormState>({
    major: "",
    school: "",
    gender: "",
    classification: "",
    bio: "",
    dob: "",
  });
  const [hasLoadedProfileData, setHasLoadedProfileData] = useState(false);

  const BIO_CHAR_LIMIT = 250;
  const currentYear = new Date().getFullYear();

  const { toast } = useToast();

  const isDirty =
    hasLoadedProfileData &&
    (major !== initialValues.major ||
      school !== initialValues.school ||
      gender !== initialValues.gender ||
      classification !== initialValues.classification ||
      bio !== initialValues.bio ||
      birthday !== initialValues.dob);

  const { isDialogOpen, confirmNavigation, cancelNavigation } =
    useUnsavedChangesGuard({ isDirty });

  useEffect(() => {
    const fetchuser = async () => {
      try {
        const data = await fetchCurrentUser({
          preferCache: true,
          maxAgeMs: 5 * 60 * 1000,
        });
        if (!data.ok) throw new Error(data.error || "Failed to fetch profile");

        setUser(data.data);
        // To cut out the T00:00:00 
        const dobString = data.data.profile?.dob ? String(data.data.profile.dob).split('T')[0] : "";
        
        const normalized: ProfileFormState = {
          major: data.data.profile?.major || "",
          school: data.data.profile?.school || "",
          gender: data.data.profile?.gender || "",
          classification: data.data.profile?.classification || "",
          bio: data.data.profile?.bio || "",
          dob: dobString || "",
        };

        setMajor(normalized.major);
        setSchool(normalized.school);
        setGender(normalized.gender);
        setClassification(normalized.classification);
        setBio(normalized.bio);
        setBirthday(normalized.dob);
        setInitialValues(normalized);
        setHasLoadedProfileData(true);
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
      if (!birthday) {
        toast({
          type: "error",
          title: "Birthday required",
          description: "Please select your birthday.",
        });
        return;
      }

      const updatePayload: UpdateUserProfileBody = {
        major,
        school,
        gender,
        classification,
        bio,
        dob: birthday,
      };

      const updateResult = await apiFetch("/api/profiles/update", {
        method: "PUT",
        body: updatePayload,
      });
      if (!updateResult.ok)
        throw new Error(updateResult.error || "Failed to update profile");

      const updatedData = await fetchCurrentUser({ forceRefresh: true });
      if (!updatedData.ok)
        throw new Error(updatedData.error || "Failed to refresh profile");
      setUser(updatedData.data);

      const normalized: ProfileFormState = {
        major,
        school,
        gender,
        classification,
        bio,
        dob: birthday || "",
      };
      setInitialValues(normalized);
      toast({
        type: "success",
        title: "Profile updated",
        description: "Your changes were saved.",
      });
    } catch (err) {
      console.error("Update error:", err);
      toast({
        type: "error",
        title: "Profile failed to update",
        description: "Your changes were not saved.",
      });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data found</div>;
  const userData = user;

  const inputStyle =
    "w-full px-4 py-3 border border-[#FF9100] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9100] bg-white";
  const selectStyle =
    "w-full px-4 py-3 border border-[#FF9100] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9100] bg-white appearance-none cursor-pointer";

  return (
    <>
      <UnsavedChangesDialog
        isOpen={isDialogOpen}
        onConfirm={confirmNavigation}
        onCancel={cancelNavigation}
      />
      <div className="flex flex-col justify-center items-center relative">
        <div className="w-[76%] min-h-180 bg-[#FFFFFF] rounded-2xl shadow-2xl ">
          <div className="mt-4 ml-6">
            <ProfileGallery
              userId={userData.id}
              initialImages={userData.profile?.profile_picture_url}
            />
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
                  <option value="" disabled>
                    Select an option...
                  </option>
                  {majors.map((majorOption) => (
                    <option key={majorOption.value} value={majorOption.value}>
                      {majorOption.label}
                    </option>
                  ))}
                </select>
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div className="text-md">
              <div className="flex gap-4">
                <div className="w-1/2">
                  <p className="mb-2">School</p>
                  <div className="relative">
                    <select
                      name="school"
                      className={selectStyle}
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                    >
                      <option value="" disabled>
                        Select an option...
                      </option>
                      {schools.map((schoolOption) => (
                        <option key={schoolOption.value} value={schoolOption.value}>
                          {schoolOption.label}
                        </option>
                      ))}
                    </select>
                    <svg
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
                <div className="w-1/2">
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
                  <option value="freshman">Class of {currentYear + 4}</option>
                  <option value="sophomore">Class of {currentYear + 3}</option>
                  <option value="junior">Class of {currentYear + 2}</option>
                  <option value="senior">Class of {currentYear + 1}</option>
                  <option value="graduate">Class of {currentYear}</option>
                    </select>
                    <svg
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-md">
              <div>
                <p className="mb-2">Birthday</p>
                <div className="[&_input]:border-primary [&_input]:focus:ring-primary">
                   <DatePicker
                   value={birthday}
                   onChange={setBirthday}
                   placeholder="Select your birthday"

                  />
                </div>
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
              className="px-6 py-2 rounded-lg text-black font-medium shadow bg-linear-60 from-[#F28C00] to-[#FFC243] hover:from-[#d97706] hover:to-[#f59e0b] hover:shadow-md transition-all duration-200"
            >
              Update Profile
            </button>
            <button
              type="button"
              title="NOT IMPLEMENTED YET" // delete later
              className="px-6 py-2 rounded-lg bg-[#FBD7A8] text-black font-medium shadow cursor-not-allowed"
            >
              View Profile
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
