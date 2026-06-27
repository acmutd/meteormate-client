"use client";

import { schools } from "@/constants/schools";

interface SchoolOnlyCardProps {
    school: string;
    onSchoolChange: (value: string) => void;
    onSave: () => void;
    disabled?: boolean;
}

export default function SchoolOnlyCard({
    school,
    onSchoolChange,
    onSave,
    disabled,
}: SchoolOnlyCardProps) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md">
                <h2 className="text-xl font-semibold mb-2">Select Your School</h2>
                <p className="text-gray-600 mb-6">
                    Please choose your school to complete your profile.
                </p>
                <div className="mb-6">
                    <p className="font-medium text-sm mb-2">School</p>
                    <div className="relative">
                        <select
                            name="school"
                            className="w-full px-4 py-3 border border-[#FF9100] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF9100] bg-white appearance-none cursor-pointer"
                            value={school}
                            onChange={(e) => onSchoolChange(e.target.value)}
                        >
                            <option value="" disabled>Select an option...</option>
                            {schools.map((schoolOption) => (
                                <option key={schoolOption.value} value={schoolOption.value}>
                                    {schoolOption.label}
                                </option>
                            ))}
                        </select>
                        <svg
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
                            fill="none" stroke="currentColor" viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
                <button
                    type="button"
                    onClick={onSave}
                    disabled={disabled}
                    className={`w-full px-6 py-3 rounded-lg text-black font-medium shadow bg-linear-60 from-[#F28C00] to-[#FFC243] hover:from-[#d97706] hover:to-[#f59e0b] transition-all duration-200 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                    Save
                </button>
            </div>
        </div>
    );
}
