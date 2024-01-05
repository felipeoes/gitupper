import { useState, useContext, Fragment } from "react";
import { useTheme } from "styled-components";
import AuthContext from "../../../contexts/auth";
import { capitalize } from "./../../../services/utils/functions";
import { paths } from "../../../services/utils/paths";

import ServicesModal from "../../../components/modal/Modal";
import { Topbar } from "../../../components/topbar/Topbar";
import { StyledLink } from "./../../non-auth/login/styles";
import Button from "./../../../components/button/Button";
import UnbindModal from "./unbindModal/UnbindModal";

import checkedCircle from "../../../assets/images/icons/checkedCircle.svg";
import { BsThreeDots } from "react-icons/bs";
import { MdAddCircleOutline } from "react-icons/md";
import IconButton from "@mui/material/IconButton";

import { currentPlatforms } from "./../../../services/utils/platforms";

import {
  BindContainer,
  BindContent,
  BindPlatforms,
  BindSubtitle,
  BindTextsContainer,
  BindTitle,
  StyledButton,
  BindIcon,
  DotsIconContainer,
  BindIconContainer,
  PlatformName,
} from "./styles";
import HorizontalList from "../../../components/horizontalList/HorizontalList";
import ErrorMessage from "./../../../components/errorMessage/ErrorMessage";
import LogoButton from "./../../../components/logoButton/LogoButton";
import Snackbar from "./../../../components/snackBar/Snackbar";

export default function Bind(props) {
  const theme = useTheme();
  const context = useContext(AuthContext);
  const { state } = context;
  const user = state.user;
  const [beecrowdModal, setBeecrowdModal] = useState(null);
  const [hackerrankModal, setHackerrankModal] = useState(null);
  const [leetcodeModal, setLeetcodeModal] = useState(null);
  const [unbindModal, setUnbindModal] = useState(null);
  const [unbindPlatform, setUnbindPlatform] = useState(null);
  const [errors, setErrors] = useState({ unbind: "" });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const modalsMap = {
    beecrowd: [beecrowdModal, setBeecrowdModal],
    hackerrank: [hackerrankModal, setHackerrankModal],
    leetcode: [leetcodeModal, setLeetcodeModal],
  };

  Object.keys(currentPlatforms).forEach((platform) => {
    currentPlatforms[platform].infos = {
      Nome: user.first_name + " " + user.last_name,
      Email: user.email,
      ID: user[`${currentPlatforms[platform].platformPrefix}_id`],
    };
    currentPlatforms[platform].modalFunction = modalsMap[platform][0];
    currentPlatforms[platform].setModalFunction = modalsMap[platform][1];
  });

  function isUserBinded() {
    return Object.keys(user).some(
      (key) =>
        !(key.includes("gitupper") || key.includes("github")) &&
        key.includes("_id") &&
        user[key] !== null
    );
  }

  function isUserBindedByPlatform(platformName) {
    const platformPrefix =
      currentPlatforms[platformName] &&
      currentPlatforms[platformName].platformPrefix;

    return user[`${platformPrefix}_id`];
  }

  function handleOnOpenModal(platform) {
    currentPlatforms[platform].modalFunction();
  }

  function handleOnOpenUnbindModal(platformName) {
    setUnbindPlatform(platformName);
    unbindModal();
  }

  async function handleOnUnbindPlatform(platformPrefix) {
    const response = await context.UnbindPlatform(user, platformPrefix);

    if (!response.error) {
      let updatedUser = user;
      updatedUser[response.data.platformPrefix + "_id"] = null;
      updatedUser[response.data.platformPrefix + "_submissions"] = null;

      setOpenSnackbar(true);

      context.dispatch({
        type: "LOGIN",
        payload: {
          user: updatedUser,
          isLoggedIn: true,
        },
      });
    }

    setErrors({ unbind: response.error });
  }

  async function handleOnLogout() {
    await context.Logout();
  }

  function ListItem({ platform }) {
    return (
      <StyledButton
        key={currentPlatforms[platform].platformPrefix}
        sx={{
          color: theme.colors.white,
          backgroundColor: theme.colors.extraWhite,
          margin: 2,
          border: 1,
          width: 200,
          height: 200,
        }}
        url={currentPlatforms[platform].url}
        onClick={() => handleOnOpenModal(platform)}
        disabled={isUserBindedByPlatform(platform)}
      >
        {isUserBindedByPlatform(platform) ? (
          <>
            <BindIconContainer>
              <BindIcon src={checkedCircle} alt="bind-check-circle" />
            </BindIconContainer>

            <DotsIconContainer className="dots-icon-container">
              <IconButton onClick={() => handleOnOpenModal(platform)}>
                <BsThreeDots size={28} />
              </IconButton>
            </DotsIconContainer>
          </>
        ) : (
          <BindIconContainer>
            <MdAddCircleOutline size={24} color={theme.colors.black60} />
          </BindIconContainer>
        )}
        <PlatformName color={currentPlatforms[platform].color}>
          {capitalize(platform)}
        </PlatformName>
      </StyledButton>
    );
  }

  return (
    <BindContainer>
      <Topbar
        nonAuth
        topbarButtonText="Sair"
        onClickButton={() => handleOnLogout()}
        IconElement={<LogoButton />}
      />

      <Snackbar
        active={openSnackbar}
        message="Conta desvinculada com sucesso!"
      />

      <BindTextsContainer>
        <BindTitle>Finalize a configuração da sua conta</BindTitle>
        <BindSubtitle>
          Para fazer upload de seus códigos, vincule sua conta com pelo menos
          uma das seguintes plataformas
        </BindSubtitle>
      </BindTextsContainer>

      <ServicesModal
        headless
        ModalContent={UnbindModal}
        onClick={() => handleOnUnbindPlatform(unbindPlatform)}
        setModalFunction={(f) => {
          setUnbindModal(f);
        }}
        platformName={unbindPlatform}
        platformColor={
          currentPlatforms[unbindPlatform] &&
          currentPlatforms[unbindPlatform].color
        }
      />

      <BindContent>
        <BindPlatforms>
          <HorizontalList
            scrollWidth={600}
            paddingRight={130}
            listProps={{
              isUserBindedByPlatform: isUserBindedByPlatform,
              currentPlatforms: currentPlatforms,
              handleOnOpenUnbindModal: handleOnOpenUnbindModal,
              handleOnOpenModal: handleOnOpenModal,
              capitalize: capitalize,
            }}
            CustomListItem={ListItem}
            itemsList={currentPlatforms}
            bindView
          />
        </BindPlatforms>
        <ErrorMessage error={errors.unbind} />

        <StyledLink
          to={!isUserBinded() ? "#" : paths.homepage}
          style={{ display: "block" }}
          disabled={!isUserBinded()}
        >
          <Button
            width={460}
            type="button"
            bgColor={theme.colors.primary}
            color={theme.colors.white}
            fontWeight="bold"
            disabled={!isUserBinded()}
          >
            Continuar
          </Button>
        </StyledLink>
        {!isUserBinded() && (
          <StyledLink
            fontSize={14}
            to={paths.homepage}
            width="auto"
            color={theme.colors.primary}
            marginTop={12}
          >
            Pular etapa
          </StyledLink>
        )}
      </BindContent>
    </BindContainer>
  );
}
