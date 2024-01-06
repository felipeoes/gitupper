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
import {
  getGithubUrlToken,
  handleOnLoginGithub,
} from "../../../../../services/utils/github/functions";

export default function BindView() {
  const [loading, setLoading] = useState(false);
  const context = useContext(AuthContext);
  const { client_id, redirect_uri } = context.state;
  const { dispatch } = context;
  const theme = useTheme();

  function handleOnClick() {}

  useEffect(() => {
    const url = window.location.href;
    const token = getGithubUrlToken(url);

    if (token) {
      handleOnLoginGithub(token, dispatch, context);
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
