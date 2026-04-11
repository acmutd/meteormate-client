import { Filter } from "bad-words";

const filter = new Filter();

// checks if a string contains profanity
export const isProfane = (text: string): boolean => {
    if (!text) return false;
    return filter.isProfane(text);
};