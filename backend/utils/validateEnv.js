/**
 * Environment Variables Validator
 * Validates all required environment variables before server startup
 */

const validateEnvironment = () => {
  const requiredEnvVars = {
    MONGODB_URI: {
      required: true,
      description: 'MongoDB Atlas connection string',
      format: 'mongodb+srv://username:password@cluster.mongodb.net/database',
      validate: (value) => {
        if (!value) return { valid: false, message: 'MONGODB_URI is required' };
        if (!value.startsWith('mongodb://') && !value.startsWith('mongodb+srv://')) {
          return { valid: false, message: 'MONGODB_URI must start with mongodb:// or mongodb+srv://' };
        }
        return { valid: true };
      }
    },
    JWT_SECRET: {
      required: true,
      description: 'Secret key for JWT token signing',
      format: 'A strong random string (minimum 32 characters recommended)',
      validate: (value) => {
        if (!value) return { valid: false, message: 'JWT_SECRET is required' };
        if (value.length < 32) {
          return { 
            valid: false, 
            message: 'JWT_SECRET should be at least 32 characters for production security',
            warning: true 
          };
        }
        return { valid: true };
      }
    },
    ADMIN_CODE: {
      required: true,
      description: 'Secret code required for admin registration',
      format: 'A secure string (e.g., ADMIN-2024-SECRET-CODE)',
      validate: (value) => {
        if (!value) return { valid: false, message: 'ADMIN_CODE is required' };
        if (value.length < 8) {
          return { 
            valid: false, 
            message: 'ADMIN_CODE should be at least 8 characters',
            warning: true 
          };
        }
        return { valid: true };
      }
    },
    PORT: {
      required: false,
      default: 5000,
      description: 'Server port number',
      validate: (value) => {
        const port = parseInt(value || 5000);
        if (isNaN(port) || port < 1 || port > 65535) {
          return { valid: false, message: 'PORT must be a number between 1 and 65535' };
        }
        return { valid: true };
      }
    },
    NODE_ENV: {
      required: false,
      default: 'development',
      description: 'Node environment (development, production, test)',
      validate: (value) => {
        const env = value || 'development';
        if (!['development', 'production', 'test'].includes(env)) {
          return { valid: false, message: 'NODE_ENV must be development, production, or test' };
        }
        return { valid: true };
      }
    },
    FRONTEND_URL: {
      required: false,
      default: 'http://localhost:3000',
      description: 'Frontend URL for CORS configuration',
      validate: (value) => {
        // Treat empty string as not set
        if (!value || value.trim() === '') return { valid: true }; // Optional
        try {
          const url = new URL(value);
          // Ensure it's http or https
          if (!['http:', 'https:'].includes(url.protocol)) {
            return { valid: false, message: 'FRONTEND_URL must use http:// or https:// protocol' };
          }
          return { valid: true };
        } catch {
          return { valid: false, message: 'FRONTEND_URL must be a valid URL (e.g., http://localhost:3000)' };
        }
      }
    },
    STRIPE_SECRET_KEY: {
      required: true,
      description: 'Stripe secret key for payment processing',
      format: 'sk_test_... or sk_live_...',
      validate: (value) => {
        if (!value) return { valid: false, message: 'STRIPE_SECRET_KEY is required' };
        if (!value.startsWith('sk_test_') && !value.startsWith('sk_live_')) {
          return { valid: false, message: 'STRIPE_SECRET_KEY must start with sk_test_ or sk_live_' };
        }
        return { valid: true };
      }
    },
    STRIPE_WEBHOOK_SECRET: {
      required: true,
      description: 'Stripe webhook signing secret',
      format: 'whsec_...',
      validate: (value) => {
        if (!value) return { valid: false, message: 'STRIPE_WEBHOOK_SECRET is required' };
        if (!value.startsWith('whsec_')) {
          return { valid: false, message: 'STRIPE_WEBHOOK_SECRET must start with whsec_' };
        }
        return { valid: true };
      }
    }
  };

  const errors = [];
  const warnings = [];

  // Validate each environment variable
  Object.entries(requiredEnvVars).forEach(([key, config]) => {
    let value = process.env[key];
    
    // Treat empty string as not set
    if (value === '' || (value && value.trim() === '')) {
      value = undefined;
      delete process.env[key];
    }
    
    // Set default if not required and not set
    if (!config.required && !value && config.default) {
      process.env[key] = config.default;
      value = config.default;
    }

    // Check if required variable is missing
    if (config.required && !value) {
      errors.push({
        key,
        message: `${key} is required`,
        description: config.description,
        format: config.format
      });
      return;
    }

    // Validate format/constraints if validator exists
    if (value && config.validate) {
      const validation = config.validate(value);
      if (!validation.valid) {
        if (validation.warning) {
          warnings.push({
            key,
            message: validation.message,
            description: config.description
          });
        } else {
          errors.push({
            key,
            message: validation.message,
            description: config.description,
            format: config.format
          });
        }
      }
    }
  });

  return { errors, warnings };
};

module.exports = { validateEnvironment };
