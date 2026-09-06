export function countValidPhotos(
    photos: readonly unknown[] | null | undefined,
): number {
    if (!Array.isArray(photos)) {
        return 0;
    }

    return photos.filter(
        (photo) => typeof photo === "string" && photo.trim().length > 0,
    ).length;
}
