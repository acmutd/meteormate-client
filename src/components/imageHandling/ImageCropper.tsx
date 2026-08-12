import React, { useState } from "react";
import Cropper, { Area } from "react-easy-crop";

interface ImageCropperProps {
  image: string;
  onCropDone: (croppedDataUrl: string) => void;
  onCancel: () => void;
}

export default function ImageCropper({
    image,
    onCropDone,
    onCancel,
}: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
    const [loading, setLoading] = useState(false);

    const handleCropComplete = (_: Area, croppedPixels: Area) => {
        setCroppedAreaPixels(croppedPixels);
    };

    const handleCrop = async () => {
        if (!croppedAreaPixels) return;
        setLoading(true);
        try {
            const croppedDataUrl = await getCroppedImg(image, croppedAreaPixels);
            onCropDone(croppedDataUrl);
        } finally {
            setLoading(false);
        }
    };

    async function getCroppedImg(
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

    return (
        <>
            <div className="fixed inset-0 z-40 bg-black" style={{ opacity: 0.5 }} />
            <div className="fixed inset-0 z-50 flex items-center justify-center">
                <div className="bg-white p-4 rounded-lg shadow-lg flex flex-col items-center w-87 max-w-full">
                    <div className="relative w-75 h-75 bg-gray-100 rounded overflow-hidden">
                        <Cropper
                            image={image}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onZoomChange={setZoom}
                            onCropComplete={handleCropComplete}
                        />
                    </div>
                    <div className="w-full flex flex-col items-center mt-2">
                        <input
                            type="range"
                            min={1}
                            max={3}
                            step={0.01}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="w-3/4 mt-2"
                        />
                    </div>
                    <div className="flex gap-2 mt-4">
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={handleCrop}
                            disabled={loading}
                        >
                            {loading ? "Cropping..." : "Crop"}
                        </button>
                        <button
                            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                            onClick={onCancel}
                            disabled={loading}
                        >
              Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
