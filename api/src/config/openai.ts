import OpenAI from 'openai';
import { env } from './env';

let _openai: OpenAI | null = null;

export const getOpenAI = (): OpenAI => {
    if (!_openai) {
        if (!env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY is not configured');
        }
        _openai = new OpenAI({ apiKey: env.OPENAI_API_KEY });
    }
    return _openai;
};

// Keep backward-compat default export for existing imports
// Will throw at call-time (not import-time) if key is missing
export const openai = new Proxy({} as OpenAI, {
    get(_target, prop) {
        return (getOpenAI() as any)[prop];
    },
});
