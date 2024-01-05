import { useContext, useState, useEffect, useCallback } from "react";
import { AuthContext } from "../../../../contexts";
import DynamicTable from "../../../../components/dynamicTable/DynamicTable";
import { CustomTableToolbar } from "../../../../components/dynamicTable/customTableToolbar/CustomTableToolbar";
import { TablePagination } from "@mui/material";
import ServicesModal from "./../../../../components/modal/Modal";
import UploadModal from "./../uploadModal/UploadModal";

export default function SubmissionsPanel({
  loading,
  submissions,
  rowsPerPage,
  submissionsColumns,
  searchText,
  platform,
  maxHeight,
  categoryOptions,
  dateOptions,
  langOptions,
  statusOptions,
  ...props
}) {
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("id");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(submissions);

  const [buttonLoading, setButtonLoading] = useState({
    download: false,
    upload: false,
  });
  const [uploadModal, setUploadModal] = useState(null);

  const context = useContext(AuthContext);
  const { state, dispatch } = context;
  const { gitupper_id, bee_id, bee_submissions } = state.user;

  async function handleOnDownloadSrcCode() {
    setButtonLoading({ ...buttonLoading, download: true });
    const submissions_ids = selected.map((submission) => {
      return submission.id;
    });

    await context.DownloadSubmissions(
      submissions_ids,
      platform.platformPrefix,
      state.user[platform.platformPrefix + "_id"]
    );

    setTimeout(() => {
      setButtonLoading({ ...buttonLoading, download: false });
    }, 1000);
  }

  async function handleOnUploadSrcCode() {
    console.log(state.user);
    if (!state.user.github_id) {
      alert("You need to login with github to upload your code");

      return false;
    }

    uploadModal();
  }

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

      return;
    }

    setSelected([]);
  };

  const handleClick = (row) => {
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
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const isSelected = (row) => selected.indexOf(row) !== -1;

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

  useEffect(() => {
    setRows(submissions);
  }, [submissions, platform]);

  return (
    <div>
      <ServicesModal
        headless
        ModalContent={UploadModal}
        modalProps={{
          categoryOptions,
          dateOptions,
          langOptions,
          statusOptions,
          platformName: platform.name,
          platformPrefix: platform.platformPrefix,
          platformId: state.user[`${platform.platformPrefix}_id`],
          selectedSubmissions: selected,
          columns: submissionsColumns,
        }}
        setModalFunction={(f) => {
          setUploadModal(f);
        }}
      />

      <CustomTableToolbar
        numSelected={selected.length || 0}
        platformName={platform.name}
        buttonLoading={buttonLoading}
        handleOnDownloadSrcCode={handleOnDownloadSrcCode}
        handleOnUploadSrcCode={handleOnUploadSrcCode}
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
      <DynamicTable
        loading={loading}
        rows={rows}
        columns={submissionsColumns}
        selected={selected}
        rowsPerPage={rowsPerPage}
        page={page}
        maxHeight={maxHeight}
        order={order}
        orderBy={orderBy}
        handleClick={handleClick}
        handleSelectAllClick={handleSelectAllClick}
        handleRequestSort={handleRequestSort}
        searchingValue={searchText}
        isSelected={isSelected}
        stableSort={stableSort}
        getComparator={getComparator}
        getSelected={(selected) => setSelected(selected)}
      />
    </div>
  );
}
