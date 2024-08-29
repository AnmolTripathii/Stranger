import { z } from "zod";

export const usernameValidation = z
.string()
.min(3,"Username must be atleast 3 characters")
.max(20,"Username must not be more then 20 character")
.regex(/^[a-zA-Z0-9_]+$/,"Username must not contain special character")

export const signUpSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message:'Invvalid email address'}),
    password: z.string().min(8,{message:"password atleast 8 character"})
})