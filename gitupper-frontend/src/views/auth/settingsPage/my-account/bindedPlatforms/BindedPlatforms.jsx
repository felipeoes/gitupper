import { useTheme } from "styled-components";
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

export default function BindedPlatforms({ user }) {
  const bindedPlatforms = getBindedPlatforms(user);
  const theme = useTheme();

  function getBindedPlatforms(user) {
    const platforms = [];
    for (const key in currentPlatforms) {
      let platformPrefix = currentPlatforms[key].platformPrefix;
      if (user[platformPrefix + "_id"]) {
        platforms.push(currentPlatforms[key]);
      }
    }
    return platforms;
  }

  return (
    <BindedPlatformsContainer>
      <PlatformContainer>
        <PlatformDetailsContainer>
          <AppLogo width={50} src={githubLogo} alt={"github-logo"} />

          <InfoContainer marginLeft={12}>
            <AuthDataLabel>
              {user["github_id"] ? user["github_id"] : "Conta não vinculada"}
            </AuthDataLabel>
            <AuthDataText>Github</AuthDataText>
          </InfoContainer>
        </PlatformDetailsContainer>

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
        >
          Desvincular conta
        </Button>
      </PlatformContainer>

      <StyledDivider
        marginTop={24}
        marginBottom={24}
        width="100%"
        color="#C8C8C8"
      />
      {bindedPlatforms.map((platform, index) => (
        <PlatformContainer key={index}>
          <PlatformDetailsContainer>
            <AppLogo
              width={44}
              src={platform?.cleanIcon || platform.icon}
              alt={platform.platformPrefix + "_logo"}
            />

            <InfoContainer marginLeft={16}>
              <AuthDataLabel>
                {user[platform.platformPrefix + "_id"]}
              </AuthDataLabel>
              <AuthDataText>{platform.platformPrefix}</AuthDataText>
            </InfoContainer>
          </PlatformDetailsContainer>

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
          >
            Desvincular conta
          </Button>
        </PlatformContainer>
      ))}
    </BindedPlatformsContainer>
  );
}
