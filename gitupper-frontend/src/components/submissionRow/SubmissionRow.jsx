import { useState, Fragment, memo } from "react";
import { useTheme } from "styled-components";

import { IconButton, TableCell } from "@mui/material";

import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";

import SubmissionCodeEditor from "./SubmissionCodeEditor";

const SubmissionRow = memo(
  ({
    columns,
    row,
    selected,
    role,
    ariaChecked,
    tabIndex,
    hover,
    labelId,
    onClick,
    searchingValue,
    CheckboxComponent,
  }) => {
    console.log("renderizando");
    const theme = useTheme();
    const [open, setOpen] = useState(false);

    function format_date(date) {
      let d = "";
      try {
        const splittedDate = date.split("/");
        const year = splittedDate[2].split(" ")[0];
        d = new Date(year, splittedDate[1], splittedDate[0]);
      } catch (error) {
        // data está no formato US
        const splittedDate = date.split("-");
        const year = splittedDate[0];
        d = new Date(year, splittedDate[1], splittedDate[2]);
      }

      return d.toLocaleString("pt-BR", {
        day: "numeric",
        month: "numeric",
        year: "numeric",
      });
    }

    function getHighlightedText(text, highlight) {
      const parts = text.toString().split(new RegExp(`(${highlight})`, "gi"));
      return (
        <span>
          {parts.map((part, i) => (
            <span
              key={i}
              style={
                part.toLowerCase() === highlight.toLowerCase()
                  ? { fontWeight: "bold" }
                  : {}
              }
            >
              {part}
            </span>
          ))}
        </span>
      );
    }

    return (
      <Fragment>
        {columns.map((column, index) => {
          const key = column.id;
          if (key === "id") {
            return (
              <TableCell
                component="th"
                id={labelId}
                scope="row"
                align="center"
                key={row[key]}
              >
                {searchingValue
                  ? getHighlightedText(row[key], searchingValue)
                  : row[key]}
              </TableCell>
            );
          } else if (key === "status") {
            return (
              <TableCell
                align="left"
                sx={{
                  color: row[key] === "Accepted" ? "green" : "red",
                  fontWeight: "bold",
                }}
              >
                {row[key]}
              </TableCell>
            );
          } else if (key === "source_code") {
            return (
              <TableCell align="center">
                <IconButton
                  onClick={(event) => {
                    setOpen(!open);
                    // event.stopPropagation(); // evita que o evento do botão do elemento pai seja acionado
                  }}
                  sx={{
                    height: 28,
                    marginRight: 3,
                  }}
                >
                  {open ? (
                    <MdOutlineExpandLess
                      size={24}
                      color={theme.colors.black80}
                    />
                  ) : (
                    <MdOutlineExpandMore
                      size={24}
                      color={theme.colors.black80}
                    />
                  )}
                </IconButton>
              </TableCell>
            );
          } else {
            return (
              <TableCell key={key + index} align="left">
                {key === "date_submitted"
                  ? format_date(row[key].split(" ")[0])
                  : row[key]}
              </TableCell>
            );
          }
        })}
        <SubmissionCodeEditor open={open} row={row} />
      </Fragment>
    );
  }
);

export default SubmissionRow;
