'use client'

import React, { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import { SpinnerPage } from '@/components/ui/spinner';
import { toast } from "sonner";

import { ClientSideSuspense } from "@liveblocks/react";
import { RoomProvider } from "liveblocks.config";
import { useRouter } from "next/router";
import { Copy, Download,FileText,FileUp,FileType2,Pencil, PlusCircle, Loader2} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Document, Packer, Paragraph, HeadingLevel,TextRun } from 'docx';
import TiptapEditor from './TipTap';
interface Question {
  questionText: string;
  answer: string;
  marks: string;
}


const GenerateQuestions = () => {

  
  const { query } = useRouter();
  const documentId = query?.docId as string;
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [inputText, setInputText] = useState("");

  const {
    data: questions,
    isLoading,
    isError,
    refetch
  } = api.question.getGeneratedQuestions.useQuery({ documentId });
  
  
  const incrementQuestionCount = api.document.incrementQuestionCount.useMutation();
  const { mutate: generateResponse, isLoading: isGeneratingResponse } =
    api.question.generateResponse.useMutation({
      onSuccess: () => {
        refetch();
        toast.success('Questions generated successfully');
        incrementQuestionCount.mutate({ documentId });
      },
      onError: (err: any) => {
        toast.error(err.message, {
          duration: 1000,
        });
      },
    });

  if (isLoading) return <SpinnerPage />;
  if (isError || !questions) return <div>Something went wrong</div>;



const downloadAllAs = (format: 'copy' | 'pdf' | 'word' | 'markdown') => {
  const content = questions.map((q, i) => 
    `Question ${i + 1}: ${q.questionText}\nAnswer: ${q.answer}\nMarks: ${q.marks}\n\n`
  ).join('');

  switch (format) {
    case 'copy':
      navigator.clipboard.writeText(content);
      toast.success('Copied!');
      break;
      case 'pdf':
        const pdf = new jsPDF();
        const pageWidth = pdf.internal.pageSize.width;
        const margin = 20;
        const lineHeight = 7;
        let y = margin;
      
        questions.forEach((q, i) => {
          pdf.setFont("helvetica", "bold");
          pdf.text(`Question ${i + 1}:`, margin, y);
          y += lineHeight;
      
          pdf.setFont("helvetica", "normal");
          const lines = pdf.splitTextToSize(q.questionText, pageWidth - 2 * margin);
          pdf.text(lines, margin, y);
          y += lines.length * lineHeight;
      
          pdf.setFont("helvetica", "bold");
          pdf.text("Answer:", margin, y);
          y += lineHeight;
      
          pdf.setFont("helvetica", "normal");
          const answerLines = pdf.splitTextToSize(q.answer, pageWidth - 2 * margin);
          pdf.text(answerLines, margin, y);
          y += answerLines.length * lineHeight;
      
          pdf.text(`Marks: ${q.marks}`, margin, y);
          y += lineHeight * 2;
      
          if (y > pdf.internal.pageSize.height - margin) {
            pdf.addPage();
            y = margin;
          }
        });
      
        pdf.save('questions.pdf');
        toast.success('Questions downloaded as PDF');
        break;
      
        case 'word':
          const doc = new Document({
            sections: [{
              properties: {},
              children: questions.flatMap((q, i) => [
                new Paragraph({
                  text: `Question ${i + 1}:`,
                  heading: HeadingLevel.HEADING_3,
                  
                  spacing: { before: 400, after: 200 }
                }),
                new Paragraph({
                  heading: HeadingLevel.HEADING_1,
                  spacing: { after: 200 },
                  children: [
                      new TextRun({
                          text: q.questionText,
                          color: "000000"  // Set color to black
                      })
                  ]
              }),
                new Paragraph({
                  text: "Answer:",
                  style: 'strong',
                  spacing: { before: 200, after: 200 }
                }),
                new Paragraph({
                  text: q.answer,
                  spacing: { after: 200 }
                }),
                new Paragraph({
                  text: `Marks: ${q.marks}`,
                  spacing: { after: 400 }
                })
              ])
            }]
          });
        
          Packer.toBlob(doc).then(blob => {
            saveAs(blob, 'questions.docx');
            toast.success('Questions downloaded as Word');
          });
          break;
        
    case 'markdown':
      const markdownContent = questions.map((q, i) => 
        `## Question ${i + 1}\n\n${q.questionText}\n\n**Answer:** ${q.answer}\n\n**Marks:** ${q.marks}\n\n`
      ).join('');
      const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
      saveAs(blob, 'questions.md');
      toast.success('Questions downloaded as Markdown');
      break;
  }
};


  return (
    <div className="h-full flex flex-col space-y-4 p-4">
     
     <div className="mt-8 bg-grey-700 p-6 rounded-lg shadow-md">
  <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b-2 border-blue-300 pb-2">Generate Questions and Answers:</h2>
  <div className="flex space-x-2 items-center">
    <Button
      onClick={() => {
        generateResponse({ documentId, question: 'Generate Two marks and five marks with clear explanation' });
      }}
      disabled={isGeneratingResponse}
      className={`
        px-6 py-3 rounded-full font-semibold text-white
        transition-all duration-300 ease-in-out
        ${isGeneratingResponse 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-1'
        }
      `}
    >
      {isGeneratingResponse ? (
        <span className="flex items-center">
          <Loader2 className="animate-spin mr-2 h-5 w-5" />
          Generating...
        </span>
      ) : (
        <span className="flex items-center">
          <PlusCircle className="mr-2 h-5 w-5" />
          Ask
        </span>
      )}
    </Button>
  </div>



        <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto ">
    <DialogHeader>
      <DialogTitle>Edit Questions</DialogTitle>

    </DialogHeader>
    <div className="relative h-full overflow-y-auto">
    <RoomProvider
      id={`doc-${documentId}`}
      initialPresence={{}}
    >
      <ClientSideSuspense fallback={<SpinnerPage />}>
        {() => (
         <TiptapEditor
          questions={questions}
          id={documentId}
        />
        )}
      </ClientSideSuspense>
    </RoomProvider>
    
  </div>
  </DialogContent>
</Dialog>

        {questions && questions.length > 0 && (
         
  <div className="mt-4 p-4 bg-gray-100 rounded">
    <div className='flex mb-3 justify-between items-center'>
  <h3 className="text-lg font-semibold mb-2">Generated Questions:</h3>

  <div className="flex space-x-2 justify-end">
  <Pencil className="cursor-pointer"  onClick={() => setIsEditModalOpen(true)}/>
    <Popover>
      <PopoverTrigger>
        <Download className="cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col space-y-3 w-26">
        <button className='inline-flex ' onClick={() => downloadAllAs('copy')}><Copy className='mr-4'/> Copy to ClipBoard</button>
          <button  className='inline-flex ' onClick={() => downloadAllAs('pdf')}><FileText className='mr-4'/> Download as PDF</button>
          <button className='inline-flex '  onClick={() => downloadAllAs('word')}><FileUp className='mr-4'/> Download as Word</button>
          <button  className='inline-flex ' onClick={() => downloadAllAs('markdown')}><FileType2 className='mr-4'/>Download as Markdown</button>
        </div>
      </PopoverContent>
    </Popover>
  </div>
  </div>
  <div className="space-y-2">
    {questions.map((question, index) => (
      <div key={question.id} className="p-2 bg-white rounded">
        <p><strong>Question {index + 1}:</strong> {question.questionText}</p>
        <p><strong>Answer:</strong> {question.answer}</p>
        {question.marks && <p><strong>Marks:</strong> {question.marks}</p>}
      </div>
    ))}
  </div>
  
</div>
        )}
      </div>
    </div>
  );
};

export default GenerateQuestions;
