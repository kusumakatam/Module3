import axiosInstance from "./axiosInstance";

export const getTodos = () => {
  return axiosInstance.get("/todos");
};

export const getTodoById = (id) => {
  return axiosInstance.get(`/todos/${id}`);
};
