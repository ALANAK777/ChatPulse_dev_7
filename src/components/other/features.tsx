import { useFeatureStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useInView } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef } from "react";
// import newgif from "/features/new.gif";

const features = [
  {
    title: "Annotate your documents with ease",
    imageUrl: "/features/annotation.gif",
    description: "To create area highlight hold ⌥ Option key (Alt), then click and drag.",
  },
  {
    title: "Take notes with a notion like editor",
    imageUrl: "/features/editor.gif",
    description: "With AI features, and export to Markdown.",
  },
  {
    title: "Ask the chatbot anything pdf related",
    imageUrl: "/features/chatbot.gif",
  },
  {
    title: "Generate Flashcards",
    imageUrl: "/features/flashcard.gif",
    description: "Answer the flashcard, and get feedbacks on what you missed.",
  },
  {
    title: "Collaborate with your team",
    imageUrl: "/features/collab.gif",
    description: "With real-time updates.",
  },
];

function Features() {
  return (
    <div className="bg-gradient-to-b from-black to-grey-900 -translate-y-42">
      <div className="mx-auto max-w-6xl px-4 md:block 2xl:max-w-[80%] ">
        <div>
          <div className="flex w-full items-start gap-20">
            <div className="w-full md:py-[2vh]">
              <ul>
                {features.map((feature, index) => (
                  <li key={index}>
                    <FeatureData
                      id={index}
                      title={feature.title}
                      description={feature.description}
                    />
                  </li>
                ))}
              </ul>
            </div>
            <div className="sticky top-0 hidden h-screen w-full items-center md:flex">
              <FeatureImage />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const FeatureImage = () => {
  const inViewFeature = useFeatureStore((state) => state.inViewFeature);

  const invalidFeature =
    typeof inViewFeature !== "number" ||
    !features[inViewFeature] ||
    !features[inViewFeature]?.imageUrl ||
    typeof features[inViewFeature]?.imageUrl !== "string";

  return (
    <div className="relative aspect-video h-[40%] w-full rounded-2xl lg:h-[40%] [&:has(>_.active-card)]:bg-transparent">
    {!invalidFeature && inViewFeature !== null && features[inViewFeature] && (
      <Image
          alt="feature"
          src={features[inViewFeature].imageUrl}
          width={800}
          height={450}
          className="h-full w-full rounded-md"
          unoptimized={true}
        />
    
    )}
  </div>
  
  );
};

export default Features;

type FeatureDataProps = {
  id: number;
  title: string;
  description?: string;
};

export const FeatureData = ({id, title, description }: FeatureDataProps) => {
  const ref = useRef<HTMLParagraphElement>(null);
  const documentRef = useRef(null);
  const isInView = useInView(ref, {
    margin: "-50% 0px -50% 0px",
    root: documentRef,
  });

  const setInViewFeature = useFeatureStore((state) => state.setInViewFeature);
  const inViewFeature = useFeatureStore((state) => state.inViewFeature);

  useEffect(() => {
    if (isInView) setInViewFeature(id);
    if (!isInView && inViewFeature === id) setInViewFeature(null);
  }, [isInView, id, setInViewFeature, inViewFeature]);

  return (
    <p
      ref={ref}
      className={cn(
        "feature-title font-heading py-16 text-4xl font-semibold tracking-tight transition-colors xl:text-5xl 2xl:text-6xl",
        isInView ? "text-green-500" : "text-gray-600",
      )}
    >
      {title}
      {description && (
        <span
          className={cn(
            "mt-3 block text-lg font-normal tracking-tight 2xl:text-3xl",
            isInView ? "text-white" : "text-gray-400",
          )}
        >
          {description}
        </span>
      )}
    </p>
  );
};