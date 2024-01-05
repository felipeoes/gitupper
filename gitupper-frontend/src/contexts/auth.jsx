import React, { createContext, useState, useReducer } from "react";
import jwt_decode from "jwt-decode";

import api, {
  API_AUTH_TOKEN_NAME,
  GITHUB_TOKEN_NAME,
  API_BASE_URL,
  CLIENT_ID,
  REDIRECT_URI,
  apiAuth,
} from "../services/api";

import {
  setApiAuthToken,
  LoginGithub,
  GetPlatformSubmissions,
  UploadSubmissions,
  GetUserRepos,
} from "./github/auth";

import { platforms_obj } from "../services/utils/platforms";

const AuthContext = createContext({});

const user = JSON.parse(localStorage.getItem("user") || "{}");

const initialState = {
  isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
  isBinded: JSON.parse(localStorage.getItem("isBinded")) || false,
  user: refactorUser(user),
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  modalLoading: false,
};

function refactorUser(user) {
  if (user["name"]) {
    const names = user["name"].split(" ");
    user["first_name"] = names[0];
    user["last_name"] = names[1];
  }

  if (user["user_gitupper_id"]) {
    user["gitupper_id"] = user["user_gitupper_id"];
    delete user["user_gitupper_id"];
  }

  if (!user["profile_image"]) {
    user["profile_image"] = user["avatar_url"];
  } else if (!user["profile_image"].includes("http")) {
    user["profile_image"] = API_BASE_URL + user["profile_image"];
  }

  return user;
}

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN": {
      var github_token = action.payload.github_token;
      var tokens = action.payload.tokens;

      if (tokens) {
        localStorage.setItem(API_AUTH_TOKEN_NAME, JSON.stringify(tokens));
      }

      if (github_token) {
        localStorage.setItem(GITHUB_TOKEN_NAME, JSON.stringify(github_token));
      }

      let user = action.payload.user;

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem(
          "isLoggedIn",
          JSON.stringify(action.payload.isLoggedIn)
        );
      }

      return {
        ...state,
        isLoggedIn: action.payload.isLoggedIn,
        user: user,
      };
    }
    case "LOGOUT": {
      localStorage.clear();
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    }
    case "MODAL_START_LOADING": {
      return {
        ...state,
        modalLoading: true,
      };
    }
    case "MODAL_STOP_LOADING": {
      return {
        ...state,
        modalLoading: false,
      };
    }
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    localStorage.getItem("user")
      ? refactorUser(JSON.parse(localStorage.getItem("user")))
      : null
  );

  const [state, dispatch] = useReducer(reducer, initialState);

  async function Login(userData) {
    const data = userData;

    try {
      const response = await apiAuth.post("/login/", data);

      if (response.status === 200 && response.data.access) {
        const user = jwt_decode(response.data.access);
        setUser(user);

        response.data.user = refactorUser(user);

        return response;
      }

      // if (response.status === 200 && response.data.key) {

      //   setApiAuthToken(response.data.key);

      //   return response;
      // }
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  }

  async function BindPlatform(data) {
    try {
      const response = await api.post("bind/platform/", data);

      if (response.status === 200 && response.data["gitupper_id"]) {
        return response;
      } else {
        const data = {
          errors: {
            login: response.data.login,
            password: response.data.password,
            token: response.data.token,
            verification: response.data.verification,
            error: response.data.error,
          },
        };

        return data;
      }
    } catch (error) {
      const data = {
        errors: {
          error: error.response.data.detail,
        },
      };

      console.log(error);
      return data;
    }
  }

  async function UnbindPlatform(gitupper_user, platformName) {
    let response = null;

    try {
      const platformPrefix = platforms_obj[platformName].platformPrefix;
      const data = {
        platform_prefix: platformPrefix,
        platform_id: gitupper_user[`${platformPrefix}_id`],
      };

      response = await api.post("unbind/platform/", data);

      response.data.platformPrefix = platformPrefix;
      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async function DownloadSubmissions(
    submissions_list,
    platformPrefix,
    id_value
  ) {
    try {
      const data = {
        platform_prefix: platformPrefix,
        platform_id: id_value,
        submissions_list: submissions_list,
      };

      const response = await api.post(`/download/submissions/`, data, {
        responseType: "arraybuffer",
      });

      if (response.status === 200 && response.data) {
        let blob = new Blob([response.data], { type: "application/zip" });
        const downloadUrl = URL.createObjectURL(blob);
        let link = document.createElement("a");
        link.href = downloadUrl;
        link.download = `arquivos_${id_value}`;
        document.body.appendChild(link);
        link.click();

        return true;
      }

      return false;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async function CheckDownloadProgress(gitupper_id) {
    const response = await api.get(`/temp-progress/${gitupper_id}/`);

    if (response.status === 200) {
      return response.data.value;
    } else {
      return null;
    }
  }

  async function Register(userData) {
    try {
      const response = await apiAuth.post(`/register/`, userData);

      if (response.data.token) {
        response.data.user.profile_image =
          API_BASE_URL + response.data.user.profile_image;
      }
      return response;
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  }

  async function ResetPassword(email) {
    try {
      const data = {
        email: email,
      };
      const response = await apiAuth.post(`/reset-password/`, data);

      if (response.status === 200) {
        return response;
      }
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  }

  async function ValidateResetToken(data) {
    try {
      const response = await apiAuth.post(`/validate-reset/`, data);

      if (response.status === 200) {
        return response;
      }
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  }

  async function ChangePassword(data) {
    // nao-autorizado
    try {
      const response = await apiAuth.put(`/change-password/`, data);

      if (response.status === 200) {
        const email = data.email;
        const password = data.new_password0;

        // setApiAuthToken(email, password);
        return response;
      }
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  }

  async function GetRepoEvents() {
    try {
      const response = await api.get(`/repo-events/`);

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  }

  async function CreateRepoEvent(data) {
    try {
      const response = await api.post(`/repo-events/`, data);

      if (response.status === 201) {
        return response.data;
      }
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  }

  async function CreateRepoSubmissions(data) {
    try {
      const response = await api.post(`/repo-submissions/`, data);

      if (response.status === 201) {
        return response.data;
      }
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  }

  function Logout() {
    dispatch({ type: "LOGOUT" });
  }

  return (
    <AuthContext.Provider
      value={{
        signed: Boolean(
          localStorage.getItem(API_AUTH_TOKEN_NAME) !== null ||
            localStorage.getItem(GITHUB_TOKEN_NAME) !== null
        ),
        api,
        user,
        Login,
        LoginGithub,
        BindPlatform,
        GetPlatformSubmissions,
        DownloadSubmissions,
        CheckDownloadProgress,
        Register,
        ResetPassword,
        ChangePassword,
        ValidateResetToken,
        Logout,
        UnbindPlatform,
        UploadSubmissions,
        GetUserRepos,
        CreateRepoEvent,
        CreateRepoSubmissions,
        GetRepoEvents,
        state,
        dispatch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
