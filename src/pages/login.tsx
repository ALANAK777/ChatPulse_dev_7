import { GoogleIcon } from "@/components/other/icons";
import { buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, FileText } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black to-gray-900 flex flex-col px-4 py-8 sm:px-6 md:px-8 lg:px-16">
      <Link
        href="/"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-fit justify-start text-green-500 mb-8 sm:mb-12"
        )}
      >
        <ChevronLeftIcon className="mr-2 h-4 w-4" />
        Back
      </Link>
      <div className="flex-grow flex items-center justify-center mb-40">
        <div className="w-full max-w-md space-y-8 text-center">
          <div className="space-y-4">
            <FileText className="mx-auto h-12 w-12 text-green-500" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Welcome to ChatPulse
            </h1>
            <p className="text-sm sm:text-base text-gray-400">Sign in to access your account</p>
          </div>

          <button
            type="button"
            className={cn(
              buttonVariants({ variant: "outline" }),
              "w-full bg-gray-800 hover:bg-gray-700 text-white border-green-500"
            )}
            onClick={() => {
              setIsLoading(true);
              signIn("google");
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner className="text-green-500" />
            ) : (
              <GoogleIcon className="mr-2 h-5 w-5" />
            )}{" "}
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;