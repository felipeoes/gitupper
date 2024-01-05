import { useContext } from "react";
import { SubPageContainer } from "../styles";
import ProfileItem from "./profileItem/ProfileItem";
import { ItemSubtitle, ItemTitle } from "./styles";

import AuthContext from "../../../../contexts/auth";
import AuthDataItem from "./authDataItem/AuthDataItem";
import BindedPlatforms from "./bindedPlatforms/BindedPlatforms";

export default function MyAccount() {
  const { state } = useContext(AuthContext);
  const user = state.user;

  return (
    <SubPageContainer>
      <ItemTitle>Perfil</ItemTitle>
      <ProfileItem user={user} />

      <ItemTitle marginTop="32px">Meus dados</ItemTitle>
      <AuthDataItem user={user} />

      <ItemTitle marginTop="32px" marginBottom={"0px"}>
        Plataformas vinculadas
      </ItemTitle>
      <ItemSubtitle>
        Utilizamos as suas contas para integrar suas submissões com o GitHub.
      </ItemSubtitle>

      <BindedPlatforms user={user} />
    </SubPageContainer>
  );
}
