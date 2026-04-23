/**
 * Script.js v7 - Compatible with Next.js 14.2.3
 * Enhanced authentication and utility functions
 * Author: Alex Fuad
 * Version: 7.0.0
 */

(function() {
    'use strict';

    // Global configuration
    const CONFIG = {
        version: '7.0.0',
        apiBaseUrl: window.location.origin,
        tokenKey: 'auth-token',
        userKey: 'user-data',
        themeKey: 'theme',
        languageKey: 'language',
        debug: process.env.NODE_ENV === 'development',
        timeout: 5000,
        retryAttempts: 3
    };

    // Utility functions
    const Utils = {
        /**
         * Debounce function to limit function calls
         * @param {Function} func - Function to debounce
         * @param {number} wait - Wait time in milliseconds
         * @returns {Function} Debounced function
         */
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        /**
         * Throttle function to limit function calls
         * @param {Function} func - Function to throttle
         * @param {number} limit - Time limit in milliseconds
         * @returns {Function} Throttled function
         */
        throttle: function(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        /**
         * Generate random ID
         * @param {number} length - ID length
         * @returns {string} Random ID
         */
        generateId: function(length = 8) {
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            for (let i = 0; i < length; i++) {
                result += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return result;
        },

        /**
         * Format date to readable string
         * @param {Date|string} date - Date to format
         * @param {string} format - Format type
         * @returns {string} Formatted date
         */
        formatDate: function(date, format = 'short') {
            const d = new Date(date);
            const options = {
                short: { year: 'numeric', month: 'short', day: 'numeric' },
                long: { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' },
                time: { hour: '2-digit', minute: '2-digit' }
            };
            return d.toLocaleDateString('en-US', options[format] || options.short);
        },

        /**
         * Copy text to clipboard
         * @param {string} text - Text to copy
         * @returns {Promise<boolean>} Success status
         */
        copyToClipboard: async function(text) {
            try {
                await navigator.clipboard.writeText(text);
                return true;
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                try {
                    document.execCommand('copy');
                    return true;
                } catch (err) {
                    return false;
                } finally {
                    document.body.removeChild(textArea);
                }
            }
        },

        /**
         * Check if element is in viewport
         * @param {Element} element - Element to check
         * @returns {boolean} Visibility status
         */
        isInViewport: function(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        /**
         * Smooth scroll to element
         * @param {Element|string} target - Target element or selector
         * @param {number} offset - Scroll offset
         */
        scrollTo: function(target, offset = 0) {
            const element = typeof target === 'string' ? document.querySelector(target) : target;
            if (element) {
                const top = element.offsetTop - offset;
                window.scrollTo({
                    top: top,
                    behavior: 'smooth'
                });
            }
        },

        /**
         * Get cookie value
         * @param {string} name - Cookie name
         * @returns {string|null} Cookie value
         */
        getCookie: function(name) {
            const value = `; ${document.cookie}`;
            const parts = value.split(`; ${name}=`);
            if (parts.length === 2) return parts.pop().split(';').shift();
            return null;
        },

        /**
         * Set cookie
         * @param {string} name - Cookie name
         * @param {string} value - Cookie value
         * @param {number} days - Expiration days
         */
        setCookie: function(name, value, days = 7) {
            const date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            const expires = `expires=${date.toUTCString()}`;
            document.cookie = `${name}=${value};${expires};path=/`;
        },

        /**
         * Delete cookie
         * @param {string} name - Cookie name
         */
        deleteCookie: function(name) {
            document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
        }
    };

    // Authentication Manager
    const Auth = {
        /**
         * Check if user is authenticated
         * @returns {boolean} Authentication status
         */
        isAuthenticated: function() {
            const token = this.getToken();
            return !!token && !this.isTokenExpired(token);
        },

        /**
         * Get authentication token
         * @returns {string|null} Token
         */
        getToken: function() {
            return Utils.getCookie(CONFIG.tokenKey) || localStorage.getItem(CONFIG.tokenKey);
        },

        /**
         * Set authentication token
         * @param {string} token - Token to set
         */
        setToken: function(token) {
            Utils.setCookie(CONFIG.tokenKey, token, 7);
            localStorage.setItem(CONFIG.tokenKey, token);
        },

        /**
         * Remove authentication token
         */
        removeToken: function() {
            Utils.deleteCookie(CONFIG.tokenKey);
            localStorage.removeItem(CONFIG.tokenKey);
            localStorage.removeItem(CONFIG.userKey);
        },

        /**
         * Check if token is expired
         * @param {string} token - Token to check
         * @returns {boolean} Expiration status
         */
        isTokenExpired: function(token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return Date.now() >= payload.exp * 1000;
            } catch (e) {
                return true;
            }
        },

        /**
         * Get user data
         * @returns {Object|null} User data
         */
        getUser: function() {
            try {
                return JSON.parse(localStorage.getItem(CONFIG.userKey) || '{}');
            } catch (e) {
                return null;
            }
        },

        /**
         * Set user data
         * @param {Object} user - User data
         */
        setUser: function(user) {
            localStorage.setItem(CONFIG.userKey, JSON.stringify(user));
        },

        /**
         * Login user
         * @param {Object} credentials - Login credentials
         * @returns {Promise<Object>} Login result
         */
        login: async function(credentials) {
            try {
                const response = await fetch(`${CONFIG.apiBaseUrl}/api/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(credentials)
                });

                const data = await response.json();

                if (data.success) {
                    this.setToken(data.token || 'mock-token');
                    this.setUser(data.data.user);
                    return { success: true, user: data.data.user };
                } else {
                    return { success: false, message: data.message };
                }
            } catch (error) {
                console.error('Login error:', error);
                return { success: false, message: 'Login failed' };
            }
        },

        /**
         * Logout user
         * @returns {Promise<boolean>} Logout success
         */
        logout: async function() {
            try {
                await fetch(`${CONFIG.apiBaseUrl}/api/auth/logout`, {
                    method: 'POST'
                });
            } catch (error) {
                console.error('Logout error:', error);
            } finally {
                this.removeToken();
                return true;
            }
        },

        /**
         * Refresh token
         * @returns {Promise<boolean>} Refresh success
         */
        refreshToken: async function() {
            try {
                const response = await fetch(`${CONFIG.apiBaseUrl}/api/auth/refresh`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.getToken()}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    this.setToken(data.token);
                    return true;
                }
                return false;
            } catch (error) {
                console.error('Token refresh error:', error);
                return false;
            }
        }
    };

    // Theme Manager
    const Theme = {
        /**
         * Get current theme
         * @returns {string} Theme name
         */
        get: function() {
            return localStorage.getItem(CONFIG.themeKey) || 'light';
        },

        /**
         * Set theme
         * @param {string} theme - Theme name
         */
        set: function(theme) {
            localStorage.setItem(CONFIG.themeKey, theme);
            document.documentElement.classList.toggle('dark', theme === 'dark');
        },

        /**
         * Toggle theme
         * @returns {string} New theme
         */
        toggle: function() {
            const currentTheme = this.get();
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            this.set(newTheme);
            return newTheme;
        },

        /**
         * Initialize theme
         */
        init: function() {
            const theme = this.get();
            this.set(theme);
        }
    };

    // Language Manager
    const Language = {
        /**
         * Get current language
         * @returns {string} Language code
         */
        get: function() {
            return localStorage.getItem(CONFIG.languageKey) || 'en';
        },

        /**
         * Set language
         * @param {string} language - Language code
         */
        set: function(language) {
            localStorage.setItem(CONFIG.languageKey, language);
        },

        /**
         * Toggle language
         * @returns {string} New language
         */
        toggle: function() {
            const currentLang = this.get();
            const newLang = currentLang === 'en' ? 'id' : 'en';
            this.set(newLang);
            return newLang;
        }
    };

    // API Manager
    const API = {
        /**
         * Make API request
         * @param {string} url - API endpoint
         * @param {Object} options - Request options
         * @returns {Promise<Object>} Response data
         */
        request: async function(url, options = {}) {
            const defaultOptions = {
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            // Add auth token if available
            const token = Auth.getToken();
            if (token) {
                defaultOptions.headers.Authorization = `Bearer ${token}`;
            }

            const finalOptions = { ...defaultOptions, ...options };

            try {
                const response = await fetch(`${CONFIG.apiBaseUrl}${url}`, finalOptions);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Request failed');
                }

                return data;
            } catch (error) {
                console.error('API request error:', error);
                throw error;
            }
        },

        /**
         * GET request
         * @param {string} url - API endpoint
         * @param {Object} params - Query parameters
         * @returns {Promise<Object>} Response data
         */
        get: function(url, params = {}) {
            const queryString = new URLSearchParams(params).toString();
            const finalUrl = queryString ? `${url}?${queryString}` : url;
            return this.request(finalUrl, { method: 'GET' });
        },

        /**
         * POST request
         * @param {string} url - API endpoint
         * @param {Object} data - Request body
         * @returns {Promise<Object>} Response data
         */
        post: function(url, data = {}) {
            return this.request(url, {
                method: 'POST',
                body: JSON.stringify(data)
            });
        },

        /**
         * PUT request
         * @param {string} url - API endpoint
         * @param {Object} data - Request body
         * @returns {Promise<Object>} Response data
         */
        put: function(url, data = {}) {
            return this.request(url, {
                method: 'PUT',
                body: JSON.stringify(data)
            });
        },

        /**
         * DELETE request
         * @param {string} url - API endpoint
         * @returns {Promise<Object>} Response data
         */
        delete: function(url) {
            return this.request(url, { method: 'DELETE' });
        }
    };

    // Event Manager
    const Events = {
        listeners: {},

        /**
         * Add event listener
         * @param {string} event - Event name
         * @param {Function} callback - Event callback
         * @param {Element} target - Event target
         */
        on: function(event, callback, target = document) {
            if (!this.listeners[event]) {
                this.listeners[event] = [];
            }
            this.listeners[event].push({ callback, target });
            target.addEventListener(event, callback);
        },

        /**
         * Remove event listener
         * @param {string} event - Event name
         * @param {Function} callback - Event callback
         * @param {Element} target - Event target
         */
        off: function(event, callback, target = document) {
            if (this.listeners[event]) {
                this.listeners[event] = this.listeners[event].filter(
                    listener => listener.callback !== callback || listener.target !== target
                );
            }
            target.removeEventListener(event, callback);
        },

        /**
         * Trigger custom event
         * @param {string} event - Event name
         * @param {Object} detail - Event detail
         * @param {Element} target - Event target
         */
        trigger: function(event, detail = {}, target = document) {
            const customEvent = new CustomEvent(event, { detail });
            target.dispatchEvent(customEvent);
        }
    };

    // Form Validator
    const Validator = {
        /**
         * Validate email
         * @param {string} email - Email to validate
         * @returns {boolean} Validity status
         */
        email: function(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },

        /**
         * Validate password
         * @param {string} password - Password to validate
         * @returns {Object} Validation result
         */
        password: function(password) {
            const result = {
                isValid: true,
                errors: []
            };

            if (password.length < 6) {
                result.isValid = false;
                result.errors.push('Password must be at least 6 characters');
            }

            if (!/[A-Z]/.test(password)) {
                result.isValid = false;
                result.errors.push('Password must contain at least one uppercase letter');
            }

            if (!/[0-9]/.test(password)) {
                result.isValid = false;
                result.errors.push('Password must contain at least one number');
            }

            return result;
        },

        /**
         * Validate required field
         * @param {string} value - Value to validate
         * @returns {boolean} Validity status
         */
        required: function(value) {
            return value && value.trim().length > 0;
        },

        /**
         * Validate URL
         * @param {string} url - URL to validate
         * @returns {boolean} Validity status
         */
        url: function(url) {
            try {
                new URL(url);
                return true;
            } catch {
                return false;
            }
        }
    };

    // Notification System
    const Notification = {
        /**
         * Show notification
         * @param {string} message - Notification message
         * @param {string} type - Notification type (success, error, warning, info)
         * @param {number} duration - Display duration
         */
        show: function(message, type = 'info', duration = 3000) {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;

            // Add styles
            Object.assign(notification.style, {
                position: 'fixed',
                top: '20px',
                right: '20px',
                padding: '12px 20px',
                borderRadius: '8px',
                color: 'white',
                fontWeight: '500',
                zIndex: '9999',
                transform: 'translateX(100%)',
                transition: 'transform 0.3s ease',
                maxWidth: '300px'
            });

            // Set background color based on type
            const colors = {
                success: '#10b981',
                error: '#ef4444',
                warning: '#f59e0b',
                info: '#3b82f6'
            };
            notification.style.backgroundColor = colors[type] || colors.info;

            document.body.appendChild(notification);

            // Animate in
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);

            // Remove after duration
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, duration);
        },

        /**
         * Show success notification
         * @param {string} message - Message
         * @param {number} duration - Duration
         */
        success: function(message, duration) {
            this.show(message, 'success', duration);
        },

        /**
         * Show error notification
         * @param {string} message - Message
         * @param {number} duration - Duration
         */
        error: function(message, duration) {
            this.show(message, 'error', duration);
        },

        /**
         * Show warning notification
         * @param {string} message - Message
         * @param {number} duration - Duration
         */
        warning: function(message, duration) {
            this.show(message, 'warning', duration);
        },

        /**
         * Show info notification
         * @param {string} message - Message
         * @param {number} duration - Duration
         */
        info: function(message, duration) {
            this.show(message, 'info', duration);
        }
    };

    // Loading Manager
    const Loading = {
        /**
         * Show loading spinner
         * @param {string} message - Loading message
         * @returns {Element} Loading element
         */
        show: function(message = 'Loading...') {
            const loader = document.createElement('div');
            loader.className = 'loading-overlay';
            loader.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>${message}</p>
                </div>
            `;

            // Add styles
            Object.assign(loader.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: '9998'
            });

            const spinner = loader.querySelector('.loading-spinner');
            Object.assign(spinner.style, {
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                textAlign: 'center'
            });

            const spinnerDiv = loader.querySelector('.spinner');
            Object.assign(spinnerDiv.style, {
                width: '40px',
                height: '40px',
                border: '4px solid #f3f3f3',
                borderTop: '4px solid #3b82f6',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto 10px'
            });

            // Add spin animation
            if (!document.querySelector('#spinner-animation')) {
                const style = document.createElement('style');
                style.id = 'spinner-animation';
                style.textContent = `
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(style);
            }

            document.body.appendChild(loader);
            return loader;
        },

        /**
         * Hide loading spinner
         * @param {Element} loader - Loader element
         */
        hide: function(loader) {
            if (loader && loader.parentNode) {
                loader.parentNode.removeChild(loader);
            }
        }
    };

    // Initialize everything when DOM is ready
    function init() {
        // Initialize theme
        Theme.init();

        // Add global event listeners
        Events.on('scroll', Utils.throttle(function() {
            // Handle scroll events
            const navbar = document.querySelector('nav');
            if (navbar) {
                navbar.classList.toggle('scrolled', window.scrollY > 50);
            }
        }, 100));

        // Handle form submissions
        Events.on('submit', function(e) {
            const form = e.target;
            if (form.dataset.ajax) {
                e.preventDefault();
                handleFormSubmit(form);
            }
        });

        // Handle smooth scrolling for anchor links
        Events.on('click', function(e) {
            const link = e.target.closest('a');
            if (link && link.hash) {
                e.preventDefault();
                Utils.scrollTo(link.hash);
            }
        });

        // Log initialization
        if (CONFIG.debug) {
            console.log(`Script.js v${CONFIG.version} initialized successfully`);
        }
    }

    /**
     * Handle AJAX form submission
     * @param {HTMLFormElement} form - Form element
     */
    async function handleFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData.entries());
        const action = form.action || form.dataset.action;
        const method = form.method || 'POST';

        const loader = Loading.show('Submitting...');

        try {
            const response = await fetch(action, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (result.success) {
                Notification.success('Form submitted successfully!');
                if (form.dataset.reset) {
                    form.reset();
                }
            } else {
                Notification.error(result.message || 'Submission failed');
            }
        } catch (error) {
            console.error('Form submission error:', error);
            Notification.error('An error occurred. Please try again.');
        } finally {
            Loading.hide(loader);
        }
    }

    // Expose global API
    window.ScriptJS = {
        version: CONFIG.version,
        Utils,
        Auth,
        Theme,
        Language,
        API,
        Events,
        Validator,
        Notification,
        Loading,
        CONFIG
    };

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
