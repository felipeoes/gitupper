/* eslint-disable react-hooks/exhaustive-deps */
import React, { createContext, useState, useEffect, useReducer } from "react";
import jwt_decode from "jwt-decode";

import api, {
  getJwtToken,
  setJwtToken,
  getUser,
  setUser,
  setRefreshToken,
  setGithubToken,
  updateAxiosAuthHeader,
  updateapiGithubAuthHeader,
  CLIENT_ID,
  REDIRECT_URI,
} from "../services/api";

import {
  getUserJwt,
  Login,
  Logout as LogoutUser,
  Register,
  ResetPassword,
  ValidateResetToken,
  ChangePassword,
} from "./gitupper/auth";

import {
  LoginGithub,
  GetPlatformSubmissions,
  CreateGithubRepo,
  UploadSubmissions,
  GetUserRepos,
} from "./github/auth";

import { platforms_obj } from "../services/utils/platforms";
import { refactorUser } from "../services/utils/functions";

const AuthContext = createContext({});

const initialState = {
  client_id: CLIENT_ID,
  redirect_uri: REDIRECT_URI,
  modalLoading: false,
  user: getUser(),
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN": {
      const dispatchWorker = action.payload.dispatchWorker;
      const dispatchWorkerData = action.payload.dispatchWorkerData;

      const github_token = action.payload.github_token;
      const tokens = action.payload.tokens;
      let user = action.payload.user;

      const accessToken = tokens?.access;
      const refreshToken = tokens?.refresh;

      if (dispatchWorker && dispatchWorkerData) {
        dispatchWorker(dispatchWorkerData);
      }

      // Tokens will be stored in sessionStorage
      if (refreshToken) {
        setRefreshToken(refreshToken);
      }

      if (accessToken) {
        setJwtToken(accessToken);
        updateAxiosAuthHeader();
      }

      if (github_token) {
        setGithubToken(github_token);
        updateapiGithubAuthHeader();
      }

      if (user) {
        user = refactorUser(user);
        setUser(user);
      }

      return {
        ...state,
        user: user,
        isLoggedIn: true,
        accessToken: accessToken,
      };
    }

    case "UPDATE_USER_SUBMISSIONS": {
      // make a get request to get the authenticated user submissions from platformPrefix
      const user = state.user;
      const platformPrefix = action.payload.platformPrefix;
      const platformId = action.payload.platformId;
      const submissions = action.payload.submissions;

      if (user && submissions) {
        user[`${platformPrefix}_submissions`] = submissions;
        setUser(user);
        return {
          ...state,
          user: user,
        };
      } else if (user) {
        GetPlatformSubmissions(platformPrefix, platformId).then((response) => {
          if (response.status === 200) {
            const submissions = response.data;
            user[`${platformPrefix}_submissions`] = submissions;
            setUser(user);
            return {
              ...state,
              user: user,
            };
          }
        });
      }

      return {
        ...state,
        user: user,
      };
    }
    case "SET_UPLOADING_SUBMISSIONS": {
      const hasOngoingUpload = action.payload.hasOngoingUpload;

      return {
        ...state,
        hasOngoingUpload: hasOngoingUpload,
      };
    }

    // case "SET_PLATFORM_TOKEN_OUTDATED": {
    //   const user = state.user;
    //   const platformPrefix = action.payload.platformPrefix;
    //   const platforms_users = user?.platforms_users;

    //   if (platforms_users) {
    //     Object.keys(platforms_users).forEach((platPrefix) => {
    //       if (platPrefix === platformPrefix) {
    //         platforms_users[platPrefix].token_outdated = true;
    //       }
    //     });

    //     user.platforms_users = platforms_users;
    //     setUser(user);
    //   }

    //   return {
    //     ...state,
    //     user: user,
    //   };
    // }

    case "LOGOUT": {
      sessionStorage.clear();

      state = initialState;
      state.user = null;

      return {
        // back to initial state
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
  const [state, dispatch] = useReducer(reducer, initialState);

  function setUser(user) {
    // dispatch({
    //   type: "LOGIN",
    //   payload: user,
    // });
    state.user = user;
  }

  // useEffect(() => {
  //   async function getUser() {
  //     const user = await retrieveUser();
  //     if (user) {
  //       setUser(user);
  //     }
  //   }
  //   getUser();
  // }, [state]);

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

  async function FetchSubmissions(platformName) {
    try {
      const platformPrefix = platforms_obj[platformName].platformPrefix;

      const data = {
        platform_prefix: platformPrefix,
      };

      const response = await api.post("fetch/submissions/", data);

      return response;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  async function GetUser() {
    try {
      const response = await api.get(`/users/`);

      if (response.status === 200) {
        return response;
      }
    } catch (error) {
      console.log(error.response);
      return error.response;
    }
  }

  async function RetrieveUser() {
    let user = null;
    try {
      user = refactorUser(await GetUser());
    } catch (error) {
      console.log(error);
    }

    return user;
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

  async function Logout() {
    LogoutUser();

    dispatch({
      type: "LOGOUT",
    });
  }

  return (
    <AuthContext.Provider
      value={{
        signed: Boolean(state.user),
        getJwtToken,
        api,
        Login,
        Logout,
        LoginGithub,
        BindPlatform,
        GetPlatformSubmissions,
        DownloadSubmissions,
        CheckDownloadProgress,
        Register,
        ResetPassword,
        ChangePassword,
        RetrieveUser,
        ValidateResetToken,
        UnbindPlatform,
        CreateGithubRepo,
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
