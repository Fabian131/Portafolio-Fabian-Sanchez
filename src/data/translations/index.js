import es from './es';
import en from './en';

const langs = [es, en];

export const LANGS = Object.fromEntries(langs.map((l) => [l.code, l]));
export const AVAILABLE = langs.map(({ code, native }) => ({ code, native }));
export const DICTS = Object.fromEntries(langs.map((l) => [l.code, l.dict]));
export const DEFAULT_LANG = 'es';
export const FALLBACK_LANG = 'es';
