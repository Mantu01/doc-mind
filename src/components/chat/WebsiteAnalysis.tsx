import { Globe, Search } from "lucide-react";
import { Section } from "./SideBar";

interface WebsiteAnalysisProps {
  url: string;
  setUrl: (url: string) => void;
  onAnalyze: () => void;
  onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  isAnalyzing: boolean;
}

const WebsiteAnalysis: React.FC<WebsiteAnalysisProps> = ({ url, setUrl, onAnalyze, onKeyPress, isAnalyzing }) => (
  <Section title="Website Analysis">
    <label className="block text-sm font-medium text-gray-300 mb-2">Add Website URL</label>
    <div className="flex space-x-2">
      <div className="relative flex-1 group">
        <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-red-400 transition-colors" />
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={onKeyPress}
          placeholder="https://example.com"
          className="w-full bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 hover:bg-gray-900/70"
        />
      </div>
      <button
        onClick={onAnalyze}
        disabled={!url.trim() || isAnalyzing}
        className={`w-12 h-12 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg transform hover:scale-[1.02] active:scale-[0.98] ${url.trim() && !isAnalyzing ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white hover:shadow-red-500/25' : 'bg-gray-700/50 text-gray-400 cursor-not-allowed'}`}
      >
        <Search className={`w-5 h-5 ${isAnalyzing ? 'animate-spin' : ''}`} />
      </button>
    </div>
  </Section>
);


export default WebsiteAnalysis;