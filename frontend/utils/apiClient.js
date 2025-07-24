const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

/**
 * Parse a pattern DSL code and return the structured pattern data.
 * 
 * @param {string} patternCode - The pattern DSL code to parse.
 * @returns {Promise<Object>} - The parsed pattern.
 * @throws {Error} - If there is an error parsing the pattern.
 */
export const parsePattern = async (patternCode) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/parse`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pattern_code: patternCode }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to parse pattern');
    }
    
    return data.pattern;
  } catch (error) {
    console.error('Error parsing pattern:', error);
    throw error;
  }
};

/**
 * Get a list of available instruments.
 * 
 * @returns {Promise<Object>} - The available instruments.
 * @throws {Error} - If there is an error fetching instruments.
 */
export const getInstruments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/instruments`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching instruments:', error);
    throw error;
  }
};

/**
 * Save a pattern to the database.
 * 
 * @param {Object} pattern - The pattern to save.
 * @param {string} name - The name of the pattern.
 * @returns {Promise<Object>} - The saved pattern.
 * @throws {Error} - If there is an error saving the pattern.
 */
export const savePattern = async (pattern, name) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/patterns`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pattern, name }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to save pattern');
    }
    
    return data;
  } catch (error) {
    console.error('Error saving pattern:', error);
    throw error;
  }
};

/**
 * Load a pattern from the database.
 * 
 * @param {string} patternId - The ID of the pattern to load.
 * @returns {Promise<Object>} - The loaded pattern.
 * @throws {Error} - If there is an error loading the pattern.
 */
export const loadPattern = async (patternId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/patterns/${patternId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to load pattern');
    }
    
    return data.pattern;
  } catch (error) {
    console.error('Error loading pattern:', error);
    throw error;
  }
};

/**
 * List all patterns in the database.
 * 
 * @returns {Promise<Array>} - The list of patterns.
 * @throws {Error} - If there is an error listing patterns.
 */
export const listPatterns = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/patterns`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to list patterns');
    }
    
    return data.patterns;
  } catch (error) {
    console.error('Error listing patterns:', error);
    throw error;
  }
};