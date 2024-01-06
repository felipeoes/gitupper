import { useState } from "react";
import { useTheme } from "styled-components";
import { JobsDrawerContainer } from "./styles";

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  IconButton,
  Typography,
} from "@mui/material";

import { MdExpandLess, MdClose } from "react-icons/md";

import NotificationsPanel from "./../notificationsPanel/NotificationsPanel";

export default function JobsDrawer() {
  const [active, setActive] = useState(true);
  const [expanded, setExpanded] = useState(false);

  function handleChange() {
    setExpanded(!expanded);
  }

  const theme = useTheme();
  return active ? (
    <JobsDrawerContainer>
      <Accordion expanded={expanded} onChange={handleChange}>
        <AccordionSummary
          expandIcon={
            <IconButton
              sx={{
                color: theme.colors.iconColor,
                "&:hover": {
                  color: theme.colors.white,
                },
              }}
            >
              <MdExpandLess size={24} />
            </IconButton>
          }
          aria-controls="panel1bh-content"
          id="panel1bh-header"
          sx={{
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            background: "#2F2D2D",
          }}
        >
          <div
            style={{
              display: "flex",
              width: "90%",
              justifyContent: "space-between",
            }}
          >
            <Typography
              sx={{
                width: "100%",
                flexShrink: 0,
                color: theme.colors.white,
                fontWeight: 500,
                fontFamily: "InterRegular",
              }}
            >
              Tarefas em segundo plano
            </Typography>

            <IconButton
              onClick={() => setActive(!active)}
              sx={{
                color: theme.colors.iconColor,
                "&:hover": {
                  color: theme.colors.white,
                },
              }}
            >
              <MdClose size={20} />
            </IconButton>
          </div>
        </AccordionSummary>

        <AccordionDetails sx={{ padding: 0 }}>
          <NotificationsPanel setDrawerExpanded={setExpanded} />
        </AccordionDetails>
      </Accordion>
    </JobsDrawerContainer>
  ) : null;
}
