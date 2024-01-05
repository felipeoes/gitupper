import { useTheme } from "styled-components";
import { ErrorMessageContainer, ErrorMessageSpan } from "./styles";
import { MdInfo } from "react-icons/md";

export default function ErrorMessage({ error }) {
  const theme = useTheme();

  let e = error !== "" && error !== undefined;
  return (
    e && (
      <ErrorMessageContainer>
        <MdInfo size={16} color={theme.colors.red} />

        <ErrorMessageSpan>{error}</ErrorMessageSpan>
      </ErrorMessageContainer>
    )
  );
}
