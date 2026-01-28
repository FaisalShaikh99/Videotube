import { toast } from "react-toastify";
// ============= CHAINABLE VALIDATOR UTILITY =============
// Yeh ek chhota helper hai jo validation rules ko chain karne mein madad karta hai.
// Isse baar-baar 'if' conditions likhne ki zaroorat nahi padti.


class Validator {
    constructor(value) {
        this.value = value;
        this.error = '';
    }

    // Check karta hai ki value khali na ho
    isRequired(message) {
        if (!this.error && (!this.value || String(this.value).trim() === '')) {
            this.error = message;
            toast.error(this.error = message);
        }
        return this;
    }

    // Minimum length check karta hai
    minLength(len, message) {
        if (!this.error && String(this.value).length < len) {
            this.error = message;
            toast.error(this.error = message);

        }
        return this;
    }

    // Maximum length check karta hai
    maxLength(len, message) {
        if (!this.error && String(this.value).length > len) {
            this.error = message;
            toast.error(this.error = message);

        }
        return this;
    }

    // Regular Expression se match karta hai
    matchesRegex(regex, message) {
        if (!this.error && !regex.test(this.value)) {
            this.error = message;
            toast.error(this.error = message);

        }
        return this;
    }

    // Do values ko compare karta hai (jaise password confirmation)
    isSameAs(otherValue, message) {
        if (!this.error && this.value !== otherValue) {
            this.error = message;
            toast.error(this.error = message);

        }
        return this;
    }
    
    // Final result return karta hai
    validate() {
        return {
            isValid: this.error === '',
            message: this.error,
        };
    }
}

// ============= VALIDATION FUNCTIONS (Improved) =============

export const validateEmail = (email) => {
    return new Validator(email)
        .isRequired('Email is required')
        .matchesRegex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please enter a valid email address')
        .validate();
};

export const validatePassword = (password) => {
    return new Validator(password)
        .isRequired('Password is required')
        .minLength(6, 'Password must be at least 6 characters long')
        .validate();
};

export const validateUsername = (username) => {
    return new Validator(username)
        .isRequired('Username is required')
        .minLength(3, 'Username must be at least 3 characters long')
        .maxLength(20, 'Username must be less than 20 characters')
        .matchesRegex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores')
        .validate();
};



export const validateVideoTitle = (title) => {
    return new Validator(title)
        .isRequired('Video title is required')
        .minLength(3, 'Video title must be at least 3 characters long')
        .maxLength(100, 'Video title must be less than 100 characters')
        .validate();
};

export const validateVideoDescription = (description) => {
    return new Validator(description)
        .isRequired('Video description is required')
        .minLength(10, 'Video description must be at least 10 characters long')
        .maxLength(5000, 'Video description must be less than 5000 characters')
        .validate();
};

export const validateComment = (text) => {
    return new Validator(text)
        .isRequired('Comment cannot be empty')
        .maxLength(1000, 'Comment must be less than 1000 characters')
        .validate();
};

export const validateTweet = (text) => {
    return new Validator(text)
        .isRequired('Tweet cannot be empty')
        .maxLength(280, 'Tweet must be less than 280 characters')
        .validate();
};

export const validatePlaylistName = (name) => {
    return new Validator(name)
        .isRequired('Playlist name is required')
        .minLength(3, 'Playlist name must be at least 3 characters long')
        .maxLength(50, 'Playlist name must be less than 50 characters')
        .validate();
};

export const validateFileSize = (file, maxSize = 500) => {
    if (!file) {
        return { isValid: false, message: 'Please select a file' };
    }
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxSize) {
        return { isValid: false,
               message: toast.error(`File size must be less than ${maxSize}MB`) };
    }
    return { isValid: true, message: '' };
};

// BUG FIXED VERSION
export const validateFileType = (file, allowedTypes) => {
    if (!file) {
        return { isValid: false, message: 'Please select a file' };
    }
    const isTypeValid = allowedTypes.some(type => {
        if (type.endsWith('/*')) {
            const baseType = type.slice(0, -1);
            return file.type.startsWith(baseType);
        }
        return file.type === type;
    });
    if (!isTypeValid) {
        return { isValid: false, message: `File type must be one of: ${allowedTypes.join(', ')}` };
    }
    return { isValid: true, message: '' };
};