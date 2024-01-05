/* eslint-disable no-useless-escape */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useContext, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTheme } from "styled-components";

import {
  AuthContainer,
  LoginOrRegisterMessage,
  FormContainer,
  StyledLink,
  AuthLeftContainerHeaderSubtitle,
  AuthLeftContainer,
  AuthLeftContainerHeader,
  AuthLeftContainerContent,
} from "./../login/styles";

import { FRONT_BASEURL } from "../../../services/api.js";
import { Topbar } from "./../../../components/topbar/Topbar";
import { MdArrowBack } from "react-icons/md";
import AuthContext from "../../../contexts/auth";
import Button from "./../../../components/button/Button";
import Input from "./../../../components/input/Input";
import ErrorMessage from "./../../../components/errorMessage/ErrorMessage";
import { paths } from "./../../../services/utils/paths";
import LogoButton from "./../../../components/logoButton/LogoButton";

import {
  ResponseContainer,
  ResponseContainerText,
  ResponseTextContainer,
} from "./styles";

export default function ResetPassword() {
  const [resetInput, setResetInput] = useState({
    email: "",
    token: "",
    password1: "",
    password2: "",
  });
  const [user, setUser] = useState({});
  const { state, dispatch } = useContext(AuthContext);
  const [disabledForm, setDisabledForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({
    title: "",
    message: "",
    status: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    token: "",
  });
  const [content, setContent] = useState({
    view: "email",
    title: "Recuperação de senha",
    subtitle:
      "Enviaremos um código para o email informado abaixo para que você possa recuperar sua senha.",
    buttonTitle: "Enviar código",
    placeholder: "Digite seu email",
    inputType: "email",
    inputName: "email",
    inputLabel: "Email",
    error: errors.email,
    handleOnSubmit: handleOnSubmit,
  });

  const tokenContent = {
    view: "token",
    title: "Recuperação de senha",
    subtitle:
      "",
    buttonTitle: "Validar",
    placeholder: "Digite o código",
    inputType: "text",
    inputName: "token",
    inputLabel: "Código",
    error: errors.token,
    handleOnSubmit: handleOnSubmitToken,
  };

  const resetPassContent = {
    view: "reset",
    title: "Recuperar senha",
    subtitle: "Insira sua nova senha nos campos abaixo.",
    buttonTitle: "Alterar senha",
    placeholder: "Digite sua nova senha",
    inputType: "password",
    inputName: "password1",
    inputLabel: "Senha",
    error: errors.password,
  };

  const [searchParams] = useSearchParams();
  const context = useContext(AuthContext);
  const theme = useTheme();

  useEffect(() => {
    async function handleOnCheckHasToken() {
      const token = searchParams.get("token");

      if (token) {
        await handleOnProcessTokenView(token);
      }

    }
    handleOnCheckHasToken();
  }, []);

  function handleOnChangeInput(e) {
    const { value, name } = e.target;

    if (name === "email") {
      setResetInput({ email: value });
    }
    if (name === "token") {
      setResetInput({ token: value.toUpperCase() });
    }
    if (name === "password1") {
      setResetInput((prevState) => ({
        ...prevState,
        password1: value,
      }));
    }
    if (name === "password2") {
      setResetInput((prevState) => ({
        ...prevState,
        password2: value,
      }));
    }

    setErrors({ email: "", token: "", password1: "", password2: "" });
  }

  function checkButtonDisabled() {
    const value = loading || !resetInput.email;
    return value;
  }

  function checkTokenButtonDisabled() {
    const value = loading || !resetInput.token;
    return value;
  }

  function checkResetButtonDisabled() {
    const value = loading || !resetInput.password1 || !resetInput.password2;
    return value;
  }

  function resetFormOnError(errors) {
    if (errors.email) {
      setErrors({ email: errors.email });
    }

    if (errors.token) {
      setErrors({ token: errors.token });
    }

    localStorage.clear();
    setLoading(false);
  }

  async function handleOnProcessEmailView() {
    const response = await context.ResetPassword(resetInput.email);

    setTimeout(() => {
      if (response.status === 200 && response.data) {
        const data = response.data;

        setResetInput({ email: "" });
        setContent(tokenContent);
        setResponse({
          title: data.title,
          message: data.message,
          status: data.status,
        });
      } else {
        resetFormOnError(response.data);
      }

      setLoading(false);
      setDisabledForm(false);
    }, 500);
  }

  async function handleOnProcessTokenView(token = "") {
    const data = {
      token: resetInput.token || token,
    };

    const response = await context.ValidateResetToken(data);

    setTimeout(() => {
      if (response.status === 200 && response.data.success) {
        const data = response.data;

        setUser(data.user);
        setResetInput({ token: "" });
        setContent(resetPassContent);
        setResponse({
          title: data.title,
          message: data.message,
          status: data.status,
        });
      } else {
        resetFormOnError(response.data);
        setResponse({
          title: "Token inválido",
          message:
            "O código digitado é inválido. Por favor, verifique o código recebido no email e tente novamente!",
          status: "error",
        });
      }

      setLoading(false);
      setDisabledForm(false);
    }, 2000);
  }

  if (state.isLoggedIn) {
    window.location.replace(`${FRONT_BASEURL}/bind`);
  }

  async function handleOnProcessResetView() {
    // resetando a senha conforme input do usuário
    const data = {
      token: user.key || resetInput.token,
      email: user.email || resetInput.email,
      new_password0: resetInput.password1,
      new_password1: resetInput.password2,
    };

    const response = await context.ChangePassword(data);

    if (response.status === 200 && response.data.success) {
      const new_data = {
        email: data.email,
        password: data.new_password0,
      };

      const res = await context.Login(new_data);

      setTimeout(() => {
        if (res.status === 200) {
          const user = res.data.user;

          dispatch({
            type: "LOGIN",
            payload: {
              user: user,
              isLoggedIn: true,
              gitupper_token: res.data.key,
            },
          });
        } else {
          resetFormOnError(res.data);
        }

        setLoading(false);
        setDisabledForm(false);
      }, 2000);
    } else {
      resetFormOnError(response.data);
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    content.view === "email"
      ? await handleOnProcessEmailView()
      : await handleOnProcessTokenView();
  };

  const onSubmitReset = async (e) => {
    e.preventDefault();

    await handleOnProcessResetView();
  };

  function handleOnSubmitToken(e) {
    setLoading(true);
    setDisabledForm(true);

    if (!checkTokenButtonDisabled() && resetInput.token) {
      onSubmit(e);
    } else {
      e.preventDefault();

      setTimeout(() => {
        setErrors({ token: "Token inválido" });
        setResponse({
          title: "Token inválido",
          message:
            "O código digitado é inválido. Por favor, verifique o código recebido no email e tente novamente!",
          status: "error",
        });

        setLoading(false);
        setDisabledForm(false);
      }, 500);
    }
  }
  
  function handleOnSubmit(e) {
    setLoading(true);
    setDisabledForm(true);

    onSubmit(e);
  }

  function handleOnSubmitReset(e) {
    setLoading(true);
    setDisabledForm(true);

    if (!(resetInput.password1 !== resetInput.password2)) {
      onSubmitReset(e);
    } else {
      e.preventDefault();

      setTimeout(() => {
        setErrors({ password1: "Senhas não conferem" });
        setResponse({
          title: "Senhas não conferem",
          message:
            "As senhas digitadas não conferem, por favor verifique as senhas e tente novamente!",
          status: "error",
        });

        setLoading(false);
        setDisabledForm(false);
      }, 500);
    }
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
          <LoginOrRegisterMessage>{content.title}</LoginOrRegisterMessage>
          <AuthLeftContainerHeaderSubtitle>
            {content.subtitle}
          </AuthLeftContainerHeaderSubtitle>
        </AuthLeftContainerHeader>

        <ResponseContainer
          error={
            (resetInput.email && errors.email) || response.status === "error"
          }
          success={response.status === "success"}
        >
          {resetInput.email && errors.email ? (
            <ResponseTextContainer>
              <ResponseContainerText
                fontFamily="InterSemiBold"
                fontWeight="600"
                color={theme.colors.blackLight}
              >
                Email não cadastrado em nossa base de dados
              </ResponseContainerText>
              <ResponseContainerText marginTop={8}>
                O email informado não está cadastrado em nossa base de dados.
                Informe outro email e tente novamente!
              </ResponseContainerText>
            </ResponseTextContainer>
          ) : (
            <ResponseTextContainer
              error={
                (resetInput.token && errors.token) ||
                response.status === "error"
              }
              success={response.status === "success"}
            >
              <ResponseContainerText
                fontFamily="InterSemiBold"
                fontWeight="600"
              >
                {response.title}
                <ResponseContainerText marginTop={8}>
                  {response.message}
                </ResponseContainerText>
              </ResponseContainerText>
            </ResponseTextContainer>
          )}
        </ResponseContainer>

        <AuthLeftContainerContent>
          {content.view === "reset" ? (
            <FormContainer onSubmit={handleOnSubmitReset} autoComplete="off">
              <Input
                placeholder={content.placeholder}
                type={content.inputType}
                name={content.inputName}
                label={content.inputLabel}
                value={resetInput.password1}
                required
                onChange={(e) => handleOnChangeInput(e)}
                error={content.error}
                disabled={disabledForm}
                borderColor={theme.colors.disabledButton}
              />

              <Input
                placeholder="Confirme sua senha"
                type={content.inputType}
                name="password2"
                label="Confirmar senha"
                value={resetInput.password2}
                required
                lblTop={24}
                onChange={(e) => handleOnChangeInput(e)}
                error={content.error}
                disabled={disabledForm}
                borderColor={theme.colors.disabledButton}
              />

              <Button
                btnType="loading"
                type="submit"
                bgColor={theme.colors.primary}
                marginTop={32}
                disabled={checkResetButtonDisabled()}
                loading={loading}
              >
                {content.buttonTitle}
              </Button>
            </FormContainer>
          ) : (
            <FormContainer
              onSubmit={
                content.view === "email" ? handleOnSubmit : handleOnSubmitToken
              }
              autoComplete="off"
            >
              <Input
                placeholder={content.placeholder}
                type={content.inputType}
                name={content.inputName}
                label={content.inputLabel}
                value={
                  content.view === "email" ? resetInput.email : resetInput.token
                }
                lblTop={24}
                required
                onChange={(e) => handleOnChangeInput(e)}
                error={content.error}
                disabled={disabledForm}
                borderColor={theme.colors.disabledButton}
              />
              <ErrorMessage error={content.error} />

              <Button
                btnType="loading"
                type="submit"
                bgColor={theme.colors.primary}
                marginTop={32}
                disabled={
                  content.view === "email"
                    ? checkButtonDisabled()
                    : checkTokenButtonDisabled()
                }
                loading={loading}
              >
                {content.buttonTitle}
              </Button>

              {content.view === "email" && (
                <StyledLink
                  fontSize={14}
                  to={paths.login}
                  width="auto"
                  color={theme.colors.black60}
                  marginTop={28}
                >
                  <MdArrowBack
                    size={24}
                    color={theme.colors.black60}
                    style={{ marginRight: 8 }}
                  />
                  Voltar para o login
                </StyledLink>
              )}
            </FormContainer>
          )}
        </AuthLeftContainerContent>
      </AuthLeftContainer>
    </AuthContainer>
  );
}
