import { useContext } from "react";
import { AuthContext } from "../../contexts";
import {
  ColoredText,
  Container,
  ContainerContent,
  ContainerButton,
  ContainerText,
  ContainerTitle,
} from "./styles";
import { useTheme } from "styled-components";
import Button from "../button/Button";

export default function NotBind({ platform }) {
  const { user } = useContext(AuthContext);
  const theme = useTheme();

  return (
    <Container>
      <ContainerTitle>Olá, {user.first_name}</ContainerTitle>
      <ContainerContent>
        <ContainerText>
          Para começar a utilizar o{" "}
          <ColoredText color={theme.colors.black80}>GIT</ColoredText>{" "}
          <ColoredText>UPPER</ColoredText> , é necessário a vinculação de alguma
          das plataformas que são compatíveis com o nosso sistema, saiba mais!
          Após a vinculação, você verá as suas submissões aqui nesta página e
          poderá baixar ou fazer upload para o GitHub.
        </ContainerText>

        <ContainerButton>
          <Button
            type="button"
            bgColor={theme.colors.primary}
            width={256}
            onClick={() => {}}
            marginTop={40}
          >
            Vincular {platform.name}
          </Button>
        </ContainerButton>
      </ContainerContent>
    </Container>
  );
}
