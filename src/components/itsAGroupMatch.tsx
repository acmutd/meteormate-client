"use client";

import Image from "next/image";
import { X } from "lucide-react";

type GroupMember = {
    name: string;
    image: string;
};

type GroupMatchOverlayProps = {
    open: boolean;
    onClose: () => void;
    onConfirm?: () => void;
    currentUserImg: string;
    members: GroupMember[];
};

export function ItsAGroupMatchOverlay({
    open,
    onClose,
    onConfirm,
    currentUserImg,
    members,
}: GroupMatchOverlayProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
            <div className="relative w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-5 top-5 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/80 text-gray-600 shadow-sm transition hover:bg-gray-100"
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>

                <div className="bg-gradient-to-br from-orange-50 via-white to-orange-100 px-6 pb-8 pt-10 text-center">
                    <h2 className="text-3xl font-bold text-gray-900">
                        It&apos;s a Group Match!
                    </h2>

                    <p className="mt-2 text-sm text-gray-600">
                        You matched with this roommate group!
                    </p>

                    <div className="mt-8 flex items-center justify-center">
                        <div className="flex items-center">
                            <div className="relative z-20 h-24 w-24 overflow-hidden rounded-full border-4 border-white shadow-lg">
                                <Image
                                    src={currentUserImg}
                                    alt="Your profile"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="ml-[-12px] flex items-center">
                                {members.map((member, index) => (
                                    <div
                                        key={`${member.name}-${index}`}
                                        className="relative ml-[-12px] h-20 w-20 overflow-hidden rounded-full border-4 border-white shadow-lg"
                                        style={{
                                            zIndex: members.length - index,
                                        }}
                                    >
                                        <Image
                                            src={member.image}
                                            alt={member.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="mt-7">
                        <p className="text-lg font-semibold text-gray-900">
                            You + {members.length} roommates
                        </p>

                        <div className="mt-2 flex flex-wrap justify-center gap-2">
                            {members.map((member) => (
                                <span
                                    key={member.name}
                                    className="rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-primary"
                                >
                                    {member.name}
                                </span>
                            ))}
                        </div>
                    </div>

                    <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-gray-600">
                        You and this group have compatible roommate
                        preferences. Connect with the group to start planning
                        your living situation together.
                    </p>

                    <button
                        type="button"
                        onClick={onConfirm ?? onClose}
                        className="mt-7 w-full cursor-pointer rounded-2xl bg-gradient-to-r from-primary to-secondary px-6 py-3 font-semibold text-white shadow-md transition hover:scale-[1.01]"
                    >
                        Continue
                    </button>
                </div>
            </div>
        </div>
    );
}