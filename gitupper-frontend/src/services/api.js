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

export function getJwtToken() {
  return sessionStorage.getItem(API_AUTH_TOKEN_NAME);
}

export function setJwtToken(token) {
  sessionStorage.setItem(API_AUTH_TOKEN_NAME, token);
}

export function getRefreshToken() {
  return sessionStorage.getItem("refreshToken");
}

export function setRefreshToken(token) {
  sessionStorage.setItem("refreshToken", token);
}

export function getUser() {
  return JSON.parse(sessionStorage.getItem("user"));
}

export function setUser(user) {
  sessionStorage.setItem("user", JSON.stringify(user));
}

export function getGithubToken() {
  return sessionStorage.getItem(GITHUB_TOKEN_NAME);
}

export function setGithubToken(token) {
  sessionStorage.setItem(GITHUB_TOKEN_NAME, token);
}

export async function getAccessToken() {
  const accessToken = getJwtToken();

  if (accessToken) {
    return accessToken;
  }

  // if there is refresh token in cookies, make a request to get access token
  const refreshToken = getRefreshToken();

  if (refreshToken) {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/users/auth/token/refresh/`,
      {
        refresh: refreshToken,
      }
    );

    return response.data.access;
  }

  return null;
}

// const access_token = await getAccessToken();

export const axiosConfig = {
  baseURL: API_BASE_URL,
  headers: {
    Authorization: `Bearer ${getJwtToken()}`,
  },
};

const axiosInstance = axios.create(axiosConfig);

const useAxios = () => {
  axiosInstance.interceptors.request.use(
    async (config) => {
      const accessToken = getJwtToken();

      if (!accessToken) {
        return config;
      }

      const user = jwt_decode(accessToken);
      const isExpired = dayjs.unix(user.exp).diff(dayjs()) < 1;

      if (!isExpired) {
        // update token in headers
        config.headers.Authorization = `Bearer ${accessToken}`;

        return config;
      }

      // get token from cookies
      const refreshToken = getRefreshToken();

      const response = await axios.post(
        `${API_BASE_URL}/api/v1/users/auth/token/refresh/`,
        {
          refresh: refreshToken,
        }
      );

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
    async (error) => {
      // Check if refresh token is valid, otherwise logout user
      if (
        error.response &&
        error.response.status === 401 &&
        error.response.data.code === "token_not_valid"
      ) {
        sessionStorage.clear();
        window.location = "/";
        return error;
      } else return Promise.reject(error);
    }
  );
  return axiosInstance;
};

const api = useAxios();

export function updateAxiosAuthHeader() {
  api.defaults.headers.common["Authorization"] = `Bearer ${getJwtToken()}`;
}

export const apiAuth = axios.create({
  baseURL: `${API_BASE_URL}/api/v1/users/auth`,
});

export const apiGithub = axios.create({
  baseURL: GITHUB_API_BASE_URL,
  headers: {
    Authorization: `token ${getGithubToken()}`,
  },
});

apiGithub.interceptors.request.use(
  async (config) => {
    const githubToken = getGithubToken();

    if (!githubToken) {
      return config;
    }

    // update token in headers
    config.headers.Authorization = `token ${githubToken}`;

    return config;
  },
  (error) => {
    console.log("interceptor request has error", error);
    return Promise.reject(error);
  }
);

export function updateapiGithubAuthHeader() {
  apiGithub.defaults.headers.common[
    "Authorization"
  ] = `token ${getGithubToken()}`;
}

export default api;
