import { generateSummary } from '@/lib/ai';
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";
import { PLANS } from "@/lib/constants";



export const researchRouter = createTRPCRouter({
  storeResponse: protectedProcedure
  .input(z.object({
    query: z.string(),
    serperResponse: z.any(),
    tavilyResponse: z.any(),
    serperVideos: z.any(),
    serperNews: z.any(),
    documentId: z.string()
  }))
  .mutation(async ({ ctx, input }) => {
    try {
      const result = await ctx.prisma.searchResponse.create({
        data: {
          userId: ctx.session.user.id,
          docid: input.documentId,
          query: input.query,
          serperResponse: input.serperResponse,
          tavilyResponse: input.tavilyResponse,
          serperVideos: input.serperVideos,
          serperNews: input.serperNews,
        },
      });
      
      return result;
    } catch (error) {
      console.error('Error storing data:', error);
      throw error;
    }
  }),
  getPreviousResponses: protectedProcedure
  .input(z.object({ documentId: z.string() }))
  .query(async ({ ctx, input }) => {
    return ctx.prisma.searchResponse.findMany({
      where: { 
        userId: ctx.session.user.id,
        docid: input.documentId
      },
      orderBy: { createdAt: 'asc' },
    });
  }),



  getSummary: protectedProcedure
    .input(
      z.object({
        docId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const document = await ctx.prisma.document.findUnique({
        where: { id: input.docId },
        select: { url: true, owner: { select: { plan: true } } },
      });

      if (!document) {
        throw new Error("Document not found");
      }

      const maxPagesAllowed = PLANS[document.owner.plan].maxPagesPerDoc;
      const summary = await generateSummary(document.url, maxPagesAllowed);
    //  console.log("summary",summary);
      return summary;
    }),
});
