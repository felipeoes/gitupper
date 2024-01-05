import styled from "styled-components";
import SVG from "react-inlinesvg";

export const MainUserDetailsContainer = styled.div`
  display: flex;
  width: 100%;
  background: #f0f0f0;
  margin-right: 8rem;
  margin-top: 64px;
`;

export const UserDetailsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const UserPhotoContainer = styled.div`
  display: flex;
  align-items: center;
  height: 90px;
  width: 90px;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;

  :hover {
    background: rgba(0, 0, 0, 0.5);
    .user-photo {
      opacity: 0.4;
    }
  }
`;

export const UserPhoto = styled.img`
  width: 90px;
  height: 90px;
  border-radius: 50%;
`;

export const UserPhotoTextContainer = styled.div`
  position: absolute;
  width: 90px;
  height: 90px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;

  .camera-icon {
    opacity: 0;
    color: #ffffff;
    transition: opacity 0.2s, visibility 0.2s;
  }

  :hover {
    .user-photo-text,
    .camera-icon {
      visibility: visible;
      opacity: 1;
      z-index: 999;
    }
  }
`;

export const UserPhotoText = styled.p`
    font-family: MontserratLight;
    font-size: 14px;
    color: #3A3C40;
    cursor: pointer;
    color: #ffffff;

    margin-top: 0;
    opacity: 0;
    transition: opacity 0.2s, visibility 0.2s;
  }
`;

export const CameraIcon = styled(SVG)`
  width: 30px;
  height: 30px;
  border-radius: 70%;
  margin-top: 75px;
  z-index: 999;

  & path {
    fill: ${({ color }) => color};
    stroke: ${({ color }) => color};
  }
`;

export const UserInfoContainer = styled.div`
  height: 95%;
  width: 739px;
  background: #ffffff;

  box-shadow: 0px 7px 20px rgba(40, 41, 61, 0.08);
  border-radius: 8px;
  overflow: auto;
  margin: 20px 0px 0px;
`;
