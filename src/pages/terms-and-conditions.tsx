import React from 'react';
import Link from 'next/link';
import { ChevronLeftIcon } from 'lucide-react';
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const TermsAndConditionsPage = () => {
  return (
    <div className="bg-gradient-to-b from-black to-gray-900 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "w-fit self-start text-green-500 mb-8 sm:mb-12"
          )}
        >
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
          Back
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 mb-4">
          Terms & Conditions
        </h1>
        <p className="text-center text-gray-400 italic mb-8">
          Last updated on {new Date().toLocaleDateString()}
        </p>
        <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-md">
          <p className="mb-4 text-gray-300">
            Welcome to ChatPulse! We're excited to have you. These terms help make sure everything runs smoothly and safely while you use our AI-powered document assistant. By using ChatPulse, you’re agreeing to the following:
          </p>
          <p className="mb-4 font-semibold text-green-500">
            Use of ChatPulse is subject to the following terms:
          </p>
          <ol className="list-decimal pl-6 space-y-3 text-gray-300">
            <li>ChatPulse helps analyze and process documents, but it's not meant to replace expert advice. Use it as a tool.</li>
            <li>Please provide accurate details when using ChatPulse so we can assist you better.</li>
            <li>Our AI models are always learning and improving, but they might sometimes get things wrong. Make sure to verify key info.</li>
            <li>The documents you upload are yours, so make sure they don't contain anything confidential or sensitive that you don’t want to share.</li>
            <li>We respect your privacy. Your documents are only processed to deliver the service, and we don't share them with third parties.</li>
            <li>You own your documents. By using ChatPulse, you give us permission to process them for the service.</li>
            <li>ChatPulse is provided as-is, without any promises or warranties.</li>
            <li>We may modify or even discontinue ChatPulse at any time, without notice.</li>
            <li>Please don't use ChatPulse for anything illegal or harmful that could affect the service for others.</li>
            <li>We may update these terms now and then. Continued use means you're okay with the changes.</li>
            <li>If you choose a paid plan, you agree to the fees. Refunds follow our policy.</li>
            <li>If you violate these terms, we may suspend or terminate your access without notice.</li>
            <li>These terms are governed by the laws of [Your Jurisdiction].</li>
            <li>If you have any questions or concerns, feel free to reach out through our website!</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;
//check