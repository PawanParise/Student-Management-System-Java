const API_BASE_URL = 'http://localhost:8080/api/students';

/**
 * Helper to handle fetch responses and extract meaningful error messages
 */
async function handleResponse(response) {
  if (!response.ok) {
    let errorData = null;
    try {
      errorData = await response.json();
    } catch {
      // response wasn't JSON
    }

    if (errorData) {
      if (errorData.validationErrors) {
        const details = Object.entries(errorData.validationErrors)
          .map(([field, msg]) => `${field}: ${msg}`)
          .join(', ');
        throw new Error(details || errorData.message || 'Validation failed');
      }
      throw new Error(errorData.message || errorData.error || `HTTP error! Status: ${response.status}`);
    }
    throw new Error(`Request failed with status ${response.status}`);
  }

  // Handle empty responses
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return null;
}

export const studentService = {
  /**
   * Fetch all students with optional search keyword and course filter
   */
  async getStudents(search = '', course = '') {
    const params = new URLSearchParams();
    if (search && search.trim()) params.append('search', search.trim());
    if (course && course.trim() && course !== 'ALL') params.append('course', course.trim());

    const url = `${API_BASE_URL}${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await fetch(url);
    return handleResponse(response);
  },

  /**
   * Fetch single student by ID
   */
  async getStudentById(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`);
    return handleResponse(response);
  },

  /**
   * Create a new student
   */
  async createStudent(studentData) {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    return handleResponse(response);
  },

  /**
   * Update student details
   */
  async updateStudent(id, studentData) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    return handleResponse(response);
  },

  /**
   * Delete student by ID
   */
  async deleteStudent(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  /**
   * Fetch dashboard statistics
   */
  async getStats() {
    const response = await fetch(`${API_BASE_URL}/stats`);
    return handleResponse(response);
  },

  /**
   * Fetch unique list of courses
   */
  async getCourses() {
    const response = await fetch(`${API_BASE_URL}/courses`);
    return handleResponse(response);
  },

  /**
   * Ping backend to check health
   */
  async checkHealth() {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`, { signal: AbortSignal.timeout(3000) });
      return response.ok;
    } catch {
      return false;
    }
  }
};
