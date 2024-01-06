import jwt_decode from "jwt-decode";

import {
  API_BASE_URL,
  apiAuth,
  getJwtToken,
  getRefreshToken,
} from "../../services/api";
import { refactorUser } from "../../services/utils/functions";

export function getUserJwt() {
  try {
    const access_token = getJwtToken();
    return jwt_decode(access_token);
  } catch (error) {
    console.log(error);
  }

  return null;
}

async function Login(userData) {
  const data = userData;

  try {
    const response = await apiAuth.post("/login/", data);

    if (response.status === 200 && response.data.tokens.access) {
      response.data.user = response.data.user;

      return response;
    }
  } catch (error) {
    console.log(error.response);
    return error.response;
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

async function Logout() {
  try {
    const data = {
      refresh_token: getRefreshToken(),
    };

    const response = await apiAuth.post(`/logout/`, data);

    if (response.status === 205) {
      return response;
    }
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
      // const email = data.email;
      // const password = data.new_password0;

      // setApiAuthToken(email, password);
      return response;
    }
  } catch (error) {
    console.log(error.response);
    return error.response;
  }
}

export {
  Login,
  Register,
  Logout,
  ResetPassword,
  ValidateResetToken,
  ChangePassword,
};
