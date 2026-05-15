import imageCompression from 'browser-image-compression';
import { storage, auth } from '@/firebase/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export const compressImage = async (file: File): Promise<File> => {
    const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/webp', // conver to webp
        preserveExif: false,
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

export const uploadImages = async (base64Images: string[]) => {
    const uid = auth.currentUser!.uid;
    const changedImageMap: Record<number, string> = {}; // slotIndex -> new URL

    for (let i = 0; i < base64Images.length; i++) {
        const base64 = base64Images[i];
        if (!base64.startsWith("data:")) continue;

        const blob = await (await fetch(base64)).blob();
        const file_path = `profile_pictures/${uid}/${crypto.randomUUID()}.webp`;

        try {
            const img_ref = ref(storage, file_path);
            await uploadBytes(img_ref, blob);
            const downloadURL = await getDownloadURL(img_ref);
            changedImageMap[i] = downloadURL;
        } catch (error) {
            console.error(`Failed to upload image for slot ${i}:`, error);
            throw error;
        }
    }

    return changedImageMap;
}