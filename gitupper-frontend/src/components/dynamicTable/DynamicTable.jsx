import { Fragment, useMemo } from "react";
import { useTheme } from "styled-components";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CustomTableHead } from "./customTableHead/CustomTableHead";
import SubmissionRow from "../submissionRow/SubmissionRow";
import Checkbox from "./../checkbox/Checkbox";
import Loading from "./../loading/Loading";

export default function DynamicTable({
  rows,
  columns,
  selected,
  rowsPerPage,
  page,
  maxHeight,
  loading,
  order,
  orderBy,
  handleClick,
  handleSelectAllClick,
  handleRequestSort,
  searchingValue,
  isSelected,
  stableSort,
  getComparator,
}) {
  const theme = useTheme();

  const emptyRows = useMemo(() => {
    return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;
  }, [page, rowsPerPage, rows]);

  const sortedRows = useMemo(() => {
    return stableSort(rows, getComparator(order, orderBy));
  }, [stableSort, rows, getComparator, order, orderBy]);

  return (
    <Box
      sx={{
        overflow: "hidden",
        width: "100%",
        backgroundColor: theme.colors.white,
      }}
    >
      <Paper
        sx={{
          width: "100%",
          boxShadow: "none",
          backgroundColor: "transparent",
        }}
      >
        {loading ? (
          <Loading marginTop={72} />
        ) : (
          <TableContainer
            sx={{
              maxHeight: maxHeight,
              backgroundColor: theme.colors.white,
            }}
          >
            <Table
              stickyHeader
              aria-label="sticky table"
              size="small"
              style={{ maxHeight: maxHeight, overflow: "auto" }}
            >
              <CustomTableHead
                columns={columns}
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={rows.length}
              />
              <TableBody
                sx={{
                  // add margin to the top of the table

                  //hide row border
                  "&:last-child td, &:last-child th": {
                    border: 0,
                    paddingTop: 2,
                  },

                  "& .MuiTableRow-root.Mui-selected": {
                    backgroundColor: `rgba(0, 0, 0, 0.06) !important`,
                  },
                }}
              >
                {sortedRows
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return rows.length > 0 ? (
                      <Fragment key={row.id}>
                        <TableCell padding="checkbox" align="center">
                          <Checkbox
                            checked={isItemSelected}
                            onChange={(event) => handleClick(row)}
                          />
                        </TableCell>

                        <SubmissionRow
                          searchingValue={searchingValue}
                          key={row.id + labelId}
                          row={row}
                          columns={columns}
                          hover
                          role="checkbox"
                          ariaChecked={isItemSelected}
                          tabIndex={-1}
                          selected={isItemSelected}
                          labelId={labelId}
                        />
                      </Fragment>
                    ) : (
                      <h1>Sem submissões na plataforma</h1>
                    );
                  })}
                {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
