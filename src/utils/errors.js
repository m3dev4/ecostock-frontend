/**
 * Extracts a user-friendly error message from an API/Axios error response.
 * Handles strings, FastAPI details (arrays of loc/msg), Django/generic validation error objects, etc.
 * 
 * @param {any} error The exception caught
 * @param {string} defaultMessage The fallback message if no specific backend message is found
 * @returns {string} The formatted error message
 */
export const getErrorMessage = (error, defaultMessage = 'Une erreur est survenue') => {
  if (error?.response?.data) {
    const data = error.response.data;

    // Standard string error response
    if (typeof data === 'string') {
      return data;
    }

    // FastAPI style / standard detail structure
    if (data.detail) {
      if (typeof data.detail === 'string') {
        return data.detail;
      }
      if (Array.isArray(data.detail)) {
        return data.detail
          .map((err) => {
            const field = err.loc ? err.loc[err.loc.length - 1] : '';
            return `${field ? field + ': ' : ''}${err.msg}`;
          })
          .join(', ');
      }
    }

    // Object structures (e.g. Django Rest Framework validation errors: { field: [ "msg" ] })
    if (typeof data === 'object') {
      const messages = [];
      for (const [key, value] of Object.entries(data)) {
        if (key === 'status') continue;
        if (Array.isArray(value)) {
          messages.push(`${key}: ${value.join(', ')}`);
        } else if (typeof value === 'string') {
          messages.push(`${key}: ${value}`);
        } else if (typeof value === 'object' && value !== null) {
          // Nested object validation formatting
          const subMessages = [];
          for (const [subKey, subVal] of Object.entries(value)) {
            if (Array.isArray(subVal)) {
              subMessages.push(`${subKey}: ${subVal.join(', ')}`);
            } else {
              subMessages.push(`${subKey}: ${subVal}`);
            }
          }
          if (subMessages.length > 0) {
            messages.push(`${key} (${subMessages.join('; ')})`);
          } else {
            messages.push(`${key}: ${JSON.stringify(value)}`);
          }
        }
      }
      if (messages.length > 0) {
        return messages.join(' | ');
      }
    }
  }

  return error?.message || defaultMessage;
};
