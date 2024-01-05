import React, {
  useState,
  forwardRef,
  useImperativeHandle,
  useEffect,
} from "react";
import { styled } from "@mui/system";
import { useTheme } from "styled-components";
import ModalUnstyled from "@mui/base/ModalUnstyled";
import Fade from "@mui/material/Fade";

import { MdClose } from "react-icons/md";

import {
  ModalCloseButtonContainer,
  ModalContainer,
  ModalContentContainer,
  ModalHeader,
  ModalHeaderTab,
  ModalHeaderTabContainer,
  ModalHeaderTabDivider,
  ModalHeaderTabTitle,
  ModalTitle,
} from "./styles";
import { IconButton } from "@mui/material";

const StyledModal = styled(ModalUnstyled)`
  position: fixed;
  z-index: 1300;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(47, 45, 45, 0.5);
`;

const Backdrop = styled("div")`
  z-index: -1;
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background-color: rgba(47, 45, 45, 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const ServicesModal = forwardRef((props, ref) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleClose = () => {
    if (!loading) {
      setOpen(false);
    }
  };

  var ModalContent = props.ModalContent;
  var modalProps = props.modalProps;
  var item = props.item ? props.item : null;
  const jumpPage = props.jumpPage ? props.jumpPage : null;
  const updateItem = props.updateItem ? props.updateItem : null;

  const headless = props.headless ? props.headless : false;

  useImperativeHandle(ref, () => ({
    handleOpen() {
      setOpen(true);
    },
  }));

  useEffect(() => {
    props.setModalFunction(() => handleOpen);
  }, []);

  function handleOpen() {
    setOpen(true);
  }

  return (
    <StyledModal
      keepMounted={props.keepMounted || loading}
      sx={{
        "&	.MuiModal-root": {
          transition: "transform 10s ease-in-out",
        },
      }}
      aria-labelledby="unstyled-modal-title"
      aria-describedby="unstyled-modal-description"
      open={open}
      onClose={handleClose}
      BackdropComponent={Backdrop}
    >
      <Fade in={open} timeout={300}>
        <ModalContainer>
          <ModalHeader>
            <IconButton
              onClick={handleClose}
              style={{ marginRight: 14, marginTop: 14 }}
            >
              <MdClose size={24} color={theme.colors.black60} />
            </IconButton>

            {props.headerTitle && <ModalTitle>{props.headerTitle}</ModalTitle>}
            {!headless &&
              {
                /* <ModalHeaderTabContainer>
                <ModalHeaderTab>
                  <ModalHeaderTabTitle>Informações</ModalHeaderTabTitle>
              <ModalHeaderTabDivider />
                </ModalHeaderTab>
                <ModalHeaderTab>
                  <ModalHeaderTabTitle>Informações</ModalHeaderTabTitle>
                  <ModalHeaderTabDivider />
                </ModalHeaderTab>
              </ModalHeaderTabContainer> */
              }}
          </ModalHeader>
          <ModalContentContainer>
            <ModalContent
              handleOnClose={handleClose}
              setLoading={setLoading}
              loadItems={props.loadItems}
              item={item}
              jumpPage={jumpPage}
              updateItem={updateItem}
              onClick={props.onClick}
              platformName={props.platformName}
              platformColor={props.platformColor}
              {...modalProps}
            />
          </ModalContentContainer>
        </ModalContainer>
      </Fade>
    </StyledModal>
  );
});

export default ServicesModal;
