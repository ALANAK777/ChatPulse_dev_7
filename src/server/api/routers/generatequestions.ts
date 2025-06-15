import { PLANS } from "@/lib/constants";
import { generateQuestions } from '@/lib/GenerateQuestion';
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { prisma } from "@/server/db";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const questionRouter = createTRPCRouter({
  generateResponse: protectedProcedure
    .input(z.object({ documentId: z.string(), question: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const res = await ctx.prisma.document.findUnique({
        where: {
          id: input.documentId,
          OR: [
            { ownerId: ctx.session.user.id },
            {
              collaborators: {
                some: {
                  userId: ctx.session.user.id,
                },
              },
            },
          ],
        },
        select: {
          url: true,
          owner: {
            select: {
              plan: true,
            },
          },
        },
      });

      if (!res) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Document not found or you do not have access to it",
        });
      }

      const docOwnerPlan = res.owner.plan;
      const maxPagesAllowed = PLANS[docOwnerPlan].maxPagesPerDoc;

      const response = await generateQuestions(res.url, maxPagesAllowed);
      console.log(response);
      const createdQuestions = await ctx.prisma.generatedQuestion.createMany({
        data: response.map(question => ({
          questionText: question.question,
          answer: question.answer,
          marks: question.marks.toString(), // Convert to string if it's not already
          documentId: input.documentId,
        })),
      });
      console.log("genertaed questions",createdQuestions);
      await ctx.prisma.document.update({
        where: { id: input.documentId },
        data: {
          counts: {
            upsert: {
              create: {
                questionCount: 1
              },
              update: {
                questionCount: {
                  increment: 1
                }
              }
            }
          }
        }
      });
      return createdQuestions;
    }),

  getQuestions: protectedProcedure
    .input(z.object({ documentId: z.string() }))
    .query(async ({ ctx, input }) => {
      const questions = await ctx.prisma.question.findMany({
        where: {
          documentId: input.documentId,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return questions;
    }),
    getGeneratedQuestions: protectedProcedure
  .input(z.object({ documentId: z.string() }))
  .query(async ({ ctx, input }) => {
    const questions = await ctx.prisma.generatedQuestion.findMany({
      where: {
        documentId: input.documentId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return questions;
  }),
 


});
