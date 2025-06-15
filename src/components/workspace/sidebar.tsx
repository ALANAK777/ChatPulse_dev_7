import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ClientSideSuspense } from "@liveblocks/react";
import { RoomProvider } from "liveblocks.config";
import Link from "next/link";


import {
  ReactSketchCanvas,
  type ReactSketchCanvasRef,
} from "react-sketch-canvas";
import { useRef } from "react";
import { AlbumIcon, Download, Layers, MessagesSquareIcon, FileQuestion, Brush, ArrowLeft, Crown,Lock } from "lucide-react";
import { saveAs } from "file-saver";
import { api } from "@/lib/api";
import Chat from "@/components/chat";
import Editor from "@/components/editor";
import Flashcards from "@/components/flashcard";
import GenerateQuestions from "../GenarateQuestion";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { SpinnerPage } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomTooltip } from "@/components/ui/tooltip";
import { useBlocknoteEditorStore } from "@/lib/store";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import InviteCollab from "./invite-collab-modal";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const TABS = [
  {
    value: "notes",
    tooltip: "Take notes",
    icon: <AlbumIcon size={20} />,
    isNew: false,
  },
  {
    value: "chat",
    tooltip: "Chat with the pdf",
    icon: <MessagesSquareIcon size={20} />,
    isNew: false,
  },
  {
    value: "flashcards",
    tooltip: "Generate flashcards from the pdf",
    icon: <Layers size={20} />,
    isNew: false,
  },
  {
    value: "Generate Questions",
    tooltip: "Generate Questions and download",
    icon: <FileQuestion size={20} />,
    isNew: true,
  }
];

const tabNames = TABS.map((tab) => tab.value);

const DrawingTab: React.FC<{ setShowDrawingTab: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setShowDrawingTab }) => {
  const canvasRef = useRef<ReactSketchCanvasRef>(null);
  const [eraseMode, setEraseMode] = useState(false);

  const handleEraserClick = () => {
    setEraseMode(true);
    canvasRef.current?.eraseMode(true);
  };

  const handlePenClick = () => {
    setEraseMode(false);
    canvasRef.current?.eraseMode(false);
  };

  const handleUndoClick = () => {
    canvasRef.current?.undo();
  };

  const handleRedoClick = () => {
    canvasRef.current?.redo();
  };

  const handleClearClick = () => {
    canvasRef.current?.clearCanvas();
  };

  const handleResetClick = () => {
    canvasRef.current?.resetCanvas();
  };

  return (
    <div className="flex-1 overflow-scroll border-stone-200 bg-white sm:rounded-lg sm:border sm:shadow-lg h-[calc(100vh-3.5rem)] w-full">
      <div className="p-4 ">
        <button onClick={() => setShowDrawingTab(false)} className="mt-7">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <div className="flex flex-col gap-2 p-2">
  <h1 className="text-2xl font-bold">Tools</h1>
  <div className="flex gap-2 items-center">
    <button
      type="button"
      className={`px-3 py-1 text-sm rounded-md ${!eraseMode ? 'bg-blue-500 text-white' : 'border border-blue-500 text-blue-500'}`}
      disabled={!eraseMode}
      onClick={handlePenClick}
    >
      Pen
    </button>
    <button
      type="button"
      className={`px-3 py-1 text-sm rounded-md ${eraseMode ? 'bg-green-500 text-white' : 'border border-green-500 text-blue-500'}`}
      disabled={eraseMode}
      onClick={handleEraserClick}
    >
      Eraser
    </button>
    <div className="w-px h-6 bg-gray-300" />
    <button
      type="button"
      className="px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
      onClick={handleUndoClick}
    >
      Undo
    </button>
    <button
      type="button"
      className="px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
      onClick={handleRedoClick}
    >
      Redo
    </button>
    <button
      type="button"
      className="px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
      onClick={handleClearClick}
    >
      Clear
    </button>
    <button
      type="button"
      className="px-3 py-1 text-sm border border-blue-500 text-blue-500 rounded-md hover:bg-blue-50"
      onClick={handleResetClick}
    >
      Reset
    </button>
  </div>
  <h1 className="text-2xl font-bold">Canvas</h1>
  <ReactSketchCanvas  width="100%"
        height="400px"
        canvasColor="transparent"
        strokeColor="#a855f7" ref={canvasRef} />
</div>

      </div>
    </div>
  );
};

const Sidebar = ({
  canEdit,
  username,
  isOwner,
  isVectorised,
}: {
  canEdit: boolean;
  username: string;
  isOwner: boolean;
  isVectorised: boolean;
}) => {
  const { query, push } = useRouter();
  const documentId = query?.docId as string;
  const tab = query.tab as string;
  const [showDrawingTab, setShowDrawingTab] = useState(false);
  const { editor } = useBlocknoteEditorStore();
  const [activeIndex, setActiveIndex] = useState(
    tab && tabNames.includes(tab) ? tab : "chat",
  );
  const { data: session } = useSession();
  const[ispro,setispro]=useState(true);
  const { data: subscriptionDetails, isLoading: isSubscriptionLoading } = api.document.getSubscriptionDetails.useQuery(
    { userId: session?.user?.id ?? '' },
    { enabled: !!session?.user?.id }
  );
  
  useEffect(() => {
    if (subscriptionDetails) {
      const isPro = subscriptionDetails.plan==='PRO';
      setispro(isPro);
    }
   // console.log("subcsription details form button",subscriptionDetails);
  }, [subscriptionDetails]);
  const handleDownloadMarkdownAsFile = async () => {
    if (!editor) return;
    const markdownContent = await editor.blocksToMarkdownLossy(editor.document);
    const blob = new Blob([markdownContent], { type: "text/markdown" });
    saveAs(blob, "notes.md");
  };

  useEffect(() => {
    if (tab && tabNames.includes(tab)) {
      setActiveIndex(tab);
    }
  }, [tab]);

  return (
    <div className="bg-gray-50">
      <Tabs
        value={activeIndex}
        onValueChange={(value) => {
          setActiveIndex(value);
          push(
            {
              query: {
                ...query,
                tab: value,
              },
            },
            undefined,
            { shallow: true },
          );
        }}
        defaultValue="notes"
        className="max-h-screen max-w-full overflow-hidden"
      >
        <div className="flex items-center justify-between pr-1">
          <TabsList className="h-12 rounded-md bg-gray-200">
            {TABS.map((item) => (
              <CustomTooltip content={item.tooltip} key={item.value}>
                <TabsTrigger value={item.value} className="relative">
                  {item.isNew && (
                    <div className="absolute -bottom-2 -right-2">
                      <Badge className="bg-blue-400 p-[0.05rem] text-[0.5rem] hover:bg-blue-500">
                        NEW
                      </Badge>
                    </div>
                  )}
                  {item.icon}
                </TabsTrigger>
              </CustomTooltip>
            ))}
          </TabsList>
          <div className="flex items-center gap-2">
      

          {ispro ? (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <Button className="bg-gradient-to-r from-yellow-400 to-yellow-300" variant="outline" size="icon">
          <Crown className="h-4 w-4" /> 
          
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Pro Subscription Active</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
) : (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
         <Link
                  href="/upgrade-plans">
        <Button size="sm" className="bg-gray-200 text-gray-700 font-medium px-3 py-1 rounded-full shadow-sm hover:bg-gray-300 transition-all duration-300">
        <Lock className="h-5 w-5"/>
        </Button>
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        <p>Free Plan</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
)}
            {isOwner && <InviteCollab />}
            <div
              className={cn(
                buttonVariants({ variant: "ghost", size: "sm" }),
                "ml-auto cursor-pointer border-stone-200 bg-white px-2 text-xs shadow-sm sm:border",
              )}
              onClick={handleDownloadMarkdownAsFile}
            >
              <Download size={20} />
            </div>
          </div>
        </div>

        {[
         {
          value: "notes",
          tw: "flex-1 overflow-scroll border-stone-200 bg-white sm:rounded-lg sm:border sm:shadow-lg h-[calc(100vh-3.5rem)] w-full overflow-scroll",
          children: (
            <RoomProvider
              id={`doc-${documentId}`}
              initialPresence={{}}
            >
              <div className="relative w-full h-full">
                {!showDrawingTab ? (
                  <>
                    <button onClick={() => setShowDrawingTab(true)} className="absolute top-0 right-4 z-10">
                      <Brush size={20} />
                    </button>
                    <ClientSideSuspense fallback={<SpinnerPage />}>
                      {() => (
                        <Editor
                          canEdit={canEdit ?? false}
                          username={username ?? "User"}
                        />
                      )}
                    </ClientSideSuspense>
                  </>
                ) : (
                  <DrawingTab setShowDrawingTab={setShowDrawingTab} />
                )}
              </div>
            </RoomProvider>
          ),
        },
          {
            value: "chat",
            tw: " p-2 pb-0 break-words border-stone-200 bg-white sm:rounded-lg sm:border sm:shadow-lg h-[calc(100vh-3.5rem)] w-full overflow-scroll ",
            children: <Chat isVectorised={isVectorised} />,
          },
          {
            value: "flashcards",
            tw: " p-2 pb-0 break-words border-stone-200 bg-white sm:rounded-lg sm:border sm:shadow-lg h-[calc(100vh-3.5rem)] w-full overflow-scroll ",
            children: <Flashcards />,
          },
          {
            value: "Generate Questions",
            tw: " p-2 pb-0 break-words border-stone-200 bg-white sm:rounded-lg sm:border sm:shadow-lg h-[calc(100vh-3.5rem)] w-full overflow-scroll ",
            children: <GenerateQuestions />,
          },
        ].map((item) => (
          <TabsContent
            key={item.value}
            forceMount
            hidden={item.value !== activeIndex}
            value={item.value}
            className={item.tw}
          >
            {item.children}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Sidebar;
