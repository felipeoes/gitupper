/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useContext, useEffect } from "react";
import { useTheme } from "styled-components";
import Button from "../../../../../components/button/Button";
import Loading from "./../../../../../components/loading/Loading";
import LogoButton from "./../../../../../components/logoButton/LogoButton";

import { BindViewText } from "../bindView/styles";
import { Container, BindMessage } from "./../../../platforms/styles";
import AuthContext from "../../../../../contexts/auth";
import {
  Autocomplete,
  TextField,
  Tooltip,
  InputAdornment,
  IconButton,
  Box,
} from "@mui/material";

import {
  TextFieldsContainer,
  UploadGroupingContainer,
  UploadOptionContainer,
  UploadViewContainer,
  RadioButtonsContainer,
  FilesTreeViewContainer,
} from "./styles";
import RadioButton from "../../../../../components/radioButton/RadioButton";
import FilesTreeView from "./../../../../../components/filesTreeView/FilesTreeView";

import { MdSearch, MdCreateNewFolder, MdFolder } from "react-icons/md";
import ServicesModal from "../../../../../components/modal/Modal";
import NewRepoModal from "./newRepoModal/NewRepoModal";
import { WorkersContext } from "../../../../../contexts";

// import gitupperLogo from "../../../../../assets/images/logos/black_logo_GITUPPER.svg";

export default function UploadView({
  columns,
  selectedSubmissions,
  platformName,
  platformId,
  keepMounted,
  handleOnClose, // closes the modal
  selectAllChecked,
  totalRows,
  setButtonLoading,
}) {
  columns = columns.filter((column) => column.icon); // filtrando somente as colunas que podem ser agrupadas

  const [repositories, setRepositories] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState("");
  const [owner, setOwner] = useState("");
  const [commitMessage, setCommitMessage] = useState(
    "Arquivos criados pelo gitupper <:)>"
  );
  // const [selectedSubmissions, setSelectedSubmissions] = useState(selectedSubs);
  const [about, setAbout] = useState("");
  const [selectedGrouping, setSelectedGrouping] = useState(columns[0].label);
  const [openTooltip, setOpenTooltip] = useState(false);
  const [treeData, setTreeData] = useState([]);
  const [open, setOpen] = useState(false);
  const [autocompleteLoading, setAutocompleteLoading] = useState(
    open && repositories.length === 0
  );
  const [loading, setLoading] = useState(false);

  const [newRepoModal, setNewRepoModal] = useState(false);

  const context = useContext(AuthContext);
  const workersContext = useContext(WorkersContext);

  const { dispatch, state } = context;
  const { workerState, dispatchWorker } = workersContext;

  const { github_user } = state?.user;
  const theme = useTheme();

  const submissionsOptions = {
    category: [],
    date: [],
    language: [],
    status: [],
  };

  function setUploadOptions() {
    selectedSubmissions &&
      selectedSubmissions.forEach((submission) => {
        submissionsOptions.category.push(submission.category);
        submissionsOptions.date.push(submission.date_submitted);
        submissionsOptions.language.push(
          submission.language || submission.prog_language
        );
        submissionsOptions.status.push(submission.status);
      });
  }

  setUploadOptions();

  function getGroupingMap() {
    const groupingMap = {
      Categoria: {
        options: new Set(submissionsOptions.category),
        id: columns.filter((column) => column.label === "Categoria")[0].id,
      },
      Linguagem: {
        options: new Set(submissionsOptions.language),
        id: columns.filter((column) => column.label === "Linguagem")[0].id,
      },
      Status: {
        options: new Set(submissionsOptions.status),
        id: columns.filter((column) => column.label === "Status")[0].id,
      },
      Data: {
        options: new Set(submissionsOptions.date),
        id: columns.filter((column) => column.label === "Data")[0].id,
      },
    };

    return groupingMap;
  }

  const handleCloseTooltip = () => {
    setOpenTooltip(false);
  };

  const handleOpenTooltip = () => {
    setOpenTooltip(true);
  };

  function getFoldersOptions(grouping) {
    let currentGrouping = grouping || selectedGrouping;
    const groupingMap = getGroupingMap();
    const { options } = groupingMap[currentGrouping];
    const optionsArray = Array.from(options);

    // allocate the submissions to the folders
    let treeData = [];
    optionsArray.forEach((option) => {
      const submissions = selectedSubmissions.filter(
        (submission) =>
          submission[
            columns.filter((column) => column.label === currentGrouping)[0].id
          ] === option
      );

      treeData.push({
        name: option,
        children: submissions.map(
          (submission) => submission.id + " - " + submission.problem_name
        ),
      });
    });
    setTreeData(treeData);

    return treeData;
  }

  const handleChange = (event) => {
    setTreeData(getFoldersOptions());
    setSelectedGrouping(event.target.value);
    const groupingMap = getGroupingMap();

    setTreeData(Array.from(groupingMap[event.target.value].options));
    setTreeData(getFoldersOptions(event.target.value));
  };

  let interval = null;

  function disabledButton() {
    return !selectedRepo || loading;
  }

  const controlProps = (item) => ({
    checked: selectedGrouping === item.label,
    onChange: handleChange,
    value: item.label,
    name: "grouping-radio-button",
    inputProps: { "aria-label": item.label },
  });

  useEffect(() => {
    async function handleOnRetrieveRepositories() {
      const data = await context.GetUserRepos();

      const repositories = data.repositories;
      const userLogin = data.userLogin;

      try {
        if (repositories && repositories.length > 0) {
          const reposNames = repositories.map((repo) =>
            repo.full_name.replace(`${userLogin}/`, "")
          );

          setRepositories(reposNames);
          setOwner(userLogin);
        } else {
          alert("Você ainda não criou nenhum repositório no Github.");
        }
      } catch (error) {
        console.log(error);
      }

      setAutocompleteLoading(false);
    }

    setAutocompleteLoading(true);

    handleOnRetrieveRepositories();
    setTreeData(getFoldersOptions());
  }, [dispatch, context, selectedSubmissions]);

  function createFoldersView() {
    let dateFlag = selectedGrouping === "Data";

    const groupingMap = getGroupingMap();
    const { options, id } = groupingMap[selectedGrouping];
    const optionsArray = Array.from(options);

    console.log("groupingMap: ", groupingMap);
    console.log("selectedSubmissions: ", selectedSubmissions);
    console.log("optionsArray: ", options);
    console.log("id: ", id);

    selectedSubmissions.forEach((submission) => {
      const path = dateFlag
        ? `${selectedGrouping}/${submission[id].replaceAll("/", "-")}`
        : `${selectedGrouping}/${submission[id]}`;

      submission.path = path;
    });

    // for (let option of optionsArray) {
    //   const path = dateFlag
    //     ? `${selectedGrouping}/${option.replaceAll("/", "-")}`
    //     : `${selectedGrouping}/${option}`;

    //   selectedSubmissions.forEach((submission) => {
    //     if (submission[id] === option) {
    //       submission.path = path;
    //     }
    //   });
    // }

    return optionsArray;
  }

  async function handleOnSubmit() {
    setLoading(true);
    // keepMounted(true);
    // setLoadingData((prevState) => ({ ...prevState, message: true }));

    if (selectAllChecked) {
      // retrieve all submissions
      const response = await context.GetPlatformSubmissions(
        platformName,
        platformId,
        1,
        10000
      );
      console.log(response);
      selectedSubmissions = response.results;
    }

    setUploadOptions();
    createFoldersView();

    const repoName = selectedRepo?.label || selectedRepo;

    // create github repo if not exists
    const data = {
      owner: owner,
      repoName: repoName,
      about: about,
    };

    const repoLink = await context.CreateGithubRepo(data);

    if (repoLink) {
      // upload submissions to github
      const repoData = {
        owner: owner,
        repoName: repoName,
        path: `${platformName}/${platformId}`,
        submissions: selectedSubmissions,
        commitMessage: commitMessage,
        token: github_user?.github_access_token,
      };

      dispatchWorker({
        type: "UPLOAD_SUBMISSIONS",
        payload: {
          ...repoData,
          platformName,
          setButtonLoading,
        },
      });
    }

    setButtonLoading((prevState) => ({ ...prevState, upload: true }));
    handleOnClose();
    // const repoLink = await context.UploadSubmissions(data);

    console.log("repoLink: ", repoLink);
    // setTimeout(() => {
    //   alert(
    //     `Suas submissões já estão no Github! Link do repositório: ${repoLink}`
    //   );
    // }, 2000);

    // initializeInterval();

    // setTimeout(() => {
    //   clearInterval(interval);
    //   setLoadingData({ message: "", counter: 30 });
    //   setLoading(false);
    // }, 5000);
  }

  function handleOnNewRepo(newRepoName) {
    // Add new item to repositories at the beginning of the array

    // check if the new repo name is already in the array
    const repoExists = repositories.find((repo) => repo === newRepoName);

    if (!repoExists) {
      const newRepo = {
        label: newRepoName,
        newRepo: true,
      };

      setSelectedRepo(newRepoName);
      setRepositories([newRepo, ...repositories]);
    }
  }

  function handleOnClickCreateRepo() {
    newRepoModal();

    setRepositories(repositories.slice(1));
  }

  function handleClose() {
    setOpen(false);
  }

  return (
    <Container>
      <ServicesModal
        ModalContent={NewRepoModal}
        setModalFunction={(f) => {
          setNewRepoModal(f);
        }}
        modalProps={{
          handleOnNewRepo: handleOnNewRepo,
        }}
      />

      <UploadViewContainer>
        {/* <p
          style={{
            margin: 0,
          }}
        >
          <b>{selectAllChecked ? totalRows : selectedSubmissions.length}</b>{" "}
          submissões selecionadas
        </p> */}
        <BindMessage color={theme.colors.blackLight}>
          Buscar um repositório
        </BindMessage>

        <Autocomplete
          freeSolo
          disabled={loading}
          id="repository-autocomplete"
          options={repositories}
          value={selectedRepo}
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            handleClose();
          }}
          onChange={(event, repo) => {
            setSelectedRepo(repo);
          }}
          loading={autocompleteLoading}
          getOptionLabel={(option) => {
            if (typeof option === "string") {
              return option;
            }
            if (typeof option?.label === "string") {
              return option.label;
            }
            return "";
          }}
          renderOption={(props, option) =>
            option.newRepo ? (
              <Box component="li" {...props}>
                <MdFolder
                  size={24}
                  color={theme.colors.iconColor}
                  style={{
                    marginRight: 10,
                  }}
                />

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  {option?.label || option}

                  <LogoButton disabled={true} />
                </div>
              </Box>
            ) : (
              <Box component="li" {...props}>
                <MdFolder
                  size={24}
                  color={theme.colors.iconColor}
                  style={{
                    marginRight: 10,
                  }}
                />

                {option?.label || option}
              </Box>
            )
          }
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder="Buscar em meus repositórios"
              InputProps={{
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment>
                    <MdSearch size={24} color={theme.colors.iconColor} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <>
                    {autocompleteLoading ? <Loading loadingSize={20} /> : null}

                    <InputAdornment>
                      <IconButton>
                        <MdCreateNewFolder
                          size={24}
                          color={theme.colors.iconColor}
                          onClick={handleOnClickCreateRepo}
                          disabled={disabledButton()}
                        />
                      </IconButton>
                    </InputAdornment>
                  </>
                ),
              }}
              sx={{
                height: 38,
                pt: 0,
                pr: 0,
              }}
            />
          )}
          sx={{
            "& .MuiOutlinedInput-root": {
              height: 38,
              pt: 0,
              pr: "8px !important",
              pl: "8px !important",
            },
          }}
        />

        {/* {!newRepo ? (
          <Button
            type="button"
            variant="text"
            bgColor="transparent"
            color={theme.colors.primary}
            width={184}
            fontSize={14}
            disabled={loading}
            onClick={() => handleOnClickCreateRepo()}
          >
            Criar um novo repositório
          </Button>
        ) : (
          <TextField
            multiline
            maxRows={3}
            placeholder="Digite o nome do repositório"
            onChange={(event) => setSelectedRepo(event.target.value)}
            sx={{
              minWidth: 220,
              "& .MuiOutlinedInput-root": {
                height: 38,
                mt: 1,
              },
            }}
            disabled={loading}
          >
            {selectedRepo}
          </TextField>
        )} */}

        <TextFieldsContainer>
          <UploadOptionContainer>
            <BindMessage color={theme.colors.black}>
              Mensagem de commit
            </BindMessage>
            <TextField
              fullWidth
              multiline
              maxRows={2}
              onChange={(event) => setCommitMessage(event.target.value)}
              placeholder="Ex: Arquivos criados pelo gitupper <:)>"
              sx={{
                minWidth: 220,
                "& .MuiOutlinedInput-root": {
                  height: 75,
                },
              }}
              disabled={loading}
            >
              {commitMessage}
            </TextField>
          </UploadOptionContainer>

          <UploadOptionContainer marginLeft={32}>
            <BindMessage color={theme.colors.black}>Sobre</BindMessage>
            <TextField
              fullWidth
              multiline
              maxRows={2}
              placeholder="Digite mais informações sobre o seu repositório"
              onChange={(event) => setAbout(event.target.value)}
              sx={{
                minWidth: 220,
                "& .MuiOutlinedInput-root": {
                  height: 75,
                },
              }}
              disabled={loading}
            >
              {about}
            </TextField>
          </UploadOptionContainer>
        </TextFieldsContainer>

        <UploadOptionContainer>
          <BindMessage color={theme.colors.black}>
            Criar agrupamento em pastas
            <BindViewText>
              Agrupe suas submissões selecionando um dos tipos de agrupamento!
            </BindViewText>
          </BindMessage>

          <UploadGroupingContainer>
            <RadioButtonsContainer disabled={loading}>
              {columns.map((item) => (
                <RadioButton
                  id={item.id}
                  label={item.label}
                  {...controlProps(item)}
                />
              ))}
            </RadioButtonsContainer>

            <FilesTreeViewContainer>
              <FilesTreeView treeData={treeData} />
            </FilesTreeViewContainer>
          </UploadGroupingContainer>
        </UploadOptionContainer>
      </UploadViewContainer>

      <Tooltip
        title="Selecione ou crie um repositório para habilitar este botão"
        placement="top"
        open={openTooltip && disabledButton()}
        onClose={handleCloseTooltip}
        onOpen={handleOpenTooltip}
      >
        <Box
          sx={{
            marginTop: 1,
          }}
        >
          <Button
            btnType="loading"
            width={320}
            type="button"
            bgColor={theme.colors.primary}
            color={theme.colors.white}
            onClick={() => handleOnSubmit()}
            loading={loading}
            disabled={disabledButton()}
          >
            {loading ? `Carregando...` : "Subir para o Github"}
          </Button>
        </Box>
      </Tooltip>
    </Container>
  );
}
