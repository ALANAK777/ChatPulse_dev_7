import React from 'react'
import '@/styles/styles.scss'
import { convert } from 'html-to-text';
import TurndownService from 'turndown';

import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Download,Copy,FileText,FileUp} from 'lucide-react';
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Highlight from '@tiptap/extension-highlight'
import TextAlign from '@tiptap/extension-text-align'
import { Editor } from '@tiptap/react'

import html2pdf from 'html2pdf.js';
import HTMLDocx from 'html-docx-js/dist/html-docx';

import { toast } from "sonner";
const MenuBar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null
  }

  return (
    
    <div className="control-group" style={{marginBottom:"38px"}}>
      <div style={{display:'flex',justifyContent:'space-between'}} className="button-group">
        <button
         style={{
            backgroundColor: editor.isActive('heading', { level: 1 }) ? '#5B00D3' : '#F0EEED',
            color:editor.isActive('heading', { level: 1 }) ? '#ffffff' : '#000000',
            padding: '7px 11px', 
            borderRadius: '5px', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '16px', 
            margin: '4px' 
          }}
         onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}>
          H1
        </button>
        <button 
        style={{
            backgroundColor: editor.isActive('heading', { level: 2 }) ? '#5B00D3' : '#F0EEED',
            color:editor.isActive('heading', { level: 2 }) ? '#ffffff' : '#000000',
            padding: '7px 11px', 
            borderRadius: '5px', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '16px', 
            margin: '4px' 
          }}
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}>
          H2
        </button>
        <button
         style={{
            backgroundColor: editor.isActive('heading', { level: 3 }) ? '#5B00D3' : '#F0EEED',
            color:editor.isActive('heading', { level: 3 }) ? '#ffffff' : '#000000',
            padding: '7px 11px', 
            borderRadius: '5px', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '16px', 
            margin: '4px' 
          }}
         onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}>
          H3
        </button>
        <button
         style={{
            backgroundColor: editor.isActive('paragraph') ? '#5B00D3' : '#F0EEED',
            color: editor.isActive('paragraph') ? '#ffffff' : '#000000',
            padding: '7px 11px', 
            borderRadius: '5px', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '16px', 
            margin: '4px' 
          }} 
        onClick={() => editor.chain().focus().setParagraph().run()} className={editor.isActive('paragraph') ? 'is-active' : ''}>
          Paragraph
        </button>
        <button
         style={{
            backgroundColor: editor.isActive('bold') ? '#5B00D3' : '#F0EEED',
            color: editor.isActive('bold') ? '#ffffff' : '#000000',
            padding: '7px 11px', 
            borderRadius: '5px', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '16px', 
            margin: '4px' 
          }} 
         onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive('bold') ? 'is-active' : ''}>
          Bold
        </button>
        <button 
         style={{
            backgroundColor: editor.isActive('italic') ? '#5B00D3' : '#F0EEED',
            color: editor.isActive('italic') ? '#ffffff' : '#000000',
            padding: '7px 11px', 
            borderRadius: '5px', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '16px', 
            margin: '4px' 
          }} 
        onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive('italic') ? 'is-active' : ''}>
          Italic
        </button>
        <button 
         style={{
            backgroundColor: editor.isActive('strike') ? '#5B00D3' : '#F0EEED',
            color: editor.isActive('strike') ? '#ffffff' : '#000000',
            padding: '7px 11px', 
            borderRadius: '5px', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '16px', 
            margin: '4px' 
          }} 
        onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive('strike') ? 'is-active' : ''}>
          Strike
        </button>
        <button 
         style={{
            backgroundColor: editor.isActive('highlight') ? '#5B00D3' : '#F0EEED',
            color: editor.isActive('highlight') ? '#ffffff' : '#000000',
            padding: '7px 11px', 
            borderRadius: '5px', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '16px', 
            margin: '4px' 
          }} 
        onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive('highlight') ? 'is-active' : ''}>
          Highlight
        </button>
        <button 
         style={{
            backgroundColor: editor.isActive({ textAlign: 'left' }) ? '#5B00D3' : '#F0EEED',
            color: editor.isActive({ textAlign: 'left' }) ? '#ffffff' : '#000000',
            padding: '7px 11px', 
            borderRadius: '5px', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '16px', 
            margin: '4px' 
          }} 
        onClick={() => editor.chain().focus().setTextAlign('left').run()} className={editor.isActive({ textAlign: 'left' }) ? 'is-active' : '' }>
          Left
        </button>
        <button 
         style={{
            backgroundColor: editor.isActive({ textAlign: 'center' }) ? '#5B00D3' : '#F0EEED',
            color: editor.isActive({ textAlign: 'center' }) ? '#ffffff' : '#000000',
            padding: '7px 11px', 
            borderRadius: '5px', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '16px', 
            margin: '4px' 
          }} 
        onClick={() => editor.chain().focus().setTextAlign('center').run()} className={editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}>
          Center
        </button>
        <button
         style={{
            backgroundColor: editor.isActive({ textAlign: 'right' }) ? '#5B00D3' : '#F0EEED',
            color: editor.isActive({ textAlign: 'right' }) ? '#ffffff' : '#000000',
            padding: '7px 11px', 
            borderRadius: '5px', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '16px', 
            margin: '4px' 
          }} 
         onClick={() => editor.chain().focus().setTextAlign('right').run()} className={editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}>
          Right
        </button>
        <button
         style={{
            backgroundColor: editor.isActive({ textAlign: 'justify' }) ? '#5B00D3' : '#F0EEED',
            color: editor.isActive({ textAlign: 'justify' }) ? '#ffffff' : '#000000',
            padding: '7px 11px', 
            borderRadius: '5px', 
            border: 'none', 
            cursor: 'pointer', 
            fontSize: '16px', 
            margin: '4px' 
          }} 
         onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}>
          Justify
        </button>
      </div>
    </div>
  
  )
}

interface TiptapEditorProps {
  questions: {
    id: string;
    questionText: string;
    answer: string;
    documentId: string;
    marks: string;
    createdAt: Date;
    updatedAt: Date;
  }[];
  id: string;
}
const TiptapEditor: React.FC<TiptapEditorProps> = ({ questions, id }) => {

  
const convertHtmlToFormattedText = (html: string) => {
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    emDelimiter: '_',
    bulletListMarker: '-',
  });

  // Custom rule to preserve alignment
  turndownService.addRule('alignment', {
    filter: ['p', 'div'],
    replacement: function(content, node) {
      const element = node as HTMLElement;
      const align = element.style.textAlign;
      if (align && align !== 'left') {
        return `<div style="text-align: ${align}">${content}</div>\n\n`;
      }
      return content + '\n\n';
    }
  });

  // Custom rule to preserve bold text
  turndownService.addRule('bold', {
    filter: ['strong', 'b'],
    replacement: function(content) {
      return `**${content}**`;
    }
  });

  return turndownService.turndown(html);
};
const content = questions.map((q, index) => `
  <h2>Question ${index + 1}</h2>
  <h2><strong>${q.questionText}</strong></h2>
  <h3>Answer</h3>
  <p>${q.answer}</p>
  <p><strong>Marks:</strong> ${q.marks}</p>
`).join('');

const storedContent = localStorage.getItem(`editor-content-${id}`);
let initialContent;

if (!storedContent || storedContent === '<p></p>') {
  initialContent = content;
  localStorage.setItem(`editor-content-${id}`, content);
} else {
  initialContent = storedContent;
}

const editor = useEditor({
  extensions: [
    StarterKit,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Highlight,
  ],
  content: initialContent,
  onUpdate: ({ editor }) => {
    const html = editor.getHTML();
    localStorage.setItem(`editor-content-${id}`, html);
  },
});

  const downloadAllAs = (format: 'copy' | 'pdf' | 'word' | 'markdown') => {
    if (!editor) {
      toast.error('Editor is not available');
      return;
    }

    const content = editor.getHTML();
    switch (format) {
      case 'copy':
        
        const plainText = convert(content, {
          wordwrap: 130, // optional: wrap text
          selectors: [
            { selector: 'img', format: 'skip' }, // Skip images
            { selector: 'a', options: { hideLinkHrefIfSameAsText: true } } // Clean up links
          ]
        });
      
        // Copy the plain text to the clipboard
        navigator.clipboard.writeText(plainText).then(() => {
          console.log('Text copied to clipboard successfully!');
          // Optional: Show success message using a toast
          toast.success('Text copied to clipboard!');
        }).catch(err => {
          console.error('Failed to copy text to clipboard:', err);
          // Optional: Show error message using a toast
          toast.error('Failed to copy text to clipboard.');
        });
    
      
        break;
      case 'pdf':
        // Create a temporary container for the HTML content
        const tempElement = document.createElement('div');
        tempElement.innerHTML = content;
    
        // Generate and download PDF
        html2pdf().from(tempElement).set({
          margin: 1,
          filename: 'document.pdf',
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        }).save();
      
        toast.success('Questions downloaded as PDF');
        break;

      case 'word':
        // Simplified conversion example. You should parse HTML properly for complex documents.

        const tempElement1 = document.createElement('div');
  tempElement1.innerHTML = content;

  // Convert the HTML content to a DOCX Blob
  const converted = HTMLDocx.asBlob(tempElement1.innerHTML);

  // Trigger download of the DOCX file
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(converted);
  link.download = 'document.docx';
  link.click();

  toast.success('Questions downloaded as DOCX');
  break;

   
    }
  };
  return (
    <div className="tiptap border-none">
         <div className="fixed z-[1] bottom-6 right-8 bg-[#6D28D9] p-3 rounded-full shadow-lg cursor-pointer">
 
         <Popover>
      <PopoverTrigger>
        <Download className="cursor-pointer text-white" />
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col space-y-3 w-26">
        <button className='inline-flex ' onClick={() => downloadAllAs('copy')}><Copy className='mr-4'/> Copy to ClipBoard</button>
          <button  className='inline-flex ' onClick={() => downloadAllAs('pdf')}><FileText className='mr-4'/> Download as PDF</button>
          <button className='inline-flex '  onClick={() => downloadAllAs('word')}><FileUp className='mr-4'/> Download as Word</button>
        
        </div>
      </PopoverContent>
    </Popover>

</div>
    <MenuBar editor={editor} />
    <EditorContent editor={editor} />
  </div>
  )
}

export default TiptapEditor
