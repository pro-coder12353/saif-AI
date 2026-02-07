
import { Language, TranslationSet } from "../types";

const LINGO_API_KEY = "api_nhylbwi8dend1l05hznzoxof";

const LANG_CODE_MAP: Record<Language, string> = {
    'English': 'en',
    'Arabic': 'ar',
    'Hindi': 'hi',
    'Urdu': 'ur',
    'Tagalog': 'tl'
};

export const fetchDynamicTranslations = async (
    baseTranslations: TranslationSet,
    targetLanguage: Language
): Promise<TranslationSet | null> => {
    // English is the source, no need to translate
    if (targetLanguage === 'English') return baseTranslations;

    try {
        const targetCode = LANG_CODE_MAP[targetLanguage];
        const keys = Object.keys(baseTranslations) as Array<keyof TranslationSet>;
        const values = keys.map(k => baseTranslations[k]);

        // Making a request to the Lingo.dev translation endpoint
        // Using a standard batch payload structure
        const response = await fetch('https://api.lingo.dev/v1/translate', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${LINGO_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                source: 'en',
                target: targetCode,
                texts: values
            })
        });

        if (!response.ok) {
            console.warn(`Lingo API Error: ${response.status} ${response.statusText}`);
            return null;
        }

        const data = await response.json();
        
        // Handle potential response variations safely
        const translatedValues: string[] = data.translations || data.texts || data.data;

        if (Array.isArray(translatedValues) && translatedValues.length === values.length) {
            const newSet = { ...baseTranslations };
            keys.forEach((key, i) => {
                newSet[key] = translatedValues[i];
            });
            return newSet;
        }
        
        return null;
    } catch (error) {
        console.error("Dynamic translation service failed:", error);
        return null;
    }
};
