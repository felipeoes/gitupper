import { Fragment, useEffect, useState} from "react";
import { useTheme } from "styled-components";
import Box from "@mui/material/Box";
import { Table, TableBody, TableCell } from "@mui/material";
import TableContainer from "@mui/material/TableContainer";
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
  handleClick,
  handleSelectAllClick,
  searchingValue,
  isSelected,
  platform,
  fetchData,
}) {
  // const [rows, setRows] = useState(newRows);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("id");

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const theme = useTheme();

  useEffect(() => {
    fetchData && fetchData(page, rowsPerPage);
  }, [fetchData, page, rowsPerPage, platform]);

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
                rowCount={rows?.length}
              />
              <TableBody
                sx={{
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
                {rows?.length > 0 &&
                  stableSort(rows, getComparator(order, orderBy))
                    // .slice(
                    //   page * rowsPerPage,
                    //   page * rowsPerPage + rowsPerPage
                    // )
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
                {/* {emptyRows > 0 && (
                  <TableRow
                    style={{
                      height: 53 * emptyRows,
                    }}
                  >
                    <TableCell colSpan={6} />
                  </TableRow>
                )} */}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>
    </Box>
  );
}
