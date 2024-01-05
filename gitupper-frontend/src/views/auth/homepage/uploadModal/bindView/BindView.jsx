import { useState, useContext, useEffect } from "react";
import { useTheme } from "styled-components";
import Button from "../../../../../components/button/Button";

import { PlatformLogo } from "./../../../bind/styles";
import { BindViewText } from "../bindView/styles";

import githubLogo from "./../../../../../assets/images/logos/githubLogo.svg";
import { PlatformDetailsContainer } from "./../../../../../components/platformDetails/styles";
import AuthContext from "../../../../../contexts/auth";
import { GithubOauthLink } from "../../../../non-auth/login/styles";
import { Container, BindMessage } from "../../../platforms/styles";

export default function BindView() {
  const [loading, setLoading] = useState(false);
  const context = useContext(AuthContext);
  const { client_id, redirect_uri } = context.state;
  const { dispatch } = context;
  const theme = useTheme();

  function handleOnClick() {}

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
        console.log(error);
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
  }, [dispatch, context]);

  return (
    <Container>
      <PlatformLogo src={githubLogo} />

      <PlatformDetailsContainer>
        <BindMessage color={theme.colors.black}>Vincular conta</BindMessage>
        <BindViewText>
          Para fazer upload de suas submissões ao GitHub, vincule uma conta.
        </BindViewText>
      </PlatformDetailsContainer>

      <GithubOauthLink
        href={`https://github.com/login/oauth/authorize?scope=user,repo&client_id=${client_id}&redirect_uri=${redirect_uri}`}
        onClick={() => {
          setLoading(true);
        }}
        rel="noreferrer"
      >
        <Button
          btnType="loading"
          width={320}
          type="button"
          bgColor={theme.colors.primary}
          color={theme.colors.white}
          marginTop={36}
          marginBottom={42}
          onclick={handleOnClick}
          loading={loading}
        >
          Vincular conta
        </Button>
      </GithubOauthLink>
    </Container>
  );
}
