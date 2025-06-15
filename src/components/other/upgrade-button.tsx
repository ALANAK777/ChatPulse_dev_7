import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { FC } from "react";
import { useRouter } from "next/router";
import { toast } from "sonner";

interface UpgradeButtonProps {
  plan: string;
  price: number;
}

const UpgradeButton: FC<UpgradeButtonProps> = ({ plan, price }) => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleUpgrade = () => {
    if (!session) {
      toast.error("Please sign in to upgrade");
      return;
    }

    router.push('/upgrade-plans');
  };

  return (
    <Button onClick={handleUpgrade}>
      Upgrade to Pro
    </Button>
  );
};

export default UpgradeButton;
