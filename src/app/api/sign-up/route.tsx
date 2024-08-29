// import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/model/User";
// import bcrypt from "bcryptjs"
// import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

// export async function POST(request: Request) {
//     await dbConnect()

//     try {
//         const { username, email, password } = await request.json()
//         const existingUserVerifiedByUsername = await UserModel.findOne({
//             username,
//             isVerified: true
//         })
//         if (existingUserVerifiedByUsername) {
//             return Response.json({
//                 scusses: false,
//                 message: "Username is already taken"
//             }, { status: 400 })
//         }


//         const existingUserByEmail = await UserModel.findOne({ email })
//         const verifyCode=Math.floor(100000+Math.random()*900000).toString()
//         if(existingUserByEmail){
//             if(existingUserByEmail.isVerified){
//                 return Response.json({
//                     success:false,
//                     message: "User with this email already exist"
//                 },{status:400})
//             }
//             else{
//                 const hashedPassword=await bcrypt.hash(password,10)
//                 existingUserByEmail.password=hashedPassword;
//                 existingUserByEmail.verifyCode=verifyCode;
//                 existingUserByEmail.verifyCodeExpiry=new Date(Date.now()+3600000)
//                 await existingUserByEmail.save()
//             }
//         }

//         else{
//             const hashedPassword=await bcrypt.hash(password,10)
//             const expiryDate= new Date()
//             expiryDate.setHours(expiryDate.getHours()+1)
//             const newUser=new UserModel({
//                 username,
//                 email,
//                 password:hashedPassword,
//                 verifyCode,
//                 verifyCodeExpiry:expiryDate,
//                 isVerified:false,
//                 isAcceptingMessage:true,
//                 message:[]
//             })
//             await newUser.save()
//         }

//         //send verification email
//         const emailResponse= await sendVerificationEmail(
//             email,
//             username,
//             verifyCode
//         )
//         if(!emailResponse.success){
//             return Response.json({
//                 success:false,
//                 message: emailResponse.message
//             },{status:500})
//         }
//         return Response.json({
//             success:true,
//             message:"User is registered successfully.Please verify your email"
//         },{status:201})



//     } catch (error) {
//         console.error("Error registring user",error)
//         return Response.json(
//             {
//                 success: false,
//                 message: "Error registring user"
//             },
//             {
//                 status: 500
//             }
//         )
//     }
// }
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        // Check if the username is already taken
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        });
        if (existingUserVerifiedByUsername) {
            return Response.json({
                success: false,
                message: "Username is already taken"
            }, { status: 400 });
        }

        // Check if the email is already registered
        const existingUserByEmail = await UserModel.findOne({ email });
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: "User with this email already exists"
                }, { status: 400 });
            } else {
                // Update existing user with the new password
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword;
                existingUserByEmail.isVerified = true;
                await existingUserByEmail.save();
            }
        } else {
            // Create a new user
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                isVerified: true,
                isAcceptingMessage: true,
                message: []
            });
            await newUser.save();
        }

        return Response.json({
            success: true,
            message: "User is registered successfully."
        }, { status: 201 });

    } catch (error) {
        console.error("Error registering user", error);
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        );
    }
}
