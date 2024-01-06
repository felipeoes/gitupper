/* eslint-disable react-hooks/rules-of-hooks */
import { useContext, useState, useCallback, useRef, useEffect } from "react";
import { AuthContext } from "../../../../contexts";
import DynamicTable from "../../../../components/dynamicTable/DynamicTable";
import { CustomTableToolbar } from "../../../../components/dynamicTable/customTableToolbar/CustomTableToolbar";
import { Box, TablePagination } from "@mui/material";
import ServicesModal from "./../../../../components/modal/Modal";
import UploadModal from "./../uploadModal/UploadModal";
import { DashboardButtonsContainer } from "../styles";
import Filter from "../../../../components/filter/Filter";

export default function SubmissionsPanel({
  submissionsColumns,
  platform,
  maxHeight,
  categoryOptions,
  dateOptions,
  langOptions,
  statusOptions,
  ...props
}) {
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectAllChecked, setSelectAllChecked] = useState(false);
  const [uploadModal, setUploadModal] = useState(null);
  // const [submissionsOptions, setSubmissionsOptions] = useState({
  //   category: [],
  //   date: [],
  //   language: [],
  //   status: [],
  // });

  const context = useContext(AuthContext);
  const { state, dispatch } = context;

  const [buttonLoading, setButtonLoading] = useState({
    download: false,
    upload: state?.hasOngoingUpload ? true : false,
  });

  const { platforms_users, github_user, bee_submissions } = state.user;

  const fetchIdRef = useRef(0);
  const rowsPerPage = 30;

  async function handleOnDownloadSrcCode() {
    setButtonLoading({ ...buttonLoading, download: true });
    const submissions_ids = selected.map((submission) => {
      return submission.id;
    });

    await context.DownloadSubmissions(
      submissions_ids,
      platform.platformPrefix,
      state.user[platform.platformPrefix + "_id"],
      selectAllChecked
    );

    setTimeout(() => {
      setButtonLoading({ ...buttonLoading, download: false });
    }, 1000);
  }

  async function handleOnUploadSrcCode() {
    if (!github_user || !github_user?.github_id) {
      alert("You need to login with github to upload your code");

      return false;
    }
    uploadModal();
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((row) => row);

      setSelected(newSelecteds);
      setSelectAllChecked(true);

      return;
    }

    setSelected([]);
    setSelectAllChecked(false);
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

  const handleChangePage = async (event, newPage) => {
    setLoading(true);
    setPage(newPage);
  };

  const isSelected = (row) => selected.indexOf(row) !== -1;

  function defaultLabelDisplayedRows({ from, to, count }) {
    return `${from}–${to} de ${count !== -1 ? count : `mais de ${to}`}`;
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

  async function handleOnSubmitSearchText(problem_name) {
    setLoading(true);

    const responseData = await context.GetPlatformSubmissions(
      platform.name,
      platform.platformId,
      1,
      100000,
      problem_name
    );

    if (responseData) {
      const submissions = responseData.results;

      setRows(submissions);
      setTotalRows(responseData.count);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }

  const fetchAPIData = async () => {
    try {
      setLoading(true);

      const responseData = await context.GetPlatformSubmissions(
        platform.name,
        platform.platformId,
        page + 1,
        rowsPerPage
      );
      console.log("Response Data", responseData);

      if (responseData) {
        const submissions = responseData.results;

        setRows(submissions);
        setTotalRows(responseData.count);
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const platformChanged = useCallback(() => {
    setPage(0);
    setRows([]);
    setTotalRows(0);
    setSelected([]);
    setSelectAllChecked(false);
  }, [platform]);

  useEffect(() => {
    platformChanged();
  }, [platformChanged]);

  const fetchData = useCallback(
    ({ page, rowsPerPage }) => {
      setLoading(true);
      const fetchId = ++fetchIdRef.current;

      if (fetchId === fetchIdRef.current) {
        fetchAPIData(page, rowsPerPage);
      }
    },
    [page, platform]
  );

  useEffect(() => {
    if (page > 0 && (!rows || rows?.length === 0)) {
      setPage(0);
    }
  }, [rows]);

  return (
    <Box>
      <ServicesModal
        headless
        ModalContent={UploadModal}
        headerTitle={
          <p>
            <b>{selectAllChecked ? totalRows : selected.length}</b> submissões
            selecionadas{" "}
          </p>
        }
        modalProps={{
          platformName: platform.name,
          platformPrefix: platform.platformPrefix,
          platformId: platform.platformId,
          selectedSubmissions: selected,
          columns: submissionsColumns,
          selectAllChecked,
          totalRows,
          setButtonLoading,
        }}
        setModalFunction={(f) => {
          setUploadModal(f);
        }}
      />

      <DashboardButtonsContainer
        // visible={viewingSubmissions.submissions.length > 0}
        visible={platform}
      >
        <Filter
          columns={submissionsColumns}
          filteringRows={rows}
          setFilteredRows={setRows}
          // filteringRows={viewingSubmissions.submissions}
          // setFilteredRows={setRows}
          // setSearchingValue={(value) => {
          //   setSearchText(value);
          // }}
          // onSubmit={fetchData}
          // searchValue={searchText}
          handleOnSubmitSearchText={handleOnSubmitSearchText}
          langOptions={langOptions}
          // disabled={disabledInteractions()}
          disabled={loading || buttonLoading.download || buttonLoading.upload}
        />
      </DashboardButtonsContainer>

      <CustomTableToolbar
        numSelected={selectAllChecked ? totalRows : selected.length || 0}
        platformName={platform.name}
        buttonLoading={buttonLoading}
        handleOnDownloadSrcCode={handleOnDownloadSrcCode}
        handleOnUploadSrcCode={handleOnUploadSrcCode}
      >
        <TablePagination
          rowsPerPageOptions={[]}
          component="div"
          count={totalRows}
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
        handleClick={handleClick}
        handleSelectAllClick={handleSelectAllClick}
        // searchingValue={searchText}
        isSelected={isSelected}
        getSelected={(selected) => setSelected(selected)}
        fetchData={fetchData}
        platform={platform}
        setLoading={setLoading}
        setTotalRows={setTotalRows}
        GetPlatformSubmissions={context.GetPlatformSubmissions}
      />
    </Box>
  );
}
