import type { Voter } from '@/types';
import { faker } from '@faker-js/faker'; // Import faker library

/**
 * Generates an array of mock voter records using faker.js for more realistic names.
 *
 * @param amount The number of voter records to generate. Defaults to 500 if not provided.
 * @returns An array of Voter objects.
 */

const generateCardNumber = () => {
    // Generate a random 4-digit number string.
    const part1 = faker.string.numeric(4);
    // Generate another random 4-digit number string.
    const part2 = faker.string.numeric(4);
    // Generate a random 3-digit number string.
    const part3 = faker.string.numeric(3);
    // Generate a single random digit.
    const part4 = faker.string.numeric(1);

    // Combine all the parts with the static "T-" prefix and dashes.
    return `T-${part1}-${part2}-${part3}-${part4}`;
};
export function generateData(amount: number = 500): Voter[] {
    const voters: Voter[] = [];
    const stations = ['Station A', 'Station B', 'Station C', 'Station D', 'Station E'];

    for (let i = 1; i <= amount; i++) {
        // Generate a full name using faker.js for more diverse names
        const firstName = faker.person.firstName().toUpperCase();
        const middleName = faker.person.middleName().toUpperCase();
        const surname = faker.person.lastName().toUpperCase();


        // Generate a unique card number (padded with leading zeros)
        const cardNumber = generateCardNumber();

        // Assign a random station
        const station = stations[Math.floor(Math.random() * stations.length)];

        const dob = faker.date.birthdate().toDateString();

        voters.push({
            firstName,
            middleName,
            surname,
            cardNumber,
            station,
            dob,
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
    return parsedData.map((item) => {
        const data = {
            // Map the keys from the CSV object to the Voter interface keys.
            // name: `${item["firstname"]} ${item["middlename"]} ${item["surname"]}`,
            firstName: item["firstname"],
            middleName: item["middlename"],
            surname: item["surname"],
            cardNumber: item["voter_id"],
            dob: item["date_of_birth"],
            station: item["ward"],

            // Convert the string booleans "true" / "false" to actual boolean types.
            // If the field is missing (undefined), the comparison will return false, which is the desired default.
            isAgent: item["isAgent"] === "true",
            isReferee: item["isReferee"] === "true",

            // Default the designation to an empty string if the field is not present in the CSV data.
            designation: item["designation"] || "",
        };

        return { ...data, cardNumber: data.cardNumber }
    });
};