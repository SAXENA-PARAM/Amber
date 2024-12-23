declare module "string-similarity" {
    /**
     * Compares two strings and returns a similarity score between 0 and 1.
     * @param string1 - The first string to compare.
     * @param string2 - The second string to compare.
     * @returns A similarity score between 0 (no similarity) and 1 (identical strings).
     */
    export function compareTwoStrings(string1: string, string2: string): number;
  
    /**
     * Finds the best match for a given string from an array of target strings.
     * @param mainString - The string to match against.
     * @param targetStrings - An array of strings to compare with.
     * @returns An object containing the best match and similarity ratings for all target strings.
     */
    export function findBestMatch(
      mainString: string,
      targetStrings: string[]
    ): {
      ratings: { target: string; rating: number }[];
      bestMatch: { target: string; rating: number };
      bestMatchIndex: number;
    };
  }
  