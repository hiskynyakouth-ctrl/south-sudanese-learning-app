import api from './api';

export const getSubjects = async () => {
  const response = await api.get('/subjects');
  return response.data;
};

export const getSubject = async (id) => {
  const response = await api.get(`/subjects/${id}`);
  return response.data;
};