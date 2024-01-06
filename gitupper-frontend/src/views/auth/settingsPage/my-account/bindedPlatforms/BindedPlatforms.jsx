import { useState, useContext, useEffect } from "react";
import { useTheme } from "styled-components";

import { AuthContext } from "../../../../../contexts/";

import {
  BindedPlatformsContainer,
  PlatformContainer,
  PlatformDetailsContainer,
} from "./styles";

import { currentPlatforms } from "../../../../../services/utils/platforms";
import { AppLogo } from "../../../../../components/logoButton/styles";
import githubLogo from "../../../../../assets/images/logos/githubLogo.svg";

import {
  AuthDataLabel,
  AuthDataText,
  InfoContainer,
} from "../authDataItem/styles";

import { StyledDivider } from "../../../../../components/sidebar/styles";
import Button from "../../../../../components/button/Button";
import { capitalize } from "../../../../../services/utils/functions";
import ServicesModal from "../../../../../components/modal/Modal";
import PlatformBind from "../../../platforms/PlatformBind";
import UnbindModal from "../../../../../views/auth/bind/unbindModal/UnbindModal";
import Snackbar from "../../../../../components/snackBar/Snackbar";
import { IconButton } from "@mui/material";
import PlatformDetails from "../../../../../components/platformDetails/PlatformDetails";
import { GithubOauthLink } from "../../../../non-auth/login/styles";
import {
  getGithubUrlToken,
  handleOnLoginGithub,
} from "../../../../../services/utils/github/functions";

export default function BindedPlatforms({ user }) {
  const [unbindModal, setUnbindModal] = useState(null);
  const [unbindPlatform, setUnbindPlatform] = useState(null);
  const [beecrowdModal, setBeecrowdModal] = useState(null);
  const [hackerrankModal, setHackerrankModal] = useState(null);
  const [leetcodeModal, setLeetcodeModal] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(false);

  const context = useContext(AuthContext);
  const theme = useTheme();

  const githubUser = user.github_user;
  const bindedPlatforms = user.platforms_users;
  const dispatch = context.dispatch;

  const { client_id } = context.state;

  useEffect(() => {
    const url = window.location.href;
    const token = getGithubUrlToken(url);

    if (token) {
      handleOnLoginGithub(token, context, dispatch);
    }
  }, [dispatch, context]);

  // get current url from window
  const redirect_uri = `${window.location.origin}/settings`;

  console.log(user);

  function getPlatformID(platformName) {
    const platformPrefix = currentPlatforms[platformName].platformPrefix;
    if (!bindedPlatforms.hasOwnProperty(platformPrefix)) return null;

    return bindedPlatforms[`${platformPrefix}`][`${platformPrefix}_id`];
  }

  const modalsMap = {
    beecrowd: [beecrowdModal, setBeecrowdModal],
    hackerrank: [hackerrankModal, setHackerrankModal],
    leetcode: [leetcodeModal, setLeetcodeModal],
  };

  Object.keys(currentPlatforms).forEach((platform) => {
    currentPlatforms[platform].infos = {
      Nome: user.first_name + " " + user.last_name,
      Email: user.email,
      ID: getPlatformID(platform),
    };
    currentPlatforms[platform].modalFunction = modalsMap[platform][0];
    currentPlatforms[platform].setModalFunction = modalsMap[platform][1];
  });

  function handleOnOpenUnbindModal(platformName) {
    setUnbindPlatform(platformName);
    unbindModal();
  }
  function isBinded(platformPrefix) {
    if (!bindedPlatforms) {
      return false;
    }

    return Object.keys(bindedPlatforms).some((platform) => {
      return platform === platformPrefix;
    });
  }

  function tokenIsUpdated(platformPrefix) {
    return Object.keys(bindedPlatforms).some((platform) => {
      return (
        platform === platformPrefix &&
        !bindedPlatforms[platformPrefix]?.token_expired
      );
    });
  }

  function handleOnOpenModal(platform) {
    currentPlatforms[platform].modalFunction();
  }

  async function handleOnUnbindPlatform(platformPrefix) {
    const response = await context.UnbindPlatform(user, platformPrefix);

    if (!response.error) {
      const updatedUser = response.data.user;
      // let updatedPlatformsUsers = platforms_users;

      // delete updatedPlatformsUsers[platformPrefix];
      // updatedUser.platforms_users = updatedPlatformsUsers;

      // updatedUser[response.data.platformPrefix + "_id"] = null;
      // updatedUser[response.data.platformPrefix + "_submissions"] = null;

      setOpenSnackbar(true);

      context.dispatch({
        type: "LOGIN",
        payload: {
          user: updatedUser,
          isLoggedIn: true,
        },
      });
    }

    // setErrors({ unbind: response.error });
  }

  return (
    <BindedPlatformsContainer>
      <ServicesModal
        headless
        headerTitle="Deseja mesmo desvincular sua conta?"
        ModalContent={UnbindModal}
        onClick={() => handleOnUnbindPlatform(unbindPlatform)}
        setModalFunction={(f) => {
          setUnbindModal(f);
        }}
        platformName={unbindPlatform}
        platformColor={
          currentPlatforms[unbindPlatform] &&
          currentPlatforms[unbindPlatform].color
        }
      />

      <Snackbar
        active={openSnackbar}
        message="Conta desvinculada com sucesso!"
      />
      <PlatformContainer>
        <PlatformDetailsContainer>
          <AppLogo width={50} src={githubLogo} alt={"github-logo"} />

          <InfoContainer marginLeft={12}>
            <AuthDataLabel>
              {githubUser?.github_id
                ? githubUser["github_id"]
                : "Conta não vinculada"}
            </AuthDataLabel>
            <AuthDataText>Github</AuthDataText>
          </InfoContainer>
        </PlatformDetailsContainer>

        {githubUser?.github_id ? (
          <Button
            type="button"
            variant="outlined"
            bgColor="transparent"
            border
            borderColor={theme.colors.red}
            color={theme.colors.red}
            width={216}
            marginRight={32}
            fontWeight={400}
            onClick={() => handleOnOpenUnbindModal("github")}
          >
            Desvincular conta
          </Button>
        ) : (
          <GithubOauthLink
            href={`https://github.com/login/oauth/authorize?scope=user,repo&client_id=${client_id}&redirect_uri=${redirect_uri}`}
            onClick={() => {
              setLoading(true);
            }}
            rel="noreferrer"
          >
            <Button
              btnType="loading"
              width={216}
              type="button"
              bgColor={theme.colors.primary}
              color={theme.colors.white}
              // marginTop={36}
              marginRight={32}
              // marginBottom={42}
              // onclick={handleOnClick}
              loading={loading}
            >
              Vincular conta
            </Button>
          </GithubOauthLink>

          // <Button
          //   type="button"
          //   bgColor={theme.colors.black}
          //   color={theme.colors.white}
          //   marginRight={32}
          //   fontWeight={400}
          //   variant="outlined"
          //   width={216}
          //   onClick={() => handleOnOpenModal("github")}
          // >
          //   Vincular conta
          // </Button>
        )}
      </PlatformContainer>
      <StyledDivider marginTop={24} width="100%" color="#C8C8C8" />
      {Object.keys(currentPlatforms).map((platform, index) => (
        <PlatformContainer key={index}>
          {console.log(
            "tokenIsUpdated",
            tokenIsUpdated(currentPlatforms[platform].platformPrefix)
          )}
          <ServicesModal
            headless
            ModalContent={
              isBinded(currentPlatforms[platform].platformPrefix) &&
              tokenIsUpdated(currentPlatforms[platform].platformPrefix)
                ? PlatformDetails
                : PlatformBind
            }
            modalProps={{
              platformResetPath: currentPlatforms[platform].resetPath,
              platformPrefix: currentPlatforms[platform].platformPrefix,
              platformLogo: currentPlatforms[platform].icon,
              platformColor: theme.colors[`${platform}Primary`],
              infos: currentPlatforms[platform].infos,
              handleOnUnbindPlatform: () => handleOnOpenUnbindModal(platform),
            }}
            setModalFunction={(f) => {
              currentPlatforms[platform].setModalFunction(f);
            }}
          />
          <PlatformDetailsContainer>
            <IconButton onClick={() => handleOnOpenModal(platform)}>
              <AppLogo
                width={44}
                src={currentPlatforms[platform].cleanIcon}
                alt={currentPlatforms[platform].platformPrefix + "_logo"}
              />
            </IconButton>

            <InfoContainer marginLeft={16}>
              <AuthDataLabel>
                {isBinded(currentPlatforms[platform].platformPrefix)
                  ? bindedPlatforms[currentPlatforms[platform].platformPrefix][
                      currentPlatforms[platform].platformPrefix + "_id"
                    ]
                  : "Conta não vinculada"}
              </AuthDataLabel>
              <AuthDataText color={currentPlatforms[platform].color}>
                {capitalize(platform)}
              </AuthDataText>
            </InfoContainer>
          </PlatformDetailsContainer>

          {isBinded(currentPlatforms[platform].platformPrefix) ? (
            <Button
              type="button"
              variant="outlined"
              bgColor="transparent"
              border
              borderColor={theme.colors.red}
              color={theme.colors.red}
              width={180}
              marginRight={32}
              fontWeight={400}
              onClick={() =>
                tokenIsUpdated(currentPlatforms[platform].platformPrefix)
                  ? handleOnOpenUnbindModal(platform)
                  : handleOnOpenModal(platform)
              }
            >
              {tokenIsUpdated(currentPlatforms[platform].platformPrefix)
                ? "Desvincular conta"
                : "Atualizar token"}
            </Button>
          ) : (
            <Button
              type="button"
              // border
              bgColor={theme.colors.black}
              // borderColor={theme.colors.black80}
              color={theme.colors.white}
              width={180}
              marginRight={32}
              fontWeight={400}
              onClick={() => handleOnOpenModal(platform)}
            >
              Vincular conta
            </Button>
          )}
        </PlatformContainer>
      ))}
    </BindedPlatformsContainer>
  );
}
