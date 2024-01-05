import { useState, useEffect, useContext } from "react";
import { useTheme } from "styled-components";
import {
  AuthContainer,
  AuthLeftContainer,
  AuthLeftContainerHeader,
  LoginOrRegisterMessage,
  StyledLink,
  AuthLeftContainerHeaderSubtitle,
  IconContainer,
  LoginContainerDividerText,
  AuthLeftContainerContent,
  FormContainer,
  LoginOptionsContainer,
  RememberMeContainer,
  LoginOptionsText,
  GithubOauthLink,
} from "./styles";

import { FRONT_BASEURL } from "../../../services/api.js";
import AuthContext from "../../../contexts/auth";
import { GoMarkGithub } from "react-icons/go";
import Button from "./../../../components/button/Button";
import Checkbox from "../../../components/checkbox/Checkbox";
import Input from "./../../../components/input/Input";
import { Topbar } from "./../../../components/topbar/Topbar";
import LogoButton from "../../../components/logoButton/LogoButton";

import { paths } from "../../../services/utils/paths";
import ErrorMessage from "./../../../components/errorMessage/ErrorMessage";
import Loading from "./../../../components/loading/Loading";

export const GitHubIcon = () => (
  <IconContainer>
    <GoMarkGithub size={24} />
  </IconContainer>
);

export function passwordRequirements(password) {
  let shortPassword = password.length < 6;

  return !shortPassword;
}

function userIsBinded(user) {
  // Itera pelos atributos do usuário
  const excluded_keys = ["gitupper_id", "github_id"];
  for (let key in user) {
    // Se algum atributo terminado com _id for diferente de null, então o usuário está bindado
    if (
      !excluded_keys.includes(key) &&
      key.endsWith("_id") &&
      user[key] !== null
    ) {
      return true;
    }
  }

  return false;
}

export function checkLoginState(state) {
  if (state.isLoggedIn) {
    if (userIsBinded(state.user)) {
      window.location.replace(`${FRONT_BASEURL}${paths.homepage}`);
    } else {
      window.location.replace(`${FRONT_BASEURL}${paths.bind}`);
    }
  }
}

export default function Login() {
  const context = useContext(AuthContext);
  const theme = useTheme();
  const { client_id, redirect_uri } = context.state;
  const { state, dispatch } = context;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [disabledForm, setDisabledForm] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function handleOnLoginGithub(code) {
      const response = await context.LoginGithub(code);

      try {
        dispatch({
          type: "LOGIN",
          payload: {
            user: response.data,
            isLoggedIn: true,
            github_token: response.token,
            tokens: response.tokens,
          },
        });
      } catch (error) {
        resetFormOnError(error);
      }
    }

    const url = window.location.href;
    const hasUserToken = url.includes("?code=");

    if (hasUserToken) {
      const newUrl = url.split("?code=");
      window.history.pushState({}, null, newUrl[0]);
      setLoading(true);

      const code = newUrl[1];

      handleOnLoginGithub(code);
    }
  }, [state, dispatch, context, errors]);

  checkLoginState(state);

  function checkButtonDisabled() {
    const value = !email || !password || !passwordRequirements(password);
    return value;
  }

  function handleOnChangeForm(e) {
    const { value, name } = e.target;
    if (name === "email") {
      setEmail(value);
    }
    if (name === "password") {
      setPassword(value);
      let strongPassword = passwordRequirements(value);
      value && !strongPassword
        ? setErrors({ ...errors, password: "Mínimo de 6 caracteres!" })
        : setErrors({ ...errors, password: "" });
    }
  }

  function handleOnChangeRememberMe(e) {
    let isChecked = e.target.checked;
    setRememberMe(isChecked);
  }

  function resetFormOnError(errors) {
    if (errors.email || errors.register[0] === "False") {
      errors.email
        ? setErrors({ email: errors.email[0] })
        : setErrors({ email: errors.detail[0] });
    }

    if (errors.register && errors.register[0] === "True") {
      setErrors({ password: errors.detail[0] });
    }

    !(errors.register || errors.email) &&
      setErrors({ email: errors, password: errors });

    localStorage.clear();
    setLoading(false);
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    const user = {
      email: email,
      password: password,
      rememberMe: rememberMe,
    };

    const response = await context.Login(user);

    // setTimeout(() => {
    if (response.status === 200) {
      const user = response.data.user;
      delete response.data["user"];

      dispatch({
        type: "LOGIN",
        payload: {
          user: user,
          isLoggedIn: true,
          tokens: response.data,
        },
      });
    } else {
      resetFormOnError(response.data);
    }

    setDisabledForm(false);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
    // }, 2000);
  };

  function handleOnSubmit(e) {
    setLoading(true);

    setDisabledForm(true);
    onSubmit(e);
  }

  return (
    <AuthContainer>
      <Topbar
        nonAuth
        topbarButtonText="Cadastre-se"
        toPath={paths.signup}
        IconElement={<LogoButton />}
      />
      <AuthLeftContainer>
        <AuthLeftContainerHeader>
          <LoginOrRegisterMessage>
            Entre na sua conta ou
            <StyledLink inline to={paths.signup}>
              {" "}
              cadastre-se
            </StyledLink>
          </LoginOrRegisterMessage>
          <AuthLeftContainerHeaderSubtitle>
            Acesse sua conta para fazer upload do seu código no GitHub
          </AuthLeftContainerHeaderSubtitle>
        </AuthLeftContainerHeader>
        {loading ? (
          <Loading />
        ) : (
          <AuthLeftContainerContent>
            <GithubOauthLink
              href={`https://github.com/login/oauth/authorize?scope=user,repo&client_id=${client_id}&redirect_uri=${redirect_uri}`}
              onClick={() => {
                setLoading(true);
              }}
              rel="noreferrer"
            >
              <Button
                Icon={GitHubIcon}
                iconSize={20}
                iconColor="white"
                border
                color={theme.colors.black}
                bgColor={theme.colors.white}
                borderColor={theme.colors.disabledButton}
              >
                Continuar com GitHub
              </Button>
            </GithubOauthLink>
            <LoginContainerDividerText>- OU -</LoginContainerDividerText>

            <FormContainer onSubmit={handleOnSubmit}>
              <Input
                placeholder="Digite seu email"
                autoFocus
                type="email"
                name="email"
                label="Email"
                value={email}
                required
                borderColor={theme.colors.disabledButton}
                disabled={disabledForm}
                onChange={(e) => handleOnChangeForm(e)}
                error={errors.email}
              />
              <ErrorMessage error={errors.email} />

              <Input
                placeholder="Digite sua senha"
                type="password"
                name="password"
                label="Senha"
                value={password}
                required
                error={
                  errors.password ||
                  (password && !passwordRequirements(password))
                }
                borderColor={theme.colors.disabledButton}
                disabled={disabledForm}
                onChange={(e) => handleOnChangeForm(e)}
              />
              <ErrorMessage error={errors.password} />
              <LoginOptionsContainer>
                <RememberMeContainer>
                  <Checkbox
                    checked={rememberMe}
                    bgColor={theme.colors.primary}
                    onChange={(e) => handleOnChangeRememberMe(e)}
                  />

                  <LoginOptionsText marginLeft={12}>
                    Lembrar de mim
                  </LoginOptionsText>
                </RememberMeContainer>
                <StyledLink to={paths.resetPassword}>
                  <LoginOptionsText color={theme.colors.primary}>
                    Esqueceu a senha?
                  </LoginOptionsText>
                </StyledLink>
              </LoginOptionsContainer>

              <Button
                btnType="loading"
                type="submit"
                value="Entrar"
                marginTop={16}
                bgColor={theme.colors.primary}
                disabled={checkButtonDisabled()}
                loading={loading}
              >
                Entrar
              </Button>
            </FormContainer>
          </AuthLeftContainerContent>
        )}
      </AuthLeftContainer>
    </AuthContainer>
  );
}
