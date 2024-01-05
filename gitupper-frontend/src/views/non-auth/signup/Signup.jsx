import { useState, useEffect, useContext } from "react";
import { useTheme } from "styled-components";
import {
  AuthContainer,
  LoginOrRegisterMessage,
  LoginContainerDividerText,
  FormContainer,
  GithubOauthLink,
  StyledLink,
  AuthLeftContainerHeaderSubtitle,
  AuthLeftContainer,
  AuthLeftContainerHeader,
  AuthLeftContainerContent,
} from "./../login/styles";
import { NameInputContainer } from "./styles";

import IconButton from "@mui/material/IconButton";
import logo from "../../../assets/images/logos/black_logo_GITUPPER.svg";
import { FRONT_BASEURL } from "../../../services/api.js";
import AuthContext from "../../../contexts/auth";
import Button from "./../../../components/button/Button";
import Input from "./../../../components/input/Input";
import { Topbar } from "../../../components/topbar/Topbar";

import { paths } from "../../../services/utils/paths";
import { GitHubIcon, passwordRequirements } from "../login/Login";
import ErrorMessage from "./../../../components/errorMessage/ErrorMessage";
import { checkLoginState } from "./../login/Login";
import LogoButton from "./../../../components/logoButton/LogoButton";

export default function Signup() {
  const theme = useTheme();
  const context = useContext(AuthContext);
  const { client_id, redirect_uri } = context.state;
  const { state, dispatch } = context;

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [disabledForm, setDisabledForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    password1: "",
    password2: "",
    firstName: "",
    lastName: "",
  });

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
  }, [state, dispatch, context]);

  checkLoginState(state);

  function checkButtonDisabled() {
    const value = !email || !password1 || !password2 || !firstName || !lastName;
    return value;
  }

  function resetFormOnError(errors) {
    if (errors.email) {
      setErrors({ email: errors.email[0] });
    }

    if (errors.password) {
      setErrors({ password: errors.password });
    }

    !(errors.register || errors.email) &&
      setErrors({ email: errors, password: errors });

    localStorage.clear();
    setLoading(false);
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    let registerData = new FormData();

    registerData.append("first_name", firstName);
    registerData.append("last_name", lastName);
    registerData.append("password", password1);
    registerData.append("password2", password2);
    registerData.append("email", email);
    registerData.append("profile_image", "");
    registerData.append("github_id", "");

    const response = await context.Register(registerData);

    if (response.status === 201) {
      const user = response.data.user;

      dispatch({
        type: "LOGIN",
        payload: {
          user: user,
          isLoggedIn: true,
          gitupper_token: response.data.key,
        },
      });
    } else {
      resetFormOnError(response.data);
    }

    setDisabledForm(false);
  };

  function handleOnSubmit(e) {
    setLoading(true);

    setDisabledForm(true);
    onSubmit(e);
  }

  function handleOnCheckPassword(password, first) {
    let strongPassword = passwordRequirements(password);
    if (first) {
      password && !strongPassword
        ? setErrors({ ...errors, password1: "Mínimo de 6 caracteres!" })
        : setErrors({ ...errors, password1: "" });
    } else {
      password && !strongPassword
        ? setErrors({ ...errors, password2: "Mínimo de 6 caracteres!" })
        : setErrors({ ...errors, password2: "" });
    }
  }

  return (
    <AuthContainer>
      <Topbar
        nonAuth
        topbarButtonText="Fazer login"
        toPath={paths.login}
        IconElement={<LogoButton />}
      />
      <AuthLeftContainer>
        <AuthLeftContainerHeader>
          <LoginOrRegisterMessage>
            Criar uma conta ou
            <StyledLink inline to={paths.login}>
              {" "}
              fazer login
            </StyledLink>
          </LoginOrRegisterMessage>
          <AuthLeftContainerHeaderSubtitle>
            Crie sua conta para fazer upload do seu código no GitHub
          </AuthLeftContainerHeaderSubtitle>
        </AuthLeftContainerHeader>

        <AuthLeftContainerContent>
          <GithubOauthLink
            href={`https://github.com/login/oauth/authorize?scope=user&client_id=${client_id}&redirect_uri=${redirect_uri}`}
            onClick={() => {
              setLoading(true);
            }}
            rel="noreferrer"
          >
            <Button
              Icon={GitHubIcon}
              iconSize={24}
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

          <FormContainer onSubmit={handleOnSubmit} autoComplete="off">
            <NameInputContainer>
              <Input
                placeholder="Digite seu nome"
                autoFocus
                name="firstName"
                type="text"
                label="Nome"
                value={firstName}
                required
                width="220px"
                onChange={(e) => setFirstName(e.target.value)}
                error={errors.firstName}
                disabled={disabledForm}
                borderColor={theme.colors.disabledButton}
              />
              <ErrorMessage error={errors.firstName} />

              <Input
                placeholder="Digite seu sobrenome"
                name="lastName"
                type="text"
                label="Sobrenome"
                value={lastName}
                required
                width="220px"
                onChange={(e) => setLastName(e.target.value)}
                error={errors.lastName}
                disabled={disabledForm}
                borderColor={theme.colors.disabledButton}
              />
            </NameInputContainer>

            <Input
              placeholder="Digite seu email"
              type="email"
              name="email"
              label="Email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              disabled={disabledForm}
              borderColor={theme.colors.disabledButton}
            />

            <ErrorMessage error={errors.email} />

            <Input
              placeholder="Digite sua senha"
              type="password"
              name="password"
              label="Senha"
              value={password1}
              required
              onChange={(e) => {
                setPassword1(e.target.value);
                handleOnCheckPassword(e.target.value, true);
              }}
              error={errors.password || errors.password1}
              disabled={disabledForm}
              borderColor={theme.colors.disabledButton}
            />
            <ErrorMessage error={errors?.password1} />
            <Input
              placeholder="Confirme sua senha"
              type="password"
              name="password"
              label="Confirmar senha"
              value={password2}
              required
              onChange={(e) => {
                setPassword2(e.target.value);
                handleOnCheckPassword(e.target.value);
              }}
              error={errors.password || errors.password2}
              disabled={disabledForm}
              borderColor={theme.colors.disabledButton}
            />
            <ErrorMessage error={errors.password || errors?.password2} />

            <Button
              btnType="loading"
              type="submit"
              value="Cadastrar"
              bgColor={theme.colors.primary}
              marginTop={32}
              marginBottom={16}
              disabled={checkButtonDisabled() || loading}
              loading={loading}
            >
              Cadastrar
            </Button>
          </FormContainer>
        </AuthLeftContainerContent>
      </AuthLeftContainer>
    </AuthContainer>
  );
}
