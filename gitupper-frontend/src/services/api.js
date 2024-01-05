/* eslint-disable react-hooks/rules-of-hooks */
import axios from "axios";
import dayjs from "dayjs";
import jwt_decode from "jwt-decode";

export const FRONT_BASEURL = process.env.REACT_APP_FRONT_BASE_URL;
export const API_AUTH_TOKEN_NAME = process.env.REACT_APP_API_AUTH_TOKEN_NAME;
export const GITHUB_TOKEN_NAME = process.env.REACT_APP_GITHUB_TOKEN_NAME;
export const GITHUB_OAUTH_URL = process.env.REACT_APP_GITHUB_OAUTH_URL;
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
export const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
export const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

const GITHUB_API_BASE_URL = "https://api.github.com";

const useAxios = () => {
  const authTokens = JSON.parse(localStorage.getItem(API_AUTH_TOKEN_NAME));

  const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      Authorization: `Bearer ${authTokens?.access}`,
    },
  });

  axiosInstance.interceptors.request.use(
    async (config) => {
      if (!authTokens?.access) {
        return config;
      }

      const user = jwt_decode(authTokens.access);
      const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

      if (!isExpired) return config;

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/users/auth/token/refresh/`,
        {
          refresh: authTokens.refresh,
        }
      );

      localStorage.setItem(API_AUTH_TOKEN_NAME, JSON.stringify(response.data));

      config.headers.Authorization = `Bearer ${response.data.access}`;
      return config;
    },
    (error) => {
      console.log("interceptor request has error", error);
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      // Check if refresh token is valid, otherwise logout user
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.code === "token_not_valid"
      ) {
        localStorage.clear();
        window.location = "/";
        return error;
      } else return Promise.reject(error);
    }
  );
  return axiosInstance;
};

const api = useAxios();

export function updateApi(token) {
  api.defaults.headers.common["Authorization"] = `Basic ${token}`;

  return api;
}

export const apiAuth = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/users/auth`,
});

export const apiGithub = axios.create({
  baseURL: GITHUB_API_BASE_URL,
});

export default api;
