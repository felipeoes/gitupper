import styled from "styled-components";

export const FloatInputContainer = styled.div.attrs((props) => ({
  className: "floating-input-container",
}))`
  font-family: Roboto;
  font-size: ${(props) => props.fontSize || "16px"};
  margin-bottom: ${(props) => props.marginBottom || "0"}px;
  margin-top: ${(props) => props.marginTop || "24"}px;
  margin-left: ${(props) => props.marginLeft || "0"}px;
  margin-right: ${(props) => props.marginRight || "0"}px;

  ${(props) => (props.error ? `border: 1px red solid ` : "")};
  border-radius: 4px;

  .custom-float-input {
    width: ${(props) => `${props.width}px` || "100%"};
    height: 36px;
    background: ${(props) => props.theme.colors.semiblack};
    padding-left: ${(props) => (props.focused ? 0 : 4)}px;
    border-radius: 4px;
    
    box-sizing: border-box;
    color: ${(props) => props.theme.colors.white};
    border-width: 0px;

    

    > label {
      padding-top: 10px;
      width: auto;
      color: ${(props) => props.theme.colors.white};
      background: transparent;
    }

     
    :focus {

      outline: none !important;
      border:1px solid ${(props) => props.borderColor};
    }

  
`;
