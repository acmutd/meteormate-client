
import { apiFetch } from "@/utils/api/client";
import type { Result } from "@/utils/types";
import type { PotentialMatchesResponse } from "@/types/matches";

export async function getPotentialMatches(
    limit = 10
): Promise<Result<PotentialMatchesResponse>> {
    const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 10;

    return apiFetch<PotentialMatchesResponse>(
        `/matches/potential_matches?limit=${safeLimit}`,
        {
            method: "GET",
        }
    );
}

export async function likeUser(
    targetUserId: string
): Promise<Result<{ message: string }>> {
    return apiFetch<{ message: string }>(
        `/matches/like/${encodeURIComponent(targetUserId)}`,
        {
            method: "POST",
        }
    );
}

export async function passUser(
    targetUserId: string
): Promise<Result<{ message: string }>> {
    return apiFetch<{ message: string }>(
        `/matches/pass/${encodeURIComponent(targetUserId)}`,
        {
            method: "POST",
        }
    );
}
