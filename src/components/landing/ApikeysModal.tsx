"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, X, Info, ChevronDown, Edit3, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ApiKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type KeyOption = 'openai' | 'claude' | 'gemini' ;

const keyOptions: Array<{ value: KeyOption; label: string; description: string }> = [
  { value: 'openai', label: 'OpenAI API Key', description: 'GPT models and completions' },
];

export default function ApiKeysModal({ isOpen, onClose }: ApiKeysModalProps) {
  const [selectedKey, setSelectedKey] = useState<KeyOption | null>(null);
  const [keyValue, setKeyValue] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [existingKey, setExistingKey] = useState<string>("");
  const [hasExistingKey, setHasExistingKey] = useState<boolean>(false);

  const router=useRouter();

  const loadExistingKeys = (): void => {
    let foundKey = false;
    let foundProvider: KeyOption | null = null;
    let foundValue = "";

    for (const option of keyOptions) {
      const storedValue = localStorage.getItem(option.value);
      if (storedValue && storedValue.trim()) {
        foundKey = true;
        foundProvider = option.value;
        foundValue = storedValue;
        break;
      }
    }

    if (foundKey && foundProvider) {
      setSelectedKey(foundProvider);
      setExistingKey(foundValue);
      setKeyValue(foundValue);
      setHasExistingKey(true);
      setIsEditing(false);
    } else {
      setHasExistingKey(false);
      setIsEditing(true);
      setSelectedKey(null);
      setExistingKey("");
      setKeyValue("");
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadExistingKeys();
    }
  }, [isOpen]);

  const handleKeySelection = (keyOption: KeyOption): void => {
    setSelectedKey(keyOption);
    setIsDropdownOpen(false);
  };

  const saveKey = (): void => {
    if (selectedKey && keyValue.trim()) {
      if (hasExistingKey) {
        keyOptions.forEach(option => {
          localStorage.removeItem(option.value);
        });
      }
      localStorage.setItem(selectedKey, keyValue.trim());
      router.push('/chat');
      setExistingKey(keyValue.trim());
      setHasExistingKey(true);
      setIsEditing(false);
      onClose();
    }
  };

  const startEditing = (): void => {
    setIsEditing(true);
    setKeyValue(existingKey);
  };

  const cancelEditing = (): void => {
    setIsEditing(false);
    setKeyValue(existingKey);
    setSelectedKey(keyOptions.find(opt => localStorage.getItem(opt.value) === existingKey)?.value || null);
  };

  const handleClose = (): void => {
    if (isEditing && hasExistingKey) {
      cancelEditing();
    }
    onClose();
  };

  const togglePasswordVisibility = (): void => {
    setShowPassword(prev => !prev);
  };

  const maskKey = (key: string): string => {
    if (key.length <= 8) return key;
    return key.substring(0, 4) + '•'.repeat(key.length - 8) + key.substring(key.length - 4);
  };

  if (!isOpen) return null;

  const selectedOption = keyOptions.find(opt => opt.value === selectedKey);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-black border border-gray-800 rounded-2xl p-8 w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">API Configuration</h2>
            <p className="text-gray-400 text-sm">
              {hasExistingKey && !isEditing ? 'Manage your AI service' : 'Connect your AI service'}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-all duration-200 p-2 hover:bg-gray-800/50 rounded-lg"
          >
            <X size={20} />
          </button>
        </div>

        {hasExistingKey && !isEditing ? (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-900/20 to-gray-900/20 border border-green-800/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Check size={20} className="text-green-400" />
                  <span className="text-green-400 font-semibold">Saved</span>
                </div>
                <button
                  onClick={startEditing}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors px-3 py-1 hover:bg-gray-800/50 rounded-lg"
                >
                  <Edit3 size={16} />
                  <span className="text-sm">Change</span>
                </button>
              </div>
              
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-400">Provider:</span>
                  <div className="text-white font-medium mt-1">{selectedOption?.label}</div>
                  <div className="text-sm text-gray-400">{selectedOption?.description}</div>
                </div>
                
                <div>
                  <span className="text-sm text-gray-400">API Key:</span>
                  <div className="text-white font-mono mt-1 bg-gray-900/50 px-3 py-2 rounded-lg border border-gray-700 overflow-hidden">
                    {showPassword ? existingKey : maskKey(existingKey)}
                  </div>
                  <button
                    onClick={togglePasswordVisibility}
                    className="text-xs text-gray-400 hover:text-white transition-colors mt-2"
                  >
                    {showPassword ? 'Hide' : 'Show'} full key
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="relative">
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                Select Provider
              </label>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-4 bg-gray-900 border border-gray-700 rounded-xl text-white focus:outline-none focus:border-red-500 hover:border-gray-600 transition-all duration-200 flex items-center justify-between"
              >
                <div className="text-left">
                  {selectedOption ? (
                    <div>
                      <div className="font-medium">{selectedOption.label}</div>
                      <div className="text-sm text-gray-400 mt-0.5">{selectedOption.description}</div>
                    </div>
                  ) : (
                    <span className="text-gray-400">Choose your AI provider</span>
                  )}
                </div>
                <ChevronDown 
                  size={20} 
                  className={`text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} 
                />
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-gray-900 border border-gray-700 rounded-xl shadow-xl z-10 overflow-hidden">
                  {keyOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleKeySelection(option.value)}
                      className="w-full p-4 text-left hover:bg-gray-800 transition-colors border-b border-gray-700 last:border-b-0"
                    >
                      <div className="font-medium text-white">{option.label}</div>
                      <div className="text-sm text-gray-400 mt-0.5">{option.description}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">
                API Key
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={keyValue}
                  onChange={(e) => setKeyValue(e.target.value)}
                  disabled={!selectedKey}
                  className="w-full px-4 py-4 pr-12 bg-gray-900 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500 hover:border-gray-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder={selectedKey ? "Enter your API key" : "Select a provider first"}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  disabled={!selectedKey}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="bg-gradient-to-r from-red-900/20 to-gray-900/20 border border-red-800/30 rounded-xl p-4 flex items-start gap-3">
              <Info size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
              <div className="text-red-200 text-sm">
                <div className="font-medium mb-1">Secure Local Storage</div>
                <div className="text-red-300/80">Your API key is stored locally in your browser and never transmitted to our servers.</div>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-4 mt-8">
          {hasExistingKey && !isEditing ? (
            <button
              onClick={handleClose}
              className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-xl transition-all duration-200 font-semibold shadow-lg shadow-red-500/20"
            >
              Done
            </button>
          ) : (
            <>
              {hasExistingKey && isEditing ? (
                <button
                  onClick={cancelEditing}
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white rounded-xl transition-all duration-200 font-semibold border border-gray-600"
                >
                  Cancel
                </button>
              ) : (
                <Link
                  href='/chat'
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-700 hover:to-gray-600 text-white rounded-xl transition-all duration-200 font-semibold border border-gray-600"
                >
                  Try Demo
                </Link>
              )}
              <button
                onClick={saveKey}
                disabled={!selectedKey || !keyValue.trim()}
                className="flex-1 px-6 py-4 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:from-red-700/50 disabled:to-red-600/50 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 font-semibold shadow-lg shadow-red-500/20"
              >
                {hasExistingKey ? 'Update Key' : 'Save & Connect'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}