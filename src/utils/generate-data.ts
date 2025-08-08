import type { Voter } from '@/types';
import { faker } from '@faker-js/faker'; // Import faker library

/**
 * Generates an array of mock voter records using faker.js for more realistic names.
 *
 * @param amount The number of voter records to generate. Defaults to 500 if not provided.
 * @returns An array of Voter objects.
 */
export function generateData(amount: number = 500): Voter[] {
    const voters: Voter[] = [];
    const stations = ['Station A', 'Station B', 'Station C', 'Station D', 'Station E'];

    for (let i = 1; i <= amount; i++) {
        // Generate a full name using faker.js for more diverse names
        const name = faker.person.fullName();

        // Generate a unique card number (padded with leading zeros)
        const cardNumber = `VC-${String(i).padStart(5, '0')}`;

        // Assign a random station
        const station = stations[Math.floor(Math.random() * stations.length)];

        // Generate a placeholder image URL based on initials and index
        const initials = name.split(' ').map(n => n.charAt(0)).join('');
        const imageUrl = `https://placehold.co/150x150/E0E0E0/333333?text=${initials}${i}`;

        voters.push({
            name,
            cardNumber,
            station,
            imageUrl,
            isAgent: false,
            isReferee: false
        });
    }

    return voters;
}

/**
 * Transforms an array of objects from the CSV parser format into an array of Voter objects.
 * This function handles the conversion of keys from "PascalCase with spaces" to camelCase
 * and converts string boolean values ("true" or "false") to actual boolean types.
 * It also defaults to `false` for 'isAgent' and 'isReferee' if the fields are missing
 * and defaults to an empty string for `designation`.
 *
 * @param parsedData The array of objects parsed from a CSV file.
 * @returns An array of Voter objects.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const transformData = (parsedData: any[]): Voter[] => {
    return parsedData.map((item) => ({
        // Map the keys from the CSV object to the Voter interface keys.
        name: item["Name"],
        cardNumber: item["Card Number"],
        station: item["Station"],
        imageUrl: item["ImageUrl"],

        // Convert the string booleans "true" / "false" to actual boolean types.
        // If the field is missing (undefined), the comparison will return false, which is the desired default.
        isAgent: item["isAgent"] === "true",
        isReferee: item["isReferee"] === "true",

        // Default the designation to an empty string if the field is not present in the CSV data.
        designation: item["designation"] || "",
    }));
};