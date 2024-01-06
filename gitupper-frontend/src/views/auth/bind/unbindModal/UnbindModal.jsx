import { useTheme } from "styled-components";
import { BindSubtitle, BindTitle } from "../styles";
import { Container, PlatformName, ButtonsContainer } from "./styles";
import Button from "./../../../../components/button/Button";
export default function UnbindModal(props) {
  const theme = useTheme();

  function capitalize(platformName) {
    return platformName.charAt(0).toUpperCase() + platformName.slice(1);
  }

  return (
    <Container>
      <BindSubtitle>
        Sua conta da plataforma
        <PlatformName platformColor={props.platformColor}>
          {" "}
          {capitalize(props.platformName)}
        </PlatformName>{" "}
        será desvinculada e você não poderá mais acessar suas submissões até que
        você vincule uma nova conta. Deseja prosseguir?
      </BindSubtitle>

      <ButtonsContainer>
        <Button
          type="button"
          bgColor="transparent"
          color={theme.colors.black}
          border
          borderColor={props.platformColor || theme.colors.black}
          onClick={props.onClick}
          width={256}
        >
          Sim, desvincular
        </Button>
        <Button
          type="button"
          bgColor={props.platformColor || theme.colors.black}
          width={256}
          onClick={props.handleOnClose}
        >
          Não, manter vinculada
        </Button>
      </ButtonsContainer>
    </Container>
  );
}
