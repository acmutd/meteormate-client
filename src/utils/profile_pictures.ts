import imageCompression from 'browser-image-compression';
import { storage, auth } from '@/firebase/firebase';
import {
    deleteObject,
    getDownloadURL,
    ref,
    uploadBytes,
    type StorageReference,
} from 'firebase/storage';

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
    const currentUser = auth.currentUser;
    if (!currentUser) {
        throw new Error("You must be signed in to upload profile pictures");
    }

    const uid = currentUser.uid;
    const changedImageMap: Record<number, string> = {}; // slotIndex -> new URL
    const uploadedRefs: StorageReference[] = [];

    try {
        for (let i = 0; i < base64Images.length; i++) {
            const base64 = base64Images[i];
            if (!base64.startsWith("data:")) continue;

            const blob = await (await fetch(base64)).blob();
            const filePath = `profile_pictures/${uid}/${crypto.randomUUID()}.webp`;
            const imageRef = ref(storage, filePath);

            await uploadBytes(imageRef, blob);
            uploadedRefs.push(imageRef);

            const downloadURL = await getDownloadURL(imageRef);
            changedImageMap[i] = downloadURL;
        }
    } catch (error) {
        const cleanupResults = await Promise.allSettled(
            uploadedRefs.map((imageRef) => deleteObject(imageRef)),
        );
        const cleanupFailures = cleanupResults.filter(
            (result) => result.status === "rejected",
        );

        if (cleanupFailures.length > 0) {
            console.error(
                `Failed to clean up ${cleanupFailures.length} partially uploaded profile picture(s)`,
            );
        }

        throw error;
    }

    return changedImageMap;
};
