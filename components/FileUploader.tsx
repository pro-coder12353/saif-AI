
import React, { useRef } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  previewUrl: string | null;
  onClear: () => void;
  label: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileSelect, previewUrl, onClear, label }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {previewUrl ? (
        <div className="relative group rounded-xl overflow-hidden border border-slate-600 bg-slate-800 shadow-2xl">
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="w-full h-64 object-contain bg-black/50" 
          />
          <button 
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="absolute top-2 right-2 p-2 bg-red-600/90 text-white rounded-full hover:bg-red-500 transition-colors shadow-lg backdrop-blur-sm"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-0 inset-x-0 p-2 bg-black/60 text-center backdrop-blur-md">
             <p className="text-xs text-slate-300 font-mono">EVIDENCE_LOADED.JPG</p>
          </div>
        </div>
      ) : (
        <div 
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-600 hover:border-blue-500 bg-slate-800/50 hover:bg-slate-800 rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group"
        >
          <div className="w-16 h-16 rounded-full bg-slate-700/50 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
            <Upload className="w-8 h-8 text-slate-400 group-hover:text-blue-400" />
          </div>
          <p className="text-slate-300 font-medium group-hover:text-blue-300 transition-colors">{label}</p>
          <p className="text-xs text-slate-500 mt-2">JPG, PNG supported</p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
