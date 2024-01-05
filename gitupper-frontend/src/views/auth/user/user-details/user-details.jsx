import { useContext, useEffect } from "react";
import {
  MainUserDetailsContainer,
  UserInfoContainer,
  UserDetailsContainer,
  UserPhoto,
  UserPhotoText,
  UserPhotoTextContainer,
} from "./styles";
import { UserPhotoContainer } from "./styles";
import { MdCameraAlt } from "react-icons/md";
import AuthContext from "../../../../contexts/auth";

export default function UserDetails() {
  const { state } = useContext(AuthContext);
  const user = state.user;

  useEffect(() => {}, []);

  return (
    <MainUserDetailsContainer>
      <UserInfoContainer>
        <UserDetailsContainer>
          <UserPhotoContainer>
            <UserPhoto
              alt="userPicture"
              src={user.profile_image}
              className="user-photo"
            />

            <UserPhotoTextContainer>
              <MdCameraAlt color="#252733" className="camera-icon" />
              <UserPhotoText className="user-photo-text">
                Alterar foto
              </UserPhotoText>
            </UserPhotoTextContainer>
          </UserPhotoContainer>
        </UserDetailsContainer>
      </UserInfoContainer>
    </MainUserDetailsContainer>
  );
}
