'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useToast } from "@/components/ui/use-toast"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import axios, { AxiosError } from 'axios'
import { ApiResponse } from "@/types/ApiResponse"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { messageSchema } from "@/schemas/messageSchema"

import Link from "next/link"




const page = () => {

  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const params = useParams<{ username: string }>()
  const username = params.username
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema)
  })
  const messageText=form.watch('content')
  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    setIsSubmitting(true)
    try {
      console.log(form)
      console.log(data)
      const response = await axios.post<ApiResponse>("/api/send-message", { ...data, username })
      toast({
        title: 'Success',
        description: response.data.message
      })
      setIsSubmitting(false)
      form.reset({ ...form.getValues(), content: '' });
    } catch (error) {
      console.log("Error sending the message", error)
      const axiosError = error as AxiosError<ApiResponse>
      let errorMessage = axiosError.response?.data.message
      toast({
        title: "Failed to send message",
        description: errorMessage,
        variant: "destructive"
      })
      setIsSubmitting(false)
    }
  }
 
  return (
    <div className="container flex flex-col gap-6 mx-auto my-8 p-6 bg-white rounded max-w-4xl">
      
        <h1 className="text-4xl font-bold mb-6 text-center">Public Profile Link</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Send Anonymous Message to @{username}</FormLabel>
                <FormControl>
                  <Textarea  placeholder="Enter Your Anonymous Message Here" {...field} />
                </FormControl>
                <FormDescription>
                  SEND TO YOUR LOVED ONE.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
           <div className="flex justify-center">
           {isSubmitting ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button className=" flex items-center justify-center gap-2" type="submit" disabled={isSubmitting || !messageText}>
                Send It<Send size={22}/>
              </Button>
            )}
           </div>
        </form>
      </Form>
      
      <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    
    </div>

    
  )
}

export default page