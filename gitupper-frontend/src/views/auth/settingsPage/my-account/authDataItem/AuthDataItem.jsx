import Button from "../../../../../components/button/Button";
import {
  AuthDataContainer,
  AuthDataItemContainer,
  AuthDataLabel,
  AuthDataText,
  InfoContainer,
} from "./styles";
import { useTheme } from "styled-components";
export default function AuthDataItem({ user }) {
  const theme = useTheme();
  return (
    <AuthDataContainer>
      <AuthDataItemContainer>
        <InfoContainer>
          <AuthDataLabel>Email</AuthDataLabel>
          <AuthDataText>{user.email}</AuthDataText>
        </InfoContainer>
        <Button
          type="button"
          bgColor={theme.colors.semiGray}
          width={216}
          marginRight={32}
          fontFamily="InterRegular"
        >
          Alterar email
        </Button>
      </AuthDataItemContainer>
      <AuthDataItemContainer paddingTop={"16px"} paddingBottom={"20px"}>
        <InfoContainer>
          <AuthDataLabel>Senha</AuthDataLabel>
          <AuthDataText>**************</AuthDataText>
        </InfoContainer>
        <Button
          type="button"
          bgColor={theme.colors.semiGray}
          width={216}
          marginRight={32}
          fontFamily="InterRegular"
        >
          Alterar senha
        </Button>
      </AuthDataItemContainer>
    </AuthDataContainer>
  );
}
