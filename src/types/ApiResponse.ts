import { Message } from "@/model/User";
export interface ApiResponse{
    success:boolean;
    message:string;
    suggestions?:Array<string>
    isAcceptingMessage?:boolean
    messages?:Array<Message>
}