import axios, { AxiosError, AxiosResponse } from "axios";

/**
 * Axios instance with default settings
 */
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate",
    Pragma: "no-cache",
    Expires: "0",
  },
});

/**
 * Request Interceptor — add auth token
 */
axiosInstance.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Response Interceptor — handle errors globally
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    console.error("API Error:", error);
    return Promise.reject(error);
  }
);

/**
 * Request helpers
 */
const requests = {
  get: async <T>(url: string) => (await axiosInstance.get<T>(url)).data,
  post: async <T>(url: string, body?: any) =>
    (await axiosInstance.post<T>(url, body)).data,
  put: async <T>(url: string, body?: any) =>
    (await axiosInstance.put<T>(url, body)).data,
  delete: async <T>(url: string) => (await axiosInstance.delete<T>(url)).data,
};

/**
 * Interfaces
 */
export interface ICreateChat {
  id: string;
  name: string;
  timestamp: string;
}

export interface ICreateMessage {
  content: string;
  sender: "user" | "ai";
  userId: string;
}

export interface IMessage {
  id: string;
  content: string;
  timestamp: string;
  isUserMessage: boolean;
  senderId?: string;
}

export interface IChat {
  id: string;
  name: string;
  timestamp: string;
}

export interface IJournalEntry {
  id: string;
  feelingScore: number;
  content: string;
  timestamp: string;
}

export interface ICreateJournalEntry {
  feelingScore: number;
  content: string;
}

export interface IScoreHistory {
  key: string;
  value: number;
}

export type Message = {
  id: string;
  content: string;
  sender: "user" | "ai";
  timestamp: Date;
};

export interface IReport {
  id: string;
  createdAt: string;
  downloadUrl?: string;
  content: string;
  timestamp: string;
  reportId: string;
}

/**
 * API Groups
 */
const chats = {
  list: () => requests.get<IChat[]>("/chats"),
  create: (data: ICreateChat) => requests.post<IChat>("/chats", data),
  delete: (chatId: string) => requests.delete(`/chats/${chatId}`),
  listMessages: (chatId: string) =>
    requests.get<IMessage[]>(`/chats/${chatId}/messages`),
  sendMessage: (chatId: string, data: ICreateMessage) =>
    requests.post<IMessage>(`/chats/${chatId}/messages`, data),
  update: (chatId: string, data: { title: string }) =>
    requests.put<IChat>(`/chats/${chatId}`, data),
};

const journalEntries = {
  list: () => requests.get<IJournalEntry[]>("/journalEntries"),
  create: (data: ICreateJournalEntry) =>
    requests.post<IJournalEntry>("/journalEntries", data),
  update: (journalId: string, data: ICreateJournalEntry) =>
    requests.put<IJournalEntry>(`/journalEntries/${journalId}`, data),
  delete: (journalId: string) =>
    requests.delete(`/journalEntries/${journalId}`),
};

const scoreHistory = {
  get: () => requests.get<IScoreHistory>("/scoreHistory"),
};

const reports = {
  list: () => requests.get<IReport[]>("/reports"),
  generate: () => requests.post<IReport>("/reports/generate"),
    download: async (reportId: string) => {
    const response = await axiosInstance.get(
      `/reports/${reportId}/download`,
      { responseType: "blob" } 
    )
    return response
  },
};

/**
 * Combined API handler
 */
const apiHandler = {
  chats,
  journalEntries,
  scoreHistory,
  reports,
};

export default apiHandler;