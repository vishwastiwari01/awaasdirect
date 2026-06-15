import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes an input string to prevent XSS attacks.
 * Strips out all HTML tags, scripts, and attributes except for basic safe formatting if desired.
 * Currently configured to strip EVERYTHING (return pure text).
 */
export const sanitizeText = (input?: string | null): string | undefined => {
    if (!input) return undefined;
    return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
};
