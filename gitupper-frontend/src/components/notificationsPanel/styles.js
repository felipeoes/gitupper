import styled from "styled-components";
import { Badge } from "@mui/material";

export const StyledBadge = styled(Badge)((props) => ({
  ".MuiBadge-anchorOriginTopRightRectangular": {
    color: "white",
    backgroundColor: props.theme.colors.primary,
  },

  "& .MuiBadge-badge": {
    right: 16,
    top: 16,
  },

}));

export const NotitificationsPanelContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-height: 228px;
  overflow: auto;
  border-radius: 4px;

  padding: 0px 16px;
`;
