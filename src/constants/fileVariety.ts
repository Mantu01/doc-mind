import { Archive, BookOpen, Database, FileSpreadsheet, FileText, Image, LucideProps, Music, Presentation, Video } from "lucide-react";


interface FileType {
  icon: React.ElementType<LucideProps>;
  label: string;
  accept: string;
  color: string;
  category: string;
}


export const FILE_TYPES: FileType[] = [
  { icon: Image, label: 'Images', accept: 'image/*', color: 'text-purple-400', category: 'image' },
  { icon: FileText, label: 'PDFs', accept: '.pdf', color: 'text-red-400', category: 'document' },
  { icon: Video, label: 'Videos', accept: 'video/*', color: 'text-blue-400', category: 'video' },
  { icon: Database, label: 'CSV', accept: '.csv', color: 'text-green-400', category: 'data' },
  { icon: FileSpreadsheet, label: 'Excel', accept: '.xlsx,.xls', color: 'text-emerald-400', category: 'data' },
  { icon: Presentation, label: 'PowerPoint', accept: '.ppt,.pptx', color: 'text-orange-400', category: 'document' },
  { icon: FileText, label: 'Word Docs', accept: '.doc,.docx', color: 'text-blue-500', category: 'document' },
  { icon: FileText, label: 'Text Files', accept: '.txt,.rtf', color: 'text-gray-400', category: 'document' },
  { icon: BookOpen, label: 'eBooks', accept: '.epub,.mobi', color: 'text-indigo-400', category: 'document' },
  { icon: Music, label: 'Audio', accept: 'audio/*', color: 'text-pink-400', category: 'audio' },
  { icon: Archive, label: 'Archives', accept: '.zip,.rar,.7z', color: 'text-cyan-400', category: 'archive' }
];