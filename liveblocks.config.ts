import { env } from "@/env.mjs";
import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

const client = createClient({
  publicApiKey: env.NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_API_KEY,
});

type Presence = {
  // Add your presence properties here
};

type Storage = {
  // Add your storage properties here
};

type UserMeta = {
  // Add your user metadata properties here
};

type RoomEvent = {
  // Add your room event properties here
};

export type ThreadMetadata = {
  // Add your thread metadata properties here
};

export const {
  suspense: {
    RoomProvider,
    useRoom,
    useMyPresence,
    useUpdateMyPresence,
    useSelf,
    useOthers,
    useOthersMapped,
    useOthersConnectionIds,
    useOther,
    useBroadcastEvent,
    useEventListener,
    useErrorListener,
    useStorage,
    //useMap,
    //useList,
    useBatch,
    useHistory,
    useUndo,
    useRedo,
    useCanUndo,
    useCanRedo,
    useMutation,
    useStatus,
    useLostConnectionListener,
    useThreads,
    useUser,
    useCreateThread,
    useEditThreadMetadata,
    useCreateComment,
    useEditComment,
    useDeleteComment,
    useAddReaction,
    useRemoveReaction,
  },
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent, ThreadMetadata>(
  client
);
