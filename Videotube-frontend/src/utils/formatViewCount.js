// ============= VIEW COUNT FORMATTING UTILITY =============
// View count ko user-friendly format mein convert karne ke liye

/**
 * Format view count to readable format (e.g., "1.2K", "1.5M")
 * @param {number} count - View count number
 * @returns {string} - Formatted view count string
 */
export const formatViewCount = (count) => {
    // ============= VALIDATION =============
    if (!count || count === 0) return '0';
    
    // ============= CONVERT TO NUMBER =============
    const num = typeof count === 'string' ? parseInt(count) : count;
    
    // ============= CHECK IF VALID NUMBER =============
    if (isNaN(num) || num < 0) return '0';
    
    // ============= FORMAT LOGIC =============
    if (num < 1000) {
        // Less than 1K - show as is
        return num.toString();
    } else if (num < 1000000) {
        // 1K to 999K - show as K
        const k = (num / 1000).toFixed(1);
        return k.endsWith('.0') ? `${Math.floor(num / 1000)}K` : `${k}K`;
    } else if (num < 1000000000) {
        // 1M to 999M - show as M
        const m = (num / 1000000).toFixed(1);
        return m.endsWith('.0') ? `${Math.floor(num / 1000000)}M` : `${m}M`;
    } else {
        // 1B+ - show as B
        const b = (num / 1000000000).toFixed(1);
        return b.endsWith('.0') ? `${Math.floor(num / 1000000000)}B` : `${b}B`;
    }
};

/**
 * Format like count to readable format
 * @param {number} count - Like count number
 * @returns {string} - Formatted like count string
 */
export const formatLikeCount = (count) => {
    return formatViewCount(count);
};

/**
 * Format subscriber count to readable format
 * @param {number} count - Subscriber count number
 * @returns {string} - Formatted subscriber count string
 */
export const formatSubscriberCount = (count) => {
    return formatViewCount(count);
};

/**
 * Format comment count to readable format
 * @param {number} count - Comment count number
 * @returns {string} - Formatted comment count string
 */
export const formatCommentCount = (count) => {
    return formatViewCount(count);
};

/**
 * Format any number to readable format with custom suffixes
 * @param {number} count - Number to format
 * @param {Object} options - Formatting options
 * @returns {string} - Formatted number string
 */
export const formatNumber = (count, options = {}) => {
    const {
        suffixes = ['', 'K', 'M', 'B', 'T'],
        decimals = 1,
        threshold = 1000
    } = options;
    
    // ============= VALIDATION =============
    if (!count || count === 0) return '0';
    
    const num = typeof count === 'string' ? parseInt(count) : count;
    
    if (isNaN(num) || num < 0) return '0';
    
    // ============= FORMAT LOGIC =============
    let index = 0;
    let value = num;
    
    while (value >= threshold && index < suffixes.length - 1) {
        value /= threshold;
        index++;
    }
    
    // ============= ROUND AND FORMAT =============
    const rounded = decimals > 0 ? value.toFixed(decimals) : Math.floor(value);
    const formatted = rounded.endsWith('.0') ? Math.floor(value).toString() : rounded;
    
    return `${formatted}${suffixes[index]}`;
};

/**
 * Format duration in seconds to readable format (e.g., "1:23", "12:34:56")
 * @param {number} seconds - Duration in seconds
 * @returns {string} - Formatted duration string
 */
export const formatDuration = (seconds) => {
    // ============= VALIDATION =============
    if (!seconds || seconds < 0) return '0:00';
    
    const sec = Math.floor(seconds);
    const hours = Math.floor(sec / 3600);
    const minutes = Math.floor((sec % 3600) / 60);
    const remainingSeconds = sec % 60;
    
    // ============= FORMAT BASED ON DURATION =============
    if (hours > 0) {
        return `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    } else {
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }
};

/**
 * Format file size in bytes to readable format (e.g., "1.2 MB", "500 KB")
 * @param {number} bytes - File size in bytes
 * @returns {string} - Formatted file size string
 */
export const formatFileSize = (bytes) => {
    // ============= VALIDATION =============
    if (!bytes || bytes === 0) return '0 B';
    
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
};

export default formatViewCount;
