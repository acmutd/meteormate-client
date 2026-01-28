import React, { useState } from "react";
import Cropper, { Area } from "react-easy-crop";

interface ImageCropperProps {
  image: string;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
  zoom?: number;
  setZoom?: (zoom: number) => void;
}

export default function ImageCropper({
  image,
  onCropComplete,
  zoom: zoomProp,
  setZoom: setZoomProp,
}: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [internalZoom, setInternalZoom] = useState(1);
  const zoom = zoomProp !== undefined ? zoomProp : internalZoom;
  const handleZoomChange = setZoomProp ? setZoomProp : setInternalZoom;

  return (
    <div className="w-full h-full">
      <Cropper
        image={image}
        crop={crop}
        zoom={zoom}
        aspect={1}
        onCropChange={setCrop}
        onZoomChange={handleZoomChange}
        onCropComplete={onCropComplete}
      />
    </div>
  );
}

export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
): Promise<string> {
  const image = new window.Image();
  image.src = imageSrc;
  await new Promise((resolve) => (image.onload = resolve));
  const canvas = document.createElement("canvas");
  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("No 2d context");
  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    pixelCrop.width,
    pixelCrop.height,
  );
  return canvas.toDataURL("image/jpeg");
}
