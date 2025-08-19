import { CheckCircle, XCircle } from "lucide-react";

interface AnalysisProgressModalProps {
  isOpen: boolean;
  title: string;
  subtitle: string;
  steps: string[];
  currentStep: number;
}


const AnalysisProgressModal: React.FC<AnalysisProgressModalProps> = ({ isOpen, title, subtitle, steps, currentStep }) => {
  if (!isOpen) return null;
  const totalSteps = steps.length;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      {currentStep === -1 ? (
        <div className="bg-gradient-to-br from-gray-900 to-black border border-red-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scale-up text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-red-400 mb-2">Process Failed</h3>
          <p className="text-gray-400 text-sm mb-6 break-words">
            {subtitle || "An unexpected error occurred. Please try again."}
          </p>
        </div>
      ) : (
        <div className="bg-gradient-to-br from-gray-900 via-gray-900 to-black border border-gray-700/50 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-scale-up">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold text-red-500 mb-2">{title}</h3>
            <p className="text-gray-400 text-sm break-all">{subtitle}</p>
          </div>
          <div className="space-y-4">
            <div className="relative">
              <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-red-400 transition-all duration-500 rounded-full" 
                  style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-400 text-right mt-1.5">{currentStep + 1}/{totalSteps}</div>
            </div>
            <div className="space-y-3">
              {steps.map((text, index) => (
                <div key={index} className={`flex items-center space-x-3 transition-all duration-300 ${index <= currentStep ? 'opacity-100' : 'opacity-40'}`}>
                  <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-300 ${
                    index < currentStep ? 'bg-red-500' : index === currentStep ? 'bg-red-500 animate-pulse' : 'bg-gray-600'
                  }`}>
                    {index < currentStep && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <span className={`text-sm ${index <= currentStep ? 'text-white' : 'text-gray-500'}`}>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisProgressModal;