import api from '../api';

/**
 * GET /exam-officer
 * Get all exam officers
 */
export const getExamOfficers = async () => {
  const response = await api.get("/exam-officer");
  return response.data;
};

/**
 * GET /exam-officer/{id}
 * Get exam officer by ID
 */
export const getExamOfficerById = async (id) => {
  const response = await api.get(`/exam-officer/${id}`);
  return response.data;
};

/**
 * POST /exam-officer
 * Create a new exam officer
 */
export const createExamOfficer = async (data) => {
  const response = await api.post("/exam-officer", data);
  return response.data;
};

/**
 * PUT /exam-officer/{id}
 * Update an exam officer
 */
export const updateExamOfficer = async (id, data) => {
  const response = await api.put(`/exam-officer/${id}`, data);
  return response.data;
};

/**
 * DELETE /exam-officer/{id}
 * Delete an exam officer
 */
export const deleteExamOfficer = async (id) => {
  const response = await api.delete(`/exam-officer/${id}`);
  return response.data;
};
