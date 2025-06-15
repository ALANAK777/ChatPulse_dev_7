import { createRouteHandler } from "uploadthing/next-legacy";

import { docUploader } from "@/server/uploadthing";
 export const runtime = 'nodejs';

const handler = createRouteHandler({
  router: docUploader,
});

export default handler;
