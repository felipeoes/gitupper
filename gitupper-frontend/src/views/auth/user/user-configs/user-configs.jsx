import { UserInfoContainer } from "./styles";
import { useEffect, useState } from "react";

export default function UserConfigs(props) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    props.refreshPage();
    setLoading(false);
  }, []);

  return (
    <UserInfoContainer>
      {loading ? <h3>CARREGANDO...</h3> : <h3>User configs aqui</h3>}
    </UserInfoContainer>
  );
}
