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
  /* height: 200px; */
  overflow: auto;
  
  border-radius: 4px;
  /* box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1); */
  /* padding: 0 16px; */
  /* max-width: 400px; */
  /* background-color: "white"; */
`;
