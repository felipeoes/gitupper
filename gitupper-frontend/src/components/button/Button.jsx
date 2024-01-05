import { ButtonContainer, LoadingButton } from "./styles";
import Loading from "./../loading/Loading";
import PropTypes from "prop-types";

export default function Button({
  children,
  type,
  variant,
  border,
  bgColor,
  color,
  borderColor,
  disableElevation = true,
  disabled = false,
  height,
  width,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
  fontWeight,
  fontFamily,
  fontSize,
  Icon,
  iconSize,
  iconColor,
  iconMt,
  iconMb,
  iconMl,
  iconMr,
  onClick,
  loading,
  loadingSize,
  btnType,
  padding,
  paddingRL,
  paddingTB,
}) {
  return btnType === "loading" ? (
    <LoadingButton
      // startIcon={Icon && <Icon size={iconSize} color={iconColor} />}
      loading={loading}
      // loadingPosition="start"
      variant={border ? "outlined" : "contained"}
      fontWeight={fontWeight}
      fontFamily={fontFamily}
      fontSize={fontSize}
      border={border}
      type={type || "button"}
      disabled={disabled || loading}
      bgColor={loading ? "#000" : bgColor}
      textColor={color}
      borderColor={borderColor}
      onClick={onClick}
      marginLeft={marginLeft}
      marginRight={marginRight}
      marginTop={marginTop}
      marginBottom={marginBottom}
      height={height}
      width={width}
      loadingIndicator={
        <Loading color={color} loadingSize={loadingSize || 30} />
      }
      disableElevation={disableElevation}
      paddingLeft={paddingRL}
      paddingRight={paddingRL}
      paddingTop={paddingTB}
      paddingBottom={paddingTB}
    >
      {!loading && children}
    </LoadingButton>
  ) : (
    <ButtonContainer
      disableElevation={disableElevation}
      fontWeight={fontWeight}
      fontFamily={fontFamily}
      fontSize={fontSize}
      variant={border ? "outlined" : variant || "contained"}
      border={border}
      type={type || "button"}
      disabled={disabled}
      bgColor={bgColor}
      textColor={color}
      borderColor={borderColor}
      onClick={onClick}
      marginLeft={marginLeft}
      marginRight={marginRight}
      marginTop={marginTop}
      marginBottom={marginBottom}
      height={height}
      width={width}
      paddingLeft={paddingRL}
      paddingRight={paddingRL}
      paddingTop={paddingTB}
      paddingBottom={paddingTB}
    >
      {Icon && (
        <Icon
          size={iconSize}
          color={iconColor}
          style={{
            marginRight: iconMr,
            marginLeft: iconMl,
            marginBottom: iconMb,
            marginTop: iconMt,
          }}
        />
      )}

      {!loading && children}
    </ButtonContainer>
  );
}

LoadingButton.propTypes = {
  bgColor: PropTypes.string,
  border: PropTypes.bool,
  borderColor: PropTypes.string,
  color: PropTypes.string,
  marginLeft: PropTypes.number,
  marginRight: PropTypes.number,
  marginTop: PropTypes.number,
  marginBottom: PropTypes.number,
  fontWeight: PropTypes.string,
  fontFamily: PropTypes.string,
  fontSize: PropTypes.string || PropTypes.number,
  iconSize: PropTypes.number,
  iconColor: PropTypes.string,
  onClick: PropTypes.func,
  btnType: PropTypes.string,
};

ButtonContainer.propTypes = {
  bgColor: PropTypes.string,
  border: PropTypes.bool,
  borderColor: PropTypes.string,
  color: PropTypes.string,
  marginLeft: PropTypes.number,
  marginRight: PropTypes.number,
  marginTop: PropTypes.number,
  marginBottom: PropTypes.number,
  fontWeight: PropTypes.string,
  fontFamily: PropTypes.string,
  fontSize: PropTypes.string || PropTypes.number,
  iconSize: PropTypes.number,
  iconColor: PropTypes.string,
  onClick: PropTypes.func,
  btnType: PropTypes.string,
};

Button.propTypes = {
  bgColor: PropTypes.string,
  border: PropTypes.bool,
  borderColor: PropTypes.string,
  color: PropTypes.string,
  marginLeft: PropTypes.number,
  marginRight: PropTypes.number,
  marginTop: PropTypes.number,
  marginBottom: PropTypes.number,
  fontWeight: PropTypes.string,
  fontFamily: PropTypes.string,
  fontSize: PropTypes.string,
  iconSize: PropTypes.number,
  iconColor: PropTypes.string,
  onClick: PropTypes.func,
  btnType: PropTypes.string,
};
