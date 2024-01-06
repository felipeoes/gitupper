import Button from "../../../../../components/button/Button";
import {
  ProfileImage,
  ProfileInfoContainer,
  ProfileNameContainer,
  ProfileName,
  ProfileID,
} from "./styles";
import { useTheme } from "styled-components";
import { IconButton } from "@mui/material";
import { MdEdit, MdAddPhotoAlternate } from "react-icons/md";
import { SubContainer } from "./../../styles";

export default function ProfileItem({ user }) {
  const theme = useTheme();
  function onClickButton() {
    console.log("click");
  }

  return (
    <SubContainer>
      <ProfileInfoContainer>
        <IconButton
          size="small"
          style={{
            position: "absolute",
            marginBottom: 60,
            marginLeft: 55,
            backgroundColor: theme.colors.white,
          }}
        >
          <MdAddPhotoAlternate size={24} color={theme.colors.black60} />
        </IconButton>
        <ProfileImage src={user.profile_image} alt="profile" />

        <ProfileNameContainer>
          <ProfileName>
            {user.first_name} {user.last_name}
            <IconButton
              sx={{
                marginBottom: "4px",
                marginLeft: 0.5,
              }}
            >
              <MdEdit size={24} />
            </IconButton>
          </ProfileName>
          <ProfileID>#ID {user.gitupper_id}</ProfileID>
        </ProfileNameContainer>
      </ProfileInfoContainer>

      <Button
        type="button"
        bgColor={theme.colors.primary}
        width={216}
        marginRight={64}
        // paddingRL={16}
        onClick={onClickButton}
      >
        Compartilhar perfil
      </Button>
    </SubContainer>
  );
}
