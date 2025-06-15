import React from 'react';
import Link from 'next/link';
import { ChevronLeftIcon } from 'lucide-react';
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0E1016] to-[#111827] text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

        <div className="max-w-4xl mx-auto space-y-8">
          <h1 className="text-3xl md:text-4xl font-bold text-green-400">Privacy Policy</h1>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold text-green-300 mb-2">Information We Collect</h2>
            <p className="text-gray-300">
              ChatPulse collects information you provide when using our AI-powered chat service, including chat logs, user preferences, and account details.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold text-green-300 mb-2">How We Use Your Information</h2>
            <p className="text-gray-300">
              We use your information to improve ChatPulse's AI capabilities, personalize your experience, and provide customer support. Your chat data helps train our AI models to deliver better responses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold text-green-300 mb-2">Sharing of Information</h2>
            <p className="text-gray-300">
              ChatPulse does not sell your personal information. We may share anonymized data with research partners to improve our AI technology. Your individual chat logs remain private.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold text-green-300 mb-2">Data Security</h2>
            <p className="text-gray-300">
              We employ industry-standard encryption and security measures to protect your data. ChatPulse regularly updates its security protocols to safeguard your information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold text-green-300 mb-2">Your Rights</h2>
            <p className="text-gray-300">
              You can request access to your data, ask for corrections, or delete your account at any time. ChatPulse respects your right to control your personal information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold text-green-300 mb-2">Changes to This Privacy Policy</h2>
            <p className="text-gray-300">
              We may update this Privacy Policy as ChatPulse evolves. We'll notify you of significant changes via email or through the app.
            </p>
          </section>

          <section>
            <h2 className="text-2xl md:text-3xl font-semibold text-green-300 mb-2">Contact Us</h2>
            <p className="text-gray-300">
              If you have any questions about ChatPulse's Privacy Policy, please contact our support team at aiagency444@gmail.com.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage;