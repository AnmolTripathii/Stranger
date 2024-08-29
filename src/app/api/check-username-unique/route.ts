import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { z } from "zod"
import { usernameValidation } from "@/schemas/signUpSchema";


const UsernameQuerySchema = z.object({
    username: usernameValidation
})

function getAlphabeticLength(str: string): number {
    // Use a regular expression to match only alphabetic characters
    const alphabeticCharacters = str.match(/[a-zA-Z]/g);

    // If no alphabetic characters are found, return 0
    if (!alphabeticCharacters) {
        return 0;
    }

    // Return the length of the matched alphabetic characters
    return alphabeticCharacters.length;
}

function generateUsernameSuggestions(username: string) {
    const suggestions = [];
    const newlen = getAlphabeticLength(username)

    if (newlen > 0) {
        let userLen = username.length - newlen
        if(userLen<=1){
            userLen=2
        }
        const newstr = username.slice(0, newlen);
        for (let i = 1; i <= 6; i++) {
            const min = Math.pow(10, userLen - 1);
            const max = Math.pow(10, userLen) - 1;
            const num = Math.floor(Math.random() * (max - min + 1)) + min;
            const resStr = `${newstr}${num}`;
            suggestions.push(resStr);
        }
        return suggestions;
    }
    else {
        return []
    }
}

export async function GET(request: Request) {
    await dbConnect()

    try {
        const { searchParams } = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }
        //valid with zod
        const result = UsernameQuerySchema.safeParse(queryParam)
        console.log(result)
        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || []
            return Response.json({
                success: false,
                message: usernameErrors?.length > 0 ? usernameErrors.join(',') : 'Invalid query parameters'
            }, { status: 400 })
        }
        const { username } = result.data
        const existingVerifiedUser = await UserModel.findOne({ username, isVerified: true })

        if (existingVerifiedUser) {

            const suggestions = generateUsernameSuggestions(username);

            const availableSuggestions = [];

            for (const suggestion of suggestions) {
                const existingSuggestionUser = await UserModel.findOne({ username: suggestion, isVerified: true });
                if (!existingSuggestionUser) {
                    availableSuggestions.push(suggestion);
                    if (availableSuggestions.length >= 4) break; // Limit to 5 suggestions
                }
            }

            return Response.json({
                success: false,
                message: "Username is already taken",
                suggestions: availableSuggestions,
            }, { status:200 })
        }
        return Response.json({
            success: true,
            message: "Username is unique",
        }, { status: 200 })

    } catch (error) {
        console.error("Error checking username", error)
        return Response.json(
            {
                success: false,
                message: "Error  checking username"
            },
            {
                status: 500
            }
        )
    }
}