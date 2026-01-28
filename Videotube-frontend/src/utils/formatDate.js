
export const formatDate = (date) => {
    // ============= VALIDATION =============
    if (!date) return 'Unknown date';
    
    // ============= CONVERT TO DATE OBJECT =============
    const dateObj = new Date(date);
    
    // ============= CHECK IF VALID DATE =============
    if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
    }
    
    // ============= CURRENT TIME =============
    const now = new Date();
    const diffInSeconds = Math.floor((now - dateObj) / 1000);
    
    // ============= TIME CALCULATIONS =============
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);
    
    // ============= RETURN RELATIVE TIME =============
    if (diffInSeconds < 60) {
        return diffInSeconds <= 1 ? 'Just now' : `${diffInSeconds} seconds ago`;
    } else if (diffInMinutes < 60) {
        return diffInMinutes === 1 ? '1 minute ago' : `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
        return diffInHours === 1 ? '1 hour ago' : `${diffInHours} hours ago`;
    } else if (diffInDays < 7) {
        return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    } else if (diffInWeeks < 4) {
        return diffInWeeks === 1 ? '1 week ago' : `${diffInWeeks} weeks ago`;
    } else if (diffInMonths < 12) {
        return diffInMonths === 1 ? '1 month ago' : `${diffInMonths} months ago`;
    } else {
        return diffInYears === 1 ? '1 year ago' : `${diffInYears} years ago`;
    }
};

/**
 * Format date to specific format (e.g., "Jan 15, 2024")
 * @param {string|Date} date - Date string or Date object
 * @param {string} format - Format type ('short', 'long', 'time')
 * @returns {string} - Formatted date string
 */
export const formatDateSpecific = (date, format = 'short') => {
    // ============= VALIDATION =============
    if (!date) return 'Unknown date';
    
    // ============= CONVERT TO DATE OBJECT =============
    const dateObj = new Date(date);
    
    // ============= CHECK IF VALID DATE =============
    if (isNaN(dateObj.getTime())) {
        return 'Invalid date';
    }
    
    // ============= FORMAT OPTIONS =============
    const options = {
        short: { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        },
        long: { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        },
        time: { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        },
        datetime: { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
        }
    };
    
    // ============= RETURN FORMATTED DATE =============
    return dateObj.toLocaleDateString('en-US', options[format] || options.short);
};

/**
 * Check if date is today
 * @param {string|Date} date - Date string or Date object
 * @returns {boolean} - True if date is today
 */
export const isToday = (date) => {
    if (!date) return false;
    
    const dateObj = new Date(date);
    const today = new Date();
    
    return dateObj.toDateString() === today.toDateString();
};

/**
 * Check if date is yesterday
 * @param {string|Date} date - Date string or Date object
 * @returns {boolean} - True if date is yesterday
 */
export const isYesterday = (date) => {
    if (!date) return false;
    
    const dateObj = new Date(date);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    return dateObj.toDateString() === yesterday.toDateString();
};

export default formatDate;
