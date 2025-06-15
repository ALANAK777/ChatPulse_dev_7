import { Button } from "@/components/ui/button";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "@/lib/api";
import { FC, useEffect, useState } from "react";
import { toast } from "sonner";

interface UpgradeButtonProps {
  plan: string;
  price: number;
}

const UpgradeButton: FC<UpgradeButtonProps> = ({ plan, price }) => {
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const { data: subscriptionDetails } = api.document.getSubscriptionDetails.useQuery(
    { userId: session?.user?.id ?? '' },
    { enabled: !!session?.user?.id }
  );

  useEffect(() => {
    const loadRazorpayScript = async () => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      document.body.appendChild(script);
    };
    loadRazorpayScript();
  }, []);

  const calculateEndDate = (plan: string): Date => {
    const now = new Date();
    switch (plan) {
      case 'weekly':
        return new Date(now.setDate(now.getDate() + 7));
      case 'monthly':
        return new Date(now.setMonth(now.getMonth() + 1));
      case 'yearly':
        return new Date(now.setFullYear(now.getFullYear() + 1));
      default:
        throw new Error('Invalid plan');
    }
  };

  const getAmount = (plan: string): number => {
    switch (plan) {
      case 'weekly':
        return 400;
      case 'monthly':
        return 800;
      case 'yearly':
        return 8000;
      default:
        return 0;
    }
  };

  const handleUpgrade = async () => {
    if (!session) {
      toast.error("Please sign in to upgrade");
      return;
    }

    setIsLoading(true);
    try {
      if (subscriptionDetails?.plan === 'PRO' && subscriptionDetails?.subscriptionStatus === 'active') {
        toast.error("You are already subscribed to the PRO plan");
        setIsLoading(false);
        return;
      }

      const response = await axios.post('/api/create-subscription', {
        price: getAmount(plan),
        plan: plan
      });
     
      const { id: orderId } = response.data;

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: getAmount(plan),
        currency: "INR",
        name: 'ChatPulse',
        description: `${plan} Plan`,
        order_id: orderId,
        handler: async (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => {
          const result = await axios.post('/api/verify-payment', {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });
          if(result.data.success){
            if (session && session.user) {
              const startDate = new Date();
              const endDate = calculateEndDate(plan);
              const updateResult = await axios.post('/api/update-subscription', {
                userId: session.user.id,
                subscriptionId: response.razorpay_payment_id,
                subscriptionPlan: "PRO",
                subscriptionStartDate: startDate,
                subscriptionEndDate: endDate,
              });
         
              if (updateResult.data.success) {
                console.log('Payment details:', updateResult.data.user);
                toast.success("Payment successful!");
                router.push("/f");
              } else {
                toast.error("Failed to update payment details");
              }
            }
          } else {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          email: session.user?.email,
        },
        theme: {
          color: '#10B981',
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (error: any) {
      console.error("Upgrade error:", error);
      toast.error(`Failed to initiate upgrade. Please try again. ${error.message || ''}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleUpgrade}
      disabled={isLoading}
    >
      {isLoading
        ? "Processing..."
        : `Upgrade to ${plan.charAt(0).toUpperCase() + plan.slice(1)} - $${price}`}
    </Button>
  );
};

export default UpgradeButton;
