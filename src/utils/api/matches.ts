import { apiFetch } from "@/utils/api/client";
import { Result } from "@/utils/types";
import { PotentialMatchesResponse } from "@/types/matches";

export async function getPotentialMatches(
    limit = 10
): Promise<Result<PotentialMatchesResponse>> {
    return apiFetch<PotentialMatchesResponse>(
        `/matches/potential_matches?limit=${limit}`,
        {
            method: "GET",
        }
    );
}