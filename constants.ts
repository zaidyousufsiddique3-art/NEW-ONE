import { BookOpen, FileQuestion, CreditCard, Lightbulb, FileText, Cpu } from 'lucide-react';
import { ToolId, ToolConfig } from './types';

// Tool configurations - 6 nodes
export const TOOLS: ToolConfig[] = [
  {
    id: ToolId.ASK_QUESTION,
    title: 'Ask a Question',
    description: 'Get detailed answers to your ICT questions',
    icon: BookOpen,
    translationKey: 'askQuestion',
    descriptionKey: 'askQuestionDesc',
    promptTemplate: (topic: string, notes?: string) => `
      You are an expert A-Level ICT tutor. Answer the following question clearly and comprehensively.
      
      Question: ${topic}
      ${notes ? `\nAdditional Context: ${notes}` : ''}
      
      Provide a clear, structured answer with examples where appropriate.
    `
  },
  {
    id: ToolId.EXAM_QUESTIONS,
    title: 'Exam-Style Questions',
    description: 'Generate practice exam questions with mark schemes',
    icon: FileQuestion,
    translationKey: 'examQuestions',
    descriptionKey: 'examQuestionsDesc',
    promptTemplate: (topic: string, notes?: string) => `
      You are an expert A-Level ICT exam question writer.
      Generate EXACTLY 10 high-quality exam-style questions on: ${topic}
      ${notes ? `\nAdditional Context: ${notes}` : ''}
      
      For EACH question provide:
      1. The question itself
      2. Mark allocation (e.g., [4 marks])
      3. A detailed sample answer with key points
      
      Format clearly with proper numbering and spacing.
      IMPORTANT: Generate exactly 10 questions with complete answers.
    `
  },
  {
    id: ToolId.FLASHCARDS,
    title: 'Flashcards',
    description: 'Create flashcards for quick revision',
    icon: CreditCard,
    translationKey: 'flashcards',
    descriptionKey: 'flashcardsDesc',
    promptTemplate: (topic: string, notes?: string) => `
      You are an expert A-Level ICT tutor creating flashcards.
      Create EXACTLY 10 flashcards on: ${topic}
      ${notes ? `\nAdditional Context: ${notes}` : ''}
      
      For EACH flashcard provide:
      - Question/Concept (front of card)
      - Answer/Explanation (back of card)
      
      Format as numbered cards with clear Q&A structure.
      Make them concise but comprehensive for revision.
      IMPORTANT: Generate exactly 10 flashcards.
    `
  },
  {
    id: ToolId.REVISION_QUESTIONS,
    title: 'Quick Revision Questions',
    description: 'Fast recall questions for active revision',
    icon: Lightbulb,
    translationKey: 'revisionQuestions',
    descriptionKey: 'revisionQuestionsDesc',
    promptTemplate: (topic: string, notes?: string) => `
      You are an expert A-Level ICT tutor creating quick revision materials.
      Generate EXACTLY 10 short revision questions on: ${topic}
      ${notes ? `\nAdditional Context: ${notes}` : ''}
      
      For EACH item provide:
      1. A short, sharp revision question
      2. A concise model answer (1-2 sentences)
      
      Format as a numbered list.
      Focus on key definitions, facts, and concepts for rapid recall.
      IMPORTANT: Generate exactly 10 questions with answers.
    `
  },
  {
    id: ToolId.CASE_STUDY,
    title: 'Case Study Answers',
    description: 'Structured answers for case study scenarios',
    icon: FileText,
    translationKey: 'caseStudy',
    descriptionKey: 'caseStudyDesc',
    promptTemplate: (topic: string, notes?: string) => `
      You are an expert A-Level ICT tutor helping with case study analysis.
      Generate EXACTLY 5 case studies on: ${topic}
      ${notes ? `\nAdditional Context: ${notes}` : ''}
      
      For EACH case study provide:
      1. A realistic scenario (2-3 sentences describing a situation)
      2. A model answer that includes:
         - Introduction
         - Key points with clear analysis
         - Evaluation and recommendations
         - Conclusion
      
      Format clearly with proper numbering.
      Make each case study suitable for A-Level ICT examination standards.
      IMPORTANT: Generate exactly 5 complete case studies with scenarios and model answers.
    `
  },
  {
    id: ToolId.LOGIC_DIAGRAM,
    title: 'Generate Logic Diagram',
    description: 'Create logic circuit diagrams from descriptions',
    icon: Cpu,
    translationKey: 'logicDiagram',
    descriptionKey: 'logicDiagramDesc',
    promptTemplate: (topic: string, notes?: string) => `
      Generate a logic circuit diagram for: ${topic}
      ${notes ? `\nAdditional Context: ${notes}` : ''}
    `
  }
];
