import { Message } from "@/model/User";
export interface ApiResponse{
    success:boolean;
    message:string;
    suggestions?:Array<string>
    isAcceptingmessage?:boolean
    messages?:Array<Message>
}