import { useState } from "react";
import { DocumentInfo } from "./SideBar";
import { WebsiteInfo } from "@/helpers/getWebsiteInfo";
import { Archive, CheckCircle, Database, ExternalLink, FileSpreadsheet, FileText, Image as Img, Music, Presentation, Trash2, Video, X } from "lucide-react";

interface AnalyzedDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  websites: WebsiteInfo[];
  documents: DocumentInfo[];
  onDeleteWebsite: (id: number) => void;
  onDeleteDocument: (id: number) => void;
}

const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf': return <FileText className="w-4 h-4 text-red-400" />;
    case 'png': case 'jpg': case 'jpeg': case 'gif': return <Img className="w-4 h-4 text-purple-400" />;
    case 'mp4': case 'mov': case 'avi': return <Video className="w-4 h-4 text-blue-400" />;
    case 'csv': return <Database className="w-4 h-4 text-green-400" />;
    case 'xlsx': case 'xls': return <FileSpreadsheet className="w-4 h-4 text-emerald-400" />;
    case 'pptx': case 'ppt': return <Presentation className="w-4 h-4 text-orange-400" />;
    case 'docx': case 'doc': return <FileText className="w-4 h-4 text-blue-500" />;
    case 'mp3': case 'wav': return <Music className="w-4 h-4 text-pink-400" />;
    case 'zip': case 'rar': return <Archive className="w-4 h-4 text-cyan-400" />;
    default: return <FileText className="w-4 h-4 text-gray-400" />;
  }
};

const AnalyzedDataModal: React.FC<AnalyzedDataModalProps> = ({ isOpen, onClose, websites, documents, onDeleteWebsite, onDeleteDocument }) => {
  const [activeTab, setActiveTab] = useState('websites');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-700/50 rounded-2xl p-6 max-w-2xl w-full h-[80vh] flex flex-col shadow-2xl animate-scale-up">
        <div className="flex justify-between items-center mb-4 flex-shrink-0">
          <h3 className="text-2xl font-semibold text-red-500">Analyzed Data</h3>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-all duration-200">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="border-b border-gray-700/50 mb-4 flex-shrink-0">
          <nav className="flex space-x-4">
            <button onClick={() => setActiveTab('websites')} className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${activeTab === 'websites' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}>
              Websites ({websites.length})
            </button>
            <button onClick={() => setActiveTab('documents')} className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${activeTab === 'documents' ? 'text-red-500 border-b-2 border-red-500' : 'text-gray-400 hover:text-white'}`}>
              Documents ({documents.length})
            </button>
          </nav>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600/50 scrollbar-track-gray-800 pr-2">
          {activeTab === 'websites' && (
            <div className="space-y-2">
              {websites.length > 0 ? websites.map(website => (
                <div key={website.id} className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 hover:bg-gray-900/80 transition-all duration-300 group">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center"><CheckCircle className="w-4 h-4 text-green-400" /></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-medium text-white truncate">{website.title}</h4>
                          <a href={website.url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200"><ExternalLink className="w-3 h-3" /></a>
                        </div>
                        <p className="text-xs text-gray-400 truncate">{website.domain}</p>
                      </div>
                    </div>
                    <button onClick={() => onDeleteWebsite(website.id)} className="flex-shrink-0 p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              )) : <p className="text-center text-gray-500 py-8">No websites analyzed yet.</p>}
            </div>
          )}
          {activeTab === 'documents' && (
            <div className="space-y-2">
              {documents.length > 0 ? documents.map(doc => (
                <div key={doc.id} className="bg-gray-900/60 backdrop-blur-sm border border-gray-700/50 rounded-lg p-3 hover:bg-gray-900/80 transition-all duration-300 group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-8 h-8 bg-gray-500/20 rounded-lg flex items-center justify-center">{getFileIcon(doc.name)}</div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-white truncate">{doc.name}</h4>
                        <p className="text-xs text-gray-400">{(doc.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button onClick={() => onDeleteDocument(doc.id)} className="flex-shrink-0 p-1 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              )) : <p className="text-center text-gray-500 py-8">No documents analyzed yet.</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


export default AnalyzedDataModal;