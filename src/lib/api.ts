import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000', // Replace with your API URL
});

export interface Task {
  id: number;
  title: string;
  description: string;
}

export interface CreateTaskInput {
  title: string;
  description: string;
}

export const getTasks = async (): Promise<Task[]> => {
  const response = await api.get('/tasks');
  return response.data;
};

export const getTask = async (id: number): Promise<Task> => {
  const response = await api.get(`/tasks/${id}`);
  return response.data;
};

export const createTask = async (task: CreateTaskInput): Promise<Task> => {
  const response = await api.post('/tasks', task);
  return response.data;
};

export const updateTask = async (id: number, task: CreateTaskInput): Promise<Task> => {
  const response = await api.patch(`/tasks/${id}`, task);
  return response.data;
};

export const deleteTask = async (id: number): Promise<Task> => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};