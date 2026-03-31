import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File): Promise<File> => {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/webp', // conver to webp
    };

    try {
        // console.log(`Original file size: ${(file.size / 1024 / 1024).toFixed(3)} MB`);
        const compressedFile = await imageCompression(file, options);
        // console.log(`Compressed file size: ${(compressedFile.size / 1024 / 1024).toFixed(3)} MB`);
        return compressedFile;
    } catch (error) {
        console.error("Error compressing image:", error);
        throw error;
    }
};
