import { useRouter } from 'next/router';
import { PLANS } from "@/lib/constants";
import UpgradeButton from '@/components/other/PlanUpgrade';
import { ChevronLeftIcon, FileText } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const UserPlanPage = () => {
  const router = useRouter();

  const pricingItems = [
    {
      plan: "Weekly",
      price: PLANS.PRO.price / 4,
      tagline1: "For short-term projects.",
      tagline2: "",
      tagline3: ""
                
    },
    {
      plan: "Monthly",
      price: PLANS.PRO.price,
      tagline: "For ongoing projects.",
    },
    {
      plan: "Yearly",
      price: PLANS.PRO.price * 10,
      tagline: "For long-term savings.",
    },
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-black to-gray-900 flex flex-col px-4 py-8 sm:px-6 md:px-8 lg:px-16">
      <Link
        href="/f"
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-fit justify-start text-green-500 mb-8 sm:mb-12"
        )}
      >
        <ChevronLeftIcon className="mr-2 h-4 w-4" />
        Back
      </Link>
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="w-full max-w-4xl space-y-8 text-center mb-12">
          <div className="space-y-4">
            <FileText className="mx-auto h-12 w-12 text-green-500" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Choose Your Pro Plan
            </h1>
            <p className="text-sm sm:text-base text-gray-400">Upgrade to access premium features</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 w-full max-w-4xl">
          {pricingItems.map((item) => (
            <div key={item.plan} className="border border-green-500 rounded-lg p-6 sm:p-8 flex flex-col justify-between bg-gray-800 shadow-sm hover:shadow-md transition-shadow duration-300">
              <div>
                <h2 className="text-2xl font-semibold mb-2 text-white">{item.plan}</h2>
                <p className="text-gray-400 mb-4">{item.tagline1}</p>
                <p className="text-gray-400 mb-4">{item.tagline2}</p>
                <p className="text-gray-400 mb-4">{item.tagline3}</p>
                <p className="text-3xl font-bold mb-6 text-green-500">${item.price.toFixed(2)}</p>
              </div>
              <UpgradeButton plan={item.plan.toLowerCase()} price={item.price} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserPlanPage;