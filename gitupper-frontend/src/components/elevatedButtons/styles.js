import styled from "styled-components";
import { styled as muiStyled } from "@mui/material/styles";
import Button from "@mui/material/Button";

export const ElevatedButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  width: ${(props) => `${props.width}px` || "auto"};
  height: ${(props) => `${props.height}px` || "460px"};

  background-color: ${(props) => props.bgColor || "white"};

  border-radius: ${(props) => props.borderRadius || "0px"};
  box-shadow: ${(props) =>
    props.boxShadow || "0px 0px 0px 0px rgba(0,0,0,0.2)"};

  border-radius: ${(props) => props.borderRadius || "8px"};

  margin-left: ${(props) => props.marginLeft || 0}px;
  margin-right: ${(props) => props.marginRight || 0}px;
  margin-top: ${(props) => props.marginTop || 0}px;
  margin-bottom: ${(props) => props.marginBottom || 0}px;
`;

// export const ElevatedButton = muiStyled(Button)((props) => ({
//   // border: props.border === "outlined" && `1px solid ${props.borderColor}`,

//   // borderRadius: props.first ? "4px 0px 0px 4px" : "0px 4px 4px 0px",

//   // zIndex: props.elevated ? 2 : 1,
//   // backgroundColor: props.elevated ? props.bgColor : "none",
//   // color: props.elevated ? "" : props.bgColor,
//   // // eslint-disable-next-line no-dupe-keys
//   // border: props.elevated ? "none" : `1px ${props.bgColor} solid`,

//   // display: "flex",
//   // alignItems: "center",
//   // justifyContent: "center",
//   // width: props.buttonWidth || "100%",
//   // height: "100%",

//   // fontFamily: props.fontFamily || "InterRegular",
//   // fontSize: props.fontSize || 16,
//   // fontWeight: props.fontWeight || "normal",

//   // marginLeft: props.marginLeft || 0,
//   // cursor: "pointer",

//   "&:hover": {
//     opacity: 0.8,
//     backgroundColor: props.bgColor,
//     borderColor: props.border && props.borderColor,
//   },
//   "&:disabled ": {
//     opacity: 0.7,
//     backgroundColor: "#8C8C8C",
//     cursor: "not-allowed",
//     fontWeight: "bold",
//     pointerEvents: "none",
//   },
// }));

export const ElevatedButton = styled.button`
  ${(props) =>
    props.border === "outlined" && `border: 1px solid ${props.borderColor}`};

  ${(props) =>
    props.first
      ? `border-radius: 4px 0px 0px 4px`
      : `border-radius: 0px 4px 4px 0px`};

  ${(props) =>
    props.elevated
      ? `z-index: 2;  background-color: ${props.bgColor}; color: ${props.theme.colors.white}; border: none;`
      : `z-index: 1; background-color: none; color: ${
          props.color || props.theme.colors.semiblack
        }; border: 1px ${props.bgColor} solid; `};

  /* border-radius: 4px; */
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props) => `${props.buttonWidth}px` || "100%"};
  height: 100%;

  font-family: ${(props) => props.fontFamily || "InterRegular"};
  font-size: ${(props) => props.fontSize || 16}px;
  font-weight: ${(props) => props.fontWeight || "normal"};

  margin-left: ${(props) => props.marginLeft || 0}px;

  cursor: pointer;

  &:hover {
    opacity: 0.8;
  }

  &:disabled {
    cursor: normal;
    pointer-events: none;
  }
`;
