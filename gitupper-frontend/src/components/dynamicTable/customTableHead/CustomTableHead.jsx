import { useTheme } from "styled-components";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import Checkbox from "./../../checkbox/Checkbox";
import Tooltip from "@mui/material/Tooltip";

export function CustomTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
  } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  const columns = props.columns;
  const theme = useTheme();

  return (
    <TableHead
      style={{
        backgroundColor: `${theme.colors.white}`,
        marginBottom: 16,
        paddingBottom: 16,
      }}
    >
      <TableRow
        style={{
          backgroundColor: `${theme.colors.white}`,
          marginBottom: 16,
          paddingBottom: 16,
        }}
        sx={{
          "&:last-child td, &:last-child th": {
            paddingBottom: 2,
          },
          // "&:first-child td, &:first-child th": {
          //   paddingBottom: 2,
          // },
          // "&:first-child tr": {
          //   paddingBottom: 2,
          // },
        }}
      >
        <Tooltip title="Selecionar tudo" placement="top">
          <TableCell
            padding="checkbox"
            align="center"
            style={{ backgroundColor: `${theme.colors.white}` }}
          >
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all",
              }}
            />
          </TableCell>
        </Tooltip>
        {columns.map((headCol) => (
          <TableCell
            style={{ backgroundColor: `${theme.colors.white}` }}
            width={20}
            key={headCol.id}
            align={headCol.align}
            padding={headCol.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCol.id ? order : false}
          >
            {headCol.id !== "source_code" ? (
              <TableSortLabel
                active={orderBy === headCol.id}
                direction={orderBy === headCol.id ? order : "asc"}
                onClick={createSortHandler(headCol.id)}
              >
                {headCol.label}
                {orderBy === headCol.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              <TableSortLabel
              // active={orderBy === headCol.id}
              // direction={orderBy === headCol.id ? order : "asc"}
              // onClick={createSortHandler(headCol.id)}
              >
                {headCol.label}
                {orderBy === headCol.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

CustomTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};
