import React, { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "@/components/icons/settings-icons";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
    const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            const originalOverflow = document.body.style.overflow;
            document.body.style.overflow = "hidden";

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === "Escape") {
                    onClose();
                }
            };

            window.addEventListener("keydown", handleKeyDown);

            return () => {
                document.body.style.overflow = originalOverflow;
                window.removeEventListener("keydown", handleKeyDown);
            };
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={handleBackdropClick}
        >
            <div
                className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in duration-200"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Close"
                >
                    <CloseIcon />
                </button>

                <h3 id="modal-title" className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                <div className="text-gray-600 text-sm">
                    {children}
                </div>
            </div>
        </div>,
        document.body
    );
}
