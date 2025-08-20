'use client';

import React, { useState, useEffect } from 'react';
import { Upload, X, BarChart2, FileUp, Check } from 'lucide-react';
import Link from 'next/link';
import { FILE_TYPES } from '@/constants/fileVariety';
import { getWebsiteInfo, WebsiteInfo } from '@/helpers/getWebsiteInfo';
import { UPLOAD_ANALYSIS_STEPS, WEBSITE_ANALYSIS_STEPS } from '@/constants/processStep';
import AnalyzedDataModal from './AnalyzedDataModal';
import WebsiteAnalysis from './WebsiteAnalysis';
import AnalysisProgressModal from './AnalysisProgressModal';
import axios from 'axios';

export interface DocumentInfo {
  id: number;
  name: string;
  size: number;
  type: string;
}

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export const Section: React.FC<SectionProps> = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold mb-4 text-red-500 flex items-center">
      <div className="w-2 h-2 bg-red-500 rounded-full mr-3 animate-pulse"></div>{title}
    </h2>
    {children}
  </div>
);

const Sidebar: React.FC = () => {
  const [websiteUrl, setWebsiteUrl] = useState<string>('');
  const [isAnalyzingWebsite, setIsAnalyzingWebsite] = useState<boolean>(false);
  const [showWebsiteAnalysisPopup, setShowWebsiteAnalysisPopup] = useState<boolean>(false);
  const [websiteAnalysisStep, setWebsiteAnalysisStep] = useState<number>(0);

  // Document upload state
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showUploadAnalysisPopup, setShowUploadAnalysisPopup] = useState<boolean>(false);
  const [uploadAnalysisStep, setUploadAnalysisStep] = useState<number>(0);
  const [uploadingFileName, setUploadingFileName] = useState<string>('');

  // General state
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  const [isPromptSaved, setIsPromptSaved] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [showDataPopup, setShowDataPopup] = useState<boolean>(false);
  const [analyzedWebsites, setAnalyzedWebsites] = useState<WebsiteInfo[]>([]);
  const [analyzedDocuments, setAnalyzedDocuments] = useState<DocumentInfo[]>([]);

  // Load system prompt from localStorage on initial render
  useEffect(() => {
    const savedPrompt = localStorage.getItem('system-prompt');
    if (savedPrompt) {
      setSystemPrompt(savedPrompt);
    }
  }, []);

  const handleSaveSystemPrompt = () => {
    localStorage.setItem('system-prompt', systemPrompt);  
    setIsPromptSaved(true);
    setTimeout(() => {
      setIsPromptSaved(false);
    }, 2000); // Reset the 'Saved!' message after 2 seconds
  };

  const handleAnalyzeWebsite = async() => {
    if (!websiteUrl.trim() || analyzedWebsites.some(site => site.url === websiteUrl)) {
      if (analyzedWebsites.some(site => site.url === websiteUrl)) {
        alert('This website has already been analyzed!');
      }
      return;
    }

    setIsAnalyzingWebsite(true);
    setShowWebsiteAnalysisPopup(true);
    setWebsiteAnalysisStep(0);
    try {
      const activeApiKey = getActiveApiKey();
      if (!activeApiKey) {
        alert('No API key found! Please set an API key in the settings.');
        setIsAnalyzingWebsite(false);
        return;
      }
      for (let i = 0; i < 2; i++) {
        setWebsiteAnalysisStep(i);
        await new Promise(resolve => setTimeout(resolve, 400));
      }
      await axios.post('/api/scrape', {
        url: websiteUrl,
        apiKey: activeApiKey.apiKey,
      });
      const websiteInfo = getWebsiteInfo(websiteUrl);
      setAnalyzedWebsites(prev => [{ id: Date.now(), url: websiteUrl, ...websiteInfo }, ...prev]);
      for (let i = 2; i < WEBSITE_ANALYSIS_STEPS.length; i++) {
        setWebsiteAnalysisStep(i);
        await new Promise(resolve => setTimeout(resolve, 600));
      }
      setWebsiteUrl('');
    } catch (error) {
      console.error('Error analyzing website:', error);
      setWebsiteAnalysisStep(-1);
    }finally {
      setTimeout(() => {
        setIsAnalyzingWebsite(false);
        setShowWebsiteAnalysisPopup(false);
      }, 1500);
    }
  };

  function getActiveApiKey() {
    const keys = ['openai'];

    for (const k of keys) {
      const value = localStorage.getItem(k);
      if (value) {
        return { provider: k.replace("_KEY", "").toLowerCase(), apiKey: value };
      }
    }
    return null;
  }

  const handleFileSelection = (files: File[]) => {
    if (isUploading) return;

    const fileDisplay = files.length > 1 ? `${files.length} files` : files[0].name;
    setUploadingFileName(fileDisplay);
    setIsUploading(true);
    setShowUploadAnalysisPopup(true);
    setUploadAnalysisStep(0);

    const runUploadAnalysis = async () => {
      const activeApiKey = getActiveApiKey();
      try {
        const formData = new FormData();

        if(activeApiKey){
          formData.append('apiKey',activeApiKey.apiKey);
        }

        files.forEach(file => {
          formData.append('file', file);
        });
        for (let i = 0; i < 2; i++) {
          setUploadAnalysisStep(i);
          await new Promise(resolve => setTimeout(resolve, 400));
        }
        const response = await fetch('/api/ingest', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'File upload failed!');
        }
        for (let i = 2; i < UPLOAD_ANALYSIS_STEPS.length; i++) {
          setUploadAnalysisStep(i);
          await new Promise(resolve => setTimeout(resolve, 600));
        }
        const newDocuments: DocumentInfo[] = files.map(file => ({
          id: Date.now() + Math.random(),
          name: file.name,
          size: file.size,
          type: file.type,
        }));
        setAnalyzedDocuments(prev => [...newDocuments, ...prev]);

      } catch (error) {
        console.log(error)
        setUploadAnalysisStep(-1);
      } finally {
        setTimeout(() => {
          setIsUploading(false);
          setShowUploadAnalysisPopup(false);
        }, 1500);
      }
    };

    runUploadAnalysis();
  };

  const handleDeleteWebsite = (id: number) => {
    setAnalyzedWebsites(prev => prev.filter(site => site.id !== id));
  };

  const handleDeleteDocument = (id: number) => {
    setAnalyzedDocuments(prev => prev.filter(doc => doc.id !== id));
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAnalyzeWebsite();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (files.length > 0) {
      handleFileSelection(files);
      setShowUploadModal(false);
    }
  };

  useEffect(() => {
    const isModalOpen = showUploadModal || showWebsiteAnalysisPopup || showDataPopup || showUploadAnalysisPopup;
    document.body.style.overflow = isModalOpen ? 'hidden' : 'auto';
    return () => { document.body.style.overflow = 'auto' };
  }, [showUploadModal, showWebsiteAnalysisPopup, showDataPopup, showUploadAnalysisPopup]);

  return (
    <>
      <div className="w-full lg:w-1/3 h-screen-mock lg:h-screen border-b lg:border-b-0 lg:border-r border-gray-800 bg-black flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
          <div className="mb-8 relative">
            <div className="absolute -top-2 -left-2 w-20 h-20 bg-red-500/20 rounded-full blur-xl"></div>
            <div className="relative">
              <Link href='/' className="text-3xl lg:text-4xl font-bold mb-2 tracking-tight">
                <span className="text-red-500 drop-shadow-lg">Doc</span><span className="text-white">Mind</span>
              </Link>
              <p className="text-gray-400 text-sm font-medium tracking-wide">AI-Powered Document Intelligence</p>
              <div className="w-12 h-0.5 bg-gradient-to-r from-red-500 to-transparent mt-2 rounded-full"></div>
            </div>
          </div>
          <Section title="System Configuration">
            <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-300">System Prompt & AI Behavior</label>
                <button
                    onClick={handleSaveSystemPrompt}
                    disabled={isPromptSaved}
                    className={`text-sm font-semibold py-1 px-3 cursor-pointer rounded-md transition-all duration-200 flex items-center justify-center ${
                    isPromptSaved
                        ? 'bg-green-500/20 text-green-400 cursor-default'
                        : 'bg-red-700 text-white'
                    }`}
                >
                    {isPromptSaved ? (
                        <>
                            <Check className="w-4 h-4 mr-1.5" />
                            Saved!
                        </>
                    ) : (
                        'Save'
                    )}
                </button>
            </div>
            <div className="relative group">
              <textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Define how the AI should behave, analyze documents, and respond to queries..."
                className="w-full h-32 bg-gray-900/50 backdrop-blur-sm border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 resize-none hover:bg-gray-900/70 shadow-inner"
              />
            </div>
          </Section>
          <WebsiteAnalysis
            url={websiteUrl}
            setUrl={setWebsiteUrl}
            onAnalyze={handleAnalyzeWebsite}
            onKeyPress={handleKeyPress}
            isAnalyzing={isAnalyzingWebsite}
          />
        </div>
        <div className="p-4 lg:p-6 mt-auto border-t border-gray-800/50 bg-black/50 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowDataPopup(true)}
              className="w-1/3 bg-gray-800/50 hover:bg-gray-700/60 text-gray-300 hover:text-white py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <BarChart2 className="w-5 h-5" />
              <span className="font-medium text-sm hidden sm:inline">Data</span>
            </button>
            <button
              onClick={() => setShowUploadModal(true)}
              disabled={isUploading}
              className="w-2/3 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center space-x-3 shadow-lg hover:shadow-red-500/25 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? <FileUp className="w-5 h-5 animate-pulse" /> : <Upload className="w-5 h-5" />}
              <span className="font-medium">{isUploading ? 'Processing...' : 'Upload Documents'}</span>
            </button>
          </div>
        </div>
      </div>
      
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-gray-700/50 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up scrollbar-thin scrollbar-thumb-red-500/30 scrollbar-track-gray-800">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-2xl font-semibold text-red-500 mb-1">Upload Documents</h3>
                <p className="text-gray-400 text-sm">Select the type of documents you want to upload</p>
              </div>
              <button onClick={() => setShowUploadModal(false)} className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-full transition-all duration-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {FILE_TYPES.map((fileType, index) => (
                <label key={index} className="relative group cursor-pointer">
                  <input disabled={!fileType.isAvailable} type="file" accept={fileType.accept} className="hidden" multiple onChange={handleFileChange} />
                  <div className={`flex flex-col items-center justify-center p-4 border ${fileType.isAvailable?'hover:border-red-500/50 group-hover:scale-105 transform hover:bg-red-500/5 bg-gray-800/30':'bg-black/20'} border-gray-700/50 rounded-xl transition-all duration-300 min-h-[100px]`}>
                    <fileType.icon className={`w-8 h-8 ${fileType.color} group-hover:scale-110 transition-transform duration-200 mb-2`} />
                    <span className="text-xs text-center text-gray-300 group-hover:text-white transition-colors font-medium">{fileType.label}</span>
                  </div>
                  {!fileType.isAvailable && (
                    <div className=" inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
                      <span className="text-red-500 text-xs font-semibold">Not available</span>
                    </div>
                    )}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}
      
      <AnalysisProgressModal
        isOpen={showWebsiteAnalysisPopup}
        title="Analyzing Website"
        subtitle={websiteUrl}
        steps={WEBSITE_ANALYSIS_STEPS}
        currentStep={websiteAnalysisStep}
      />
      
      <AnalysisProgressModal
        isOpen={showUploadAnalysisPopup}
        title="Processing Document"
        subtitle={uploadingFileName}
        steps={UPLOAD_ANALYSIS_STEPS}
        currentStep={uploadAnalysisStep}
      />

      <AnalyzedDataModal
        isOpen={showDataPopup}
        onClose={() => setShowDataPopup(false)}
        websites={analyzedWebsites}
        documents={analyzedDocuments}
        onDeleteWebsite={handleDeleteWebsite}
        onDeleteDocument={handleDeleteDocument}
      />
    </>
  );
};

export default Sidebar;