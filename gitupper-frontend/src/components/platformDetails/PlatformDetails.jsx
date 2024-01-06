import { PlatformLogo } from "../../views/auth/bind/styles";
import {
  Container,
  BindMessage,
  PlatformDetailsContainer,
  PlatformInfo,
  PlatformLabel,
  PlatformText,
} from "./styles";
import Button from "./../button/Button";

export default function PlatformDetails({
  platformLogo,
  platformColor,
  infos,
  handleOnUnbindPlatform,
  loading,
}) {
  return (
    <Container>
      <PlatformLogo src={platformLogo} />

      <PlatformDetailsContainer>
        <BindMessage color={platformColor} marginTop={32}>
          Conta vinculada
        </BindMessage>

        {Object.keys(infos).map((info) => (
          <PlatformInfo>
            <PlatformLabel>{info}</PlatformLabel>
            <PlatformText>{infos[info]}</PlatformText>
          </PlatformInfo>
        ))}
      </PlatformDetailsContainer>

      <Button
        width={320}
        height={40}
        btnType="loading"
        type="button"
        border
        borderColor={platformColor}
        color={platformColor}
        fontFamily="InterMedium"
        fontWeight="500"
        marginTop={24}
        onClick={handleOnUnbindPlatform}
        loading={loading}
      >
        Desvincular conta
      </Button>
    </Container>
  );
}
