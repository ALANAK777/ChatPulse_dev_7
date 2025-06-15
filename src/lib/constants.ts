import { Plan } from "@prisma/client";

interface PlanData {
  title: string;
  price: number;
  maxDocs: number;
  maxPagesPerDoc: number;

  maxFileSizePerDoc: number;

  maxquestion:number,
  maxresearch:number,
  maxchat:number,

  maxCollaboratorsPerDoc: number;
}

export const PLANS: Record<Plan, PlanData> = {
  FREE: {
    title: "Free",
    price: 0,

    maxDocs: 1,
    maxPagesPerDoc: 12,
    maxFileSizePerDoc: 7 * 1024 * 1024,
    maxchat:5,
    maxquestion:5,
    maxresearch:5,
  
    

    maxCollaboratorsPerDoc: 0,
  },
  PRO: {
    title: "Pro",
    price: 10,
    maxchat:Infinity,
    maxDocs: Infinity,
    maxPagesPerDoc: 50,
    
    maxFileSizePerDoc: 10 * 1024 * 1024,

    maxquestion:30,
    maxresearch:30,
  

    maxCollaboratorsPerDoc: 5,
  },
};
