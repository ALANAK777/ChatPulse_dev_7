import DocViewer from "@/components/pdf-reader";

import { useState, useEffect } from 'react';
import { FileText, Menu } from 'lucide-react';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";


import { SpinnerPage } from "@/components/ui/spinner";
import Sidebar from "@/components/workspace/sidebar";
import { api } from "@/lib/api";
import { useRouter } from "next/router";
import { toast } from "sonner";


const DocViewerPage = () => {
  const { query, push } = useRouter();
  const [showPdfOnMobile, setShowPdfOnMobile] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  const {
    data: doc,
    isLoading,
    isError,
    error,
  } = api.document.getDocData.useQuery(
        {
          docId: query.docId as string,
        },
        {
          enabled: !!query?.docId,
        }
      );
  if (isLoading) {
    return <SpinnerPage />;
  }

  if (isError) {
    if (error?.data?.code === "UNAUTHORIZED") {
      push("/f");
      toast.error(error.message, {
        duration: 3000,
      });
    }
    return  <>Something went wrong :( </>;
  }

  return (
 
  (
    <>
      {isMobile && (
        <div className="fixed top-4 left-4 z-50 flex gap-2">
          <button
            onClick={() => setShowPdfOnMobile(!showPdfOnMobile)}
            className="p-2 mt-11 bg-white rounded-full shadow-md"
          >
            <FileText size={22} />
          </button>
        </div>
      )}
      <div className="h-screen flex transition-all duration-300">
        {isMobile ? (
          <>
            <div
              className={`h-full bg-white shadow-lg transition-transform duration-300 ${
                showPdfOnMobile ? 'w-1/3' : 'w-0'
              }`}
            >
              {showPdfOnMobile && (
                <DocViewer doc={doc} canEdit={doc.userPermissions.canEdit} />
              )}
            </div>
            <div
              className={`flex-1 transition-all duration-300 ${
                showPdfOnMobile ? 'w-1/2' : 'w-full'
              }`}
            >
              <Sidebar
                canEdit={doc.userPermissions.canEdit}
                username={doc.userPermissions.username || ''}
                isOwner={doc.userPermissions.isOwner}
                isVectorised={doc.isVectorised}
              />
            </div>
          </>
        )   : (
      <ResizablePanelGroup autoSaveId="window-layout" direction="horizontal">
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-screen min-w-[25vw] border-stone-200 bg-white sm:rounded-lg sm:border-r sm:shadow-lg">
            <DocViewer doc={doc} canEdit={doc.userPermissions.canEdit} />
          </div>
        </ResizablePanel>
        <div className="group flex w-2 cursor-col-resize items-center justify-center rounded-md bg-gray-50">
          <ResizableHandle className="h-1 w-24 rounded-full bg-neutral-400 duration-300 group-hover:bg-primary group-active:bg-primary group-active:duration-75 lg:h-24 lg:w-1" />
        </div>
        <ResizablePanel defaultSize={50} minSize={30}>
          <div className="h-full min-w-[25vw] flex-1">
            <Sidebar
              canEdit={doc.userPermissions.canEdit}
              username={doc.userPermissions.username || ''}
              isOwner={doc.userPermissions.isOwner}
              isVectorised={doc.isVectorised}
            />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    )}
  </div>
</>

    
    
  )
);
};
export default DocViewerPage;
