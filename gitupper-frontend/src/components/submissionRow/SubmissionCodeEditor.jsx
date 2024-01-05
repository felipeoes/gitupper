import { useState } from "react";
import { useTheme } from "styled-components";
import { TableRow, TableCell, Collapse } from "@mui/material";
import AceEditor from "../aceEditor/AceEditor";

export default function SubmissionCodeEditor({ open, row }) {
//   const [open, setOpen] = useState(false);
  const [modifiedSrcCode, setModifiedSrcCode] = useState(row.source_code);
  const theme = useTheme();

  function onChange(newValue) {
    setModifiedSrcCode(newValue);
  }

  function handleOnCopySrcCode() {
    navigator.clipboard.writeText(modifiedSrcCode);
  }

  function handleOnClickOriginal() {
    setModifiedSrcCode(row.source_code);
  }

  return (
    <TableRow>
      <TableCell
        style={{
          paddingBottom: 0,
          paddingTop: 0,
          backgroundColor: theme.colors.white,
        }}
        colSpan={10}
      >
        <Collapse
          in={open}
          timeout="auto"
          unmountOnExit
          sx={{ backgroundColor: theme.colors.white }}
        >
          <AceEditor
            row={row}
            value={modifiedSrcCode}
            onChange={onChange}
            handleOnCopySrcCode={handleOnCopySrcCode}
            handleOnClickOriginal={handleOnClickOriginal}
          />
        </Collapse>
      </TableCell>
    </TableRow>
  );
}
