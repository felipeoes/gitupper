import { useState } from "react";
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

  return active ? (
    <JobsDrawerContainer>
      <Accordion expanded={expanded} onChange={handleChange}>
        <AccordionSummary
          expandIcon={
            <MdExpandLess
              size={24}
              style={{
                marginRight: 8,
              }}
            />
          }
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <div
            style={{
              display: "flex",
              width: "90%",
              justifyContent: "space-between",
            }}
          >
            <Typography sx={{ width: "100%", flexShrink: 0 }}>
              Tarefas em segundo plano
            </Typography>

            <IconButton onClick={() => setActive(!active)}>
              <MdClose size={20} />
            </IconButton>
          </div>
        </AccordionSummary>

        <AccordionDetails>
          <NotificationsPanel />
          {/* <span>
            Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
            Aliquam eget maximus est, id dignissim quam.
          </span> */}
        </AccordionDetails>
      </Accordion>
    </JobsDrawerContainer>
  ) : null;
}
