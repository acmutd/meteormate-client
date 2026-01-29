import React from "react";
import Image from "next/image";

interface ImageDisplayProps {
  imageUrl: string;
  onClick?: () => void; // Todo: Replace image functionality
  onDelete?: () => void; // Todo: Once API supports image deletion
}

export default function ImageDisplay({
  imageUrl,
  onClick,
  onDelete,
}: ImageDisplayProps) {
  return (
    <div className="relative group">
      <Image
        src={imageUrl}
        alt="Profile"
        width={1000}
        height={1000}
        className="w-28 h-28 rounded-xl object-cover shadow-md bg-gray-300 cursor-pointer"
        draggable="false"
        onClick={onClick}
        title="Click to update this image"
      />
      <button
        onClick={onDelete}
        className="absolute top-1 right-1 hidden group-hover:block bg-red-500 text-white rounded-full p-1"
      >
        X
      </button>
    </div>
  );
}
