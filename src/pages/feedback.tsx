import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChevronLeftIcon, FileText } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  FEEDBACK_FORM_DEFAULT_VALUES,
  FEEDBACK_TYPES,
  feedbackFormSchema,
} from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import emailjs from '@emailjs/browser';
const Feedback = () => {
  const { mutateAsync: submitFeedbackMutation, isLoading } =
    api.user.submitFeedback.useMutation();

  const form = useForm<z.infer<typeof feedbackFormSchema>>({
    resolver: zodResolver(feedbackFormSchema),
    defaultValues: FEEDBACK_FORM_DEFAULT_VALUES,
  });

  const onSubmit = async () => {
    const formValues = form.getValues();
    await submitFeedbackMutation(form.getValues());
    
    toast.success(
      "Feedback submitted! Thank you for sharing your thoughts with us 🥳",
    );
    emailjs.init("n2HHehuy4rt5Tus2C");

    try {
      await emailjs.send("service_g0bctsb", "template_kz0736x", {
        from_name: formValues.email ,
        
       type: formValues.type,
        to_email: formValues.email, // Replace with your admin email
      
      });

    } catch (error) {
      console.error("EmailJS error:", error);
      toast.error("There was an error sending your feedback. Please try again.");
    }

    form.reset();
  


  };

  return (
    <div className="bg-gradient-to-b from-black to-gray-900 min-h-screen">
      <div className="mx-auto flex h-full w-full max-w-5xl flex-1 flex-col items-center px-8 py-16 lg:px-16">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-fit self-start  text-green-500 mb-8 sm:mb-12"
        )}
      >
        <ChevronLeftIcon className="mr-2 h-4 w-4" />
        Back
      </Link>
        <h1 className="mt-4 mb-2 text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">
          Submit Feedback!
        </h1>
        <p className="mb-8 text-sm text-gray-400">
          Help us make the app even better 🥳
        </p>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-8 w-full max-w-md"
          >
            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white mb-2">Suggestion</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="What would you like to see in the app?"
                      className="w-full resize-none bg-gray-800 text-white border-gray-700 p-3"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white mb-2">Feedback type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700 p-3">
                        <SelectValue placeholder="Select feedback type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="bg-gray-800 text-white border-gray-700">
                      {FEEDBACK_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-red-400 mt-1" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white mb-2">Contact Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="To hear back from us (optional)"
                      className="w-full bg-gray-800 text-white border-gray-700 p-3"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400 mt-1" />
                </FormItem>
              )}
            />
            <Button
              disabled={isLoading}
              className="mt-4 w-full bg-green-500 text-black hover:bg-green-400 p-3"
              type="submit"
            >
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Feedback;