import React from "react";
// import clsx from "clsx";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

const ROW_SIZE = 30;

const TableColumns = ({ classes, columns }) => (
  <TableRow
    component="div"
    // className={clsx(classes.row, classes.headerRow)}
  >
    {columns.map((column, colIndex) => {
      return (
        <TableCell
          key={colIndex}
          component="div"
          variant="head"
          align={column.numeric || false ? "right" : "left"}
          //   className={clsx(
          //     classes.cell,
          //     classes.column,
          //     !column.width && classes.expandingCell
          //   )}
          style={{
            flexBasis: column.width || false,
            height: ROW_SIZE,
          }}
          scope="col"
        >
          {column.label}
        </TableCell>
      );
    })}
  </TableRow>
);

export default TableColumns;
