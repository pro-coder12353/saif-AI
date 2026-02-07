
import React from 'react';
import { Language } from '../types';
import { LANGUAGES } from '../constants';

interface LanguageSelectorProps {
  current: Language;
  onSelect: (lang: Language) => void;
  label: string;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ current, onSelect, label }) => {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {LANGUAGES.map((lang) => (
          <button
            key={lang}
            onClick={() => onSelect(lang)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              current === lang
                ? 'bg-red-600 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-red-300'
            }`}
          >
            {lang === 'Arabic' ? 'العربية' : lang}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;
