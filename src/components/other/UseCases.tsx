import {
  Book,
  FileQuestion,
  FileSpreadsheet,
  FileText,
  Scale,
  School,
} from "lucide-react";
import React from "react";

const useCases = [
  {
    icon: FileText,
    title: "Research Papers",
    description:
      "Whether it's a quick paper for a class or a full systematic review, ChatPulse can help find deep insights and compare opinions across papers.",
  },
  {
    icon: Scale,
    title: "Legal Documents",
    description:
      "The law is confusing so let's make it easier to understand! ChatPulse can help you find all the answers you need from your legal documents.",
  },
  {
    icon: FileQuestion,
    title: "User Manuals",
    description:
      "Forgot a step? Don't remember how that one piece fit with everything else? Don't sweat it! ChatPulse can help you find the instructions you need.",
  },
  {
    icon: FileSpreadsheet,
    title: "Financial Documents",
    description:
      "10-K's, 10-Q's, 8-K's, Form 3, 4, 5...they're all so confusing. Don't be afraid to tackle these documents and let ChatPulse find the answers you need.",
  },
  {
    icon: Book,
    title: "Books",
    description:
      "Never read alone again with your new book buddy. ChatPulse can help you summarize parts you've forgotten or help explain something you missed.",
  },
  {
    icon: School,
    title: "Course Materials",
    description:
      "ChatPulse is your personal study buddy and can help explain complex concepts, summarize learnings and extract key points you need to remember.",
  },
];

const UseCases: React.FC = () => {
  return (
    <div className="bg-gray-900 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600 mb-12">
          FIT FOR ALL YOUR NEEDS
        </h2>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((useCase, index) => (
            <div
              key={index}
              className={`rounded-lg p-6 transition duration-300 h-64 ${
                index % 2 === 0
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-800 hover:bg-gray-700"
              }`}
            >
              <useCase.icon
                className={`h-8 w-8 mb-4 ${index % 2 === 0 ? "text-white" : "text-green-500"}`}
              />
              <h3
                className={`text-lg font-medium mb-2 ${index % 2 === 0 ? "text-gray-100" : "text-white"}`}
              >
                {useCase.title}
              </h3>
              <p
                className={index % 2 === 0 ? "text-gray-200" : "text-gray-300"}
              >
                {useCase.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UseCases;
