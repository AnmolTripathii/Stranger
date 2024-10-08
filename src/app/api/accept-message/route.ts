import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(request: Request) {

    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user
console.log(user)
    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            {
                status: 401
            }
        )
    }

    const userId = user._id
    const { acceptMessages } = await request.json()
    console.log(acceptMessages)
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessages: acceptMessages },
            { new: true }
        )
        console.log(updatedUser)
        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "Failed to update user status to accept message.As user not found."
                },
                {
                    status: 401
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Message acceptance setting of user updated succesfully",
                updatedUser
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.log("Failed to update user status to accept message", error)
        return Response.json(
            {
                success: false,
                message: "Failed to update user status to accept message"
            },
            {
                status: 500
            }
        )
    }
}

export async function GET(request: Request) {

    await dbConnect()
    const session = await getServerSession(authOptions)
    const user: User = session?.user

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated"
            },
            {
                status: 401
            }
        )
    }
    console.log(user)
    const userId = user._id
    try {
        const foundUser = await UserModel.findById(userId)

        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found."
                },
                {
                    status: 404
                }
            )
        }

        return Response.json(
            {
                success: true,
                isAcceptingmessage: foundUser.isAcceptingMessages
            },
            {
                status: 200
            }
        )
    } catch (error) {
        console.log("Error in getting message acceptance status", error)
        return Response.json(
            {
                success: false,
                message: "Error in getting message acceptance status"
            },
            {
                status: 500
            }
        )
    }

}