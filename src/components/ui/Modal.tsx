import React from "react";
import { CloseIcon } from "@/components/icons/settings-icons";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <CloseIcon />
                </button>

                <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <div className="text-gray-600 text-sm">
                    {children}
                </div>
            </div>
        </div>
    );
}
