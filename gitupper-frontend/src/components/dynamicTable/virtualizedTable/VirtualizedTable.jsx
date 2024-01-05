import Fragment, { useState, useEffect, useCallback } from "react";
import { useTheme } from "styled-components";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { CustomTableHead } from "./customTableHead/CustomTableHead";
import { CustomTableToolbar } from "./customTableToolbar/CustomTableToolbar";
import SubmissionRow from "../submissionRow/SubmissionRow";
import { FixedSizeList as List } from "react-window";

import { IconButton, Collapse } from "@mui/material";
import { MdOutlineExpandLess, MdOutlineExpandMore } from "react-icons/md";
import AceEditor from "./../aceEditor/AceEditor";

const classes = {
  flexContainer: "ReactVirtualizedDemo-flexContainer",
  tableRow: "ReactVirtualizedDemo-tableRow",
  tableRowHover: "ReactVirtualizedDemo-tableRowHover",
  tableCell: "ReactVirtualizedDemo-tableCell",
  noClick: "ReactVirtualizedDemo-noClick",
};

const styles = ({ theme }) => ({
  // temporary right-to-left patch, waiting for
  // https://github.com/bvaughn/react-virtualized/issues/454
  "& .ReactVirtualized__Table__headerRow": {
    ...(theme.direction === "rtl" && {
      paddingLeft: "0 !important",
    }),
    ...(theme.direction !== "rtl" && {
      paddingRight: undefined,
    }),
  },
  [`& .${classes.flexContainer}`]: {
    display: "flex",
    alignItems: "center",
    boxSizing: "border-box",
  },
  [`& .${classes.tableRow}`]: {
    cursor: "pointer",
  },
  [`& .${classes.tableRowHover}`]: {
    "&:hover": {
      backgroundColor: theme.palette.grey[200],
    },
  },
  [`& .${classes.tableCell}`]: {
    flex: 1,
  },
  [`& .${classes.noClick}`]: {
    cursor: "initial",
  },
});

export default function DynamicTable(props) {
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("id");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(props.rows);

  const rowsPerPage = props.rowsPerPage;
  const theme = useTheme();
  const columns = props.columns;
  const maxHeight = props.maxHeight;
  let searchingValue = props.searchingValue;

  useEffect(() => {
    setRows(props.rows);
    setSelected([]);
  }, [props.rows]);

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

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((row) => row);

      setSelected(newSelecteds);
      props.getSelected(newSelecteds);

      return;
    }

    setSelected([]);
    props.getSelected([]);
  };

  const handleClick = (event, row) => {
    const selectedIndex = selected.indexOf(row);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, row);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
    props.getSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const isSelected = (row) => selected.indexOf(row) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  function defaultLabelDisplayedRows({ from, to, count }) {
    return `${from}–${to} de ${count !== -1 ? count : `more than ${to}`}`;
  }

  function defaultGetAriaLabel(type) {
    switch (type) {
      case "first":
        return "Ir para a primeira página";
      case "last":
        return "Ir para a última página";
      case "previous":
        return "Ir para a página anterior";
      default:
        return "Ir para a próxima página";
    }
  }

  // SubmissionRow({
  //   columns,
  //   row,
  //   selected,
  //   role,
  //   ariaChecked,
  //   tabIndex,
  //   hover,
  //   labelId,
  //   onClick,
  //   searchingValue,
  // })

  const Row = ({ index, style, data: { columns, items, classes } }) => {
    const item = items[index];

    const [open, setOpen] = useState(false);
    const [modifiedSrcCode, setModifiedSrcCode] = useState(item.source_code);

    const columnsKeys = Object.keys(columns).map((key) => columns[key].id);

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

    function onChange(newValue) {
      setModifiedSrcCode(newValue);
    }

    function handleOnCopySrcCode() {
      navigator.clipboard.writeText(modifiedSrcCode);
    }

    function handleOnClickOriginal() {
      setModifiedSrcCode(item.source_code);
    }

    return (
      <div>
        <TableRow
          sx={{
            "& > *": { borderBottom: "unset" },
          }}
          // selected={
          //   isSelected(item)
          // }
          // role={role}
          // aria-checked={ariaChecked}
          // tabIndex={tabIndex}
          // hover={hover}
        >
          {columns.map((column, colIndex) => {
            const columnName = column.id;
            const rowValue = item[columnName];

            if (columnName === "id") {
              const labelId = `enhanced-table-checkbox-${index}`;
              return (
                <TableCell
                  component="th"
                  id={labelId}
                  scope="row"
                  align="center"
                  key={item.key}
                >
                  {rowValue}
                </TableCell>
              );
            } else if (columnName === "status") {
              return (
                <TableCell
                  align="left"
                  sx={{
                    color: rowValue === "Accepted" ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {rowValue}
                </TableCell>
              );
            } else if (columnName === "source_code") {
              return (
                <TableCell align="center">
                  <IconButton
                    onClick={(event) => {
                      // setOpen(!open);
                      event.stopPropagation(); // evita que o evento do botão do elemento pai seja acionado
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
                <TableCell key={item.id + colIndex} align="left">
                  {/* {columnName === "date_submitted"
                  ? format_date(row[key].split(" ")[0])
                  : rowValue} */}
                  {rowValue}
                </TableCell>
              );
            }
          })}
        </TableRow>

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
                row={item}
                value={modifiedSrcCode}
                onChange={onChange}
                handleOnCopySrcCode={handleOnCopySrcCode}
                handleOnClickOriginal={handleOnClickOriginal}
              />
            </Collapse>
          </TableCell>
        </TableRow>
      </div>
    );
  };

  const createItemData = useCallback(
    (classes, columns, data) => ({
      columns,
      classes,
      items: data,
    }),
    []
  );

  const itemData = createItemData(classes, columns, rows);

  function selectItemData() {
    // seleciona de acordo com a paginação
    const items = itemData.items.slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    );
    itemData.items = items;
    return itemData;
  }
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
          border: "none",
          boxShadow: "none",
        }}
      >
        <CustomTableToolbar
          numSelected={selected.length || 0}
          platformName={props.platform}
          buttonLoading={props.buttonLoading}
          handleOnDownloadSrcCode={props.handleOnDownloadSrcCode}
          handleOnUploadSrcCode={props.handleOnUploadSrcCode}
        >
          <TablePagination
            rowsPerPageOptions={[]}
            component="div"
            count={rows.length}
            rowsPerPage={rowsPerPage || -1}
            page={page}
            onPageChange={handleChangePage}
            labelDisplayedRows={defaultLabelDisplayedRows}
            getItemAriaLabel={defaultGetAriaLabel}
            sx={{
              "& .MuiButtonBase-root": {
                color: "black",
              },
              "& .MuiButtonBase-root.Mui-disabled": {
                opacity: 0.5,
              },
            }}
          />
        </CustomTableToolbar>

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
            {/* <CustomTableHead
              columns={columns}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            /> */}
            <TableBody
              sx={{
                "& .MuiTableRow-root.Mui-selected": {
                  backgroundColor: `rgba(0, 0, 0, 0.06) !important`,
                },
              }}
            >
              <List
                className={classes.list}
                height={maxHeight}
                width={"100%"}
                itemCount={
                  // MOSTRA DE Acordo com a paginação
                  rowsPerPage > -1
                    ? Math.min(rowsPerPage, rows.length)
                    : rows.length
                  // rows.length
                }
                itemSize={35}
                itemKey={(index) => {
                  return rows[index].id;
                }}
                // MOSTRA DE Acordo com a paginação
                itemData={selectItemData()}
              >
                {Row}

                {/* {stableSort(rows, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    const isItemSelected = isSelected(row);
                    const labelId = `enhanced-table-checkbox-${index}`;

                    return rows.length > 0 ? (
                      <SubmissionRow
                        searchingValue={searchingValue}
                        key={row.id + index}
                        row={row}
                        columns={columns}
                        hover
                        onClick={(event) => handleClick(event, row)}
                        role="checkbox"
                        ariaChecked={isItemSelected}
                        tabIndex={-1}
                        selected={isItemSelected}
                        labelId={labelId}
                      />
                    ) : (
                      <h1>Sem submissões na plataforma</h1>
                    );
                  })} */}
              </List>

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
      </Paper>
    </Box>
  );
}
