/**
 * Helper to resolve image URLs for both local and Docker environments
 * 
 * Problem: 
 * - Database stores: http://localhost:5000/uploads/file.jpg
 * - Local machine: localhost:5000 works ✅
 * - Docker container: localhost:5000 doesn't work (points to container itself) ❌
 * 
 * Solution:
 * - If URL is external (Google, etc): use as-is
 * - If URL is localhost: use it directly (browser already on localhost)
 * - If URL is relative path: construct full URL with localhost:5000
 */

export function resolveImageUrl(url: string | null | undefined): string | null {
    if (!url) return null;
    
    // If it's an external URL (Google OAuth, HTTPS, etc.), use as-is
    if (url.startsWith('https://') || url.startsWith('//')) {
        return url;
    }
    
    // If we're in the browser (client-side)
    if (typeof window !== 'undefined') {
        // If URL already has localhost or 127.0.0.1 with port, use it directly
        if (url.startsWith('http://localhost:5000') || url.startsWith('http://127.0.0.1:5000')) {
            return url;
        }
        
        // If URL has localhost but different port or without port, reconstruct
        if (url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')) {
            try {
                const urlObj = new URL(url);
                const path = urlObj.pathname;
                return `http://localhost:5000${path}`;
            } catch {
                return url; // If URL parsing fails, return as-is
            }
        }
        
        // If URL is relative or starts with /uploads
        if (url.startsWith('/uploads')) {
            return `http://localhost:5000${url}`;
        }
    }
    
    // Server-side rendering: return the URL as-is (will be corrected client-side)
    return url;
}
