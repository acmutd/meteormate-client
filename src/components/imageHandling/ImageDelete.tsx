import React, { useState } from "react";
import { getCurrentUserIdToken } from "@/firebase/auth";

interface ImageDeleteProps {
  index: number;
  onDeleted?: () => void;
}

export default function ImageDelete({ index, onDeleted }: ImageDeleteProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      const token = await getCurrentUserIdToken();
      const res = await fetch(`/api/profiles/delete_picture/${index}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete image");
      if (onDeleted) onDeleted();
    } catch (err) {
      console.error("Failed to delete image", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className={
        "absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
      }
      title={"Delete image"}
    >
      x
    </button>
  );
}
