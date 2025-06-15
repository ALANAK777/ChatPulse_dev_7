import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { Input } from "@/components/ui/input";
import { SpinnerPage } from "@/components/ui/spinner";
import { useToast } from "@/components/ui/use-toast";
import ProUploadFileModal from "@/components/workspace/pro-upload-file-modal";
import UploadFileModal from "@/components/workspace/upload-file-modal";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { ChevronLeftIcon, SearchIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const UserLibraryPage = () => {
  const {
    data: userDocs,
    isError,
    isLoading,
    refetch: refetchUserDocs,
  } = api.user.getUsersDocs.useQuery();
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const deleteDocMutation = api.document.deleteDocument.useMutation();
  const {toast} = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

  if (isError) return <div className="text-red-500">Something went wrong</div>;
  if (isLoading) return <SpinnerPage />;
  if (!userDocs)
    return <div className="text-gray-500">Sorry no result found</div>;
 
  const combinedUserDocs = [
    ...userDocs?.documents,
    ...userDocs?.collaboratorateddocuments?.map((collab) => collab.document),
  ]?.sort((a, b) => (a.createdAt > b.createdAt ? -1 : 1));

  const filteredUserDocs = combinedUserDocs?.filter((doc) =>
    doc.title.trim().toLowerCase().includes(searchQuery.trim().toLowerCase()) &&
    doc.id !== 'cm0iew5b90006n88lkto78r0y'
  );
  

  const handleDeleteClick = (id: string, title: string) => {
    setDocumentToDelete({ id, title });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (documentToDelete) {
      try {
        await deleteDocMutation.mutateAsync({
          documentId: documentToDelete.id,
        });
        await refetchUserDocs();
        toast({
          title: "Success",
          description: "Document deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete document",
        });
      }
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#0E1016] to-[#111827] text-white px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "mb-6 w-fit justify-start p-2 text-green-400 hover:text-black",
          )}
        >
          <ChevronLeftIcon className="mr-2 h-4 w-4" />
          Back
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <p className="text-2xl font-semibold tracking-tighter text-green-400 mb-2">
              Hello, {userDocs?.name || "User"}
            </p>
            <p className="text-gray-400">
              {combinedUserDocs.length === 0
                ? "You have no files yet, upload one now!"
                : "Here are your files"}
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            {userDocs.plan === "PRO" ? (
              <ProUploadFileModal refetchUserDocs={refetchUserDocs} />
            ) : (
              <UploadFileModal
                docsCount={userDocs.documents.length}
                refetchUserDocs={refetchUserDocs}
              />
            )}
          </div>
        </div>

        {combinedUserDocs.length > 0 && (
          <div className="mt-6">
            <div className="relative mb-6">
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                className="pl-9 bg-gray-800 text-white border-gray-700 focus:border-green-400 w-full"
                type="search"
                placeholder="Search for a document"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredUserDocs?.map((doc) => (
                <DocCard
                  key={doc.id}
                  id={doc.id}
                  title={doc.title}
                  isCollab={userDocs.collaboratorateddocuments.some(
                    (collab) => collab.document.id === doc.id,
                  )}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          </div>
        )}
        <DeleteConfirmationDialog
          isOpen={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
          onConfirm={handleDeleteConfirm}
          documentTitle={documentToDelete?.title || ""}
        />
      </div>
    </div>
  );
};

const DocCard = ({
  title,
  id,
  isCollab,
  onDelete,
}: {
  title: string;
  id: string;
  isCollab: boolean;
  onDelete: (id: string, title: string) => void;
}) => {
  return (
    <div className="relative bg-gray-800 text-white rounded-lg shadow-md border border-gray-700">
      <Link
        href={`/f/${id}`}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "flex w-full flex-col gap-2 py-6 px-4 rounded-lg hover:bg-gray-700",
        )}
      >
        <p className="text-sm sm:text-base break-words">
          {title?.slice(0, 30) + (title.length > 30 ? "..." : "") ?? "Untitled"}
        </p>
        {isCollab && (
          <Badge className="w-fit bg-green-600 text-white text-xs">
            Collab
          </Badge>
        )}
      </Link>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 h-8 w-8 text-red-400 hover:bg-red-500"
        onClick={(e) => {
          e.preventDefault();
          onDelete(id, title);
        }}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default UserLibraryPage;
