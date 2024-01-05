/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState, useEffect } from "react";
import {
  DashboardContainer,
  DashboardButtonsContainer,
  ViewContainer,
} from "./styles";
import { AuthContext } from "../../../contexts";

import ProgressBar from "../../../components/progressBar/ProgressBar";
import {
  platforms_obj as platforms,
  submissionsColumns,
} from "./../../../services/utils/platforms";

import useWindowDimensions, {
  totalHeaderHeight,
} from "../../../services/utils/useWindowsDimensions";
import Filter from "../../../components/filter/Filter";
import NotBind from "../../../components/notBind/NotBind";
import Select from "./../../../components/common/select/Select";
import SubmissionsPanel from "./submissionsPanel/SubmissionsPanel";

export default function HomePage() {
  const [data, setData] = useState({ errorMessage: "", isLoading: true });
  const [progress, setProgress] = useState(0);

  const context = useContext(AuthContext);

  const { state, dispatch } = context;
  const { gitupper_id, bee_id, bee_submissions } = state.user;
  const [viewingSubmissions, setviewingSubmissions] = useState(
    activePlatform()
  );

  const [searchText, setSearchText] = useState("");
  const [rows, setRows] = useState(viewingSubmissions.submissions);
  const [platform, setPlatform] = useState(orderPlatformsBySubmissions()[0]);

  const { height } = useWindowDimensions();
  const maxHeight = height - totalHeaderHeight;
  const langOptions = [];
  const categoryOptions = [];
  const statusOptions = [];
  const dateOptions = [];

  setUploadOptions();
  let interval = null;

  function setUploadOptions() {
    viewingSubmissions.submissions &&
      viewingSubmissions.submissions.forEach((submission) => {
        langOptions.push(submission.prog_language || submission.language);
        categoryOptions.push(submission.category);
        statusOptions.push(submission.status);
        dateOptions.push(submission.date_submitted);
      });
  }

  function orderPlatformsBySubmissions() {
    // platforms withouth submissions are at the end of the array
    let orderedPlatforms = [];
    let platformsWithoutSubmissions = [];

    for (let platform in platforms) {
      let actual = platforms[platform];
      if (state.user[actual.platformPrefix + "_submissions"]) {
        orderedPlatforms.push(actual);
      } else {
        platformsWithoutSubmissions.push(actual);
      }
    }
    return orderedPlatforms.concat(platformsWithoutSubmissions);
  }

  function activePlatform() {
    let activePlatform = orderPlatformsBySubmissions()[0];
    let submissions_str = activePlatform.platformPrefix + "_submissions";

    return {
      submissions: state.user[submissions_str] || [],
      SubmissionRow: activePlatform.submissionRow,
      actualPlatform: activePlatform,
    };
  }

  function isBindedBeecrowd() {
    return bee_id;
  }

  function hasBeecrowdSubmissions() {
    return bee_submissions;
  }

  // async function checkDownloadProgress() {
  //   try {
  //     const value = await context.CheckDownloadProgress(gitupper_id);
  //     if (value !== 100) {
  //       setProgress(value);
  //     } else {
  //       await processCompleted();
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  async function checkExistingSubmissions() {
    try {
      const value = await context.CheckDownloadProgress(gitupper_id); // checando se as submissões estão sendo baixadas
      await processCompleted();
      setData({ errorMessage: "", isLoading: false });
      // if (value !== 100) {
      //   initializeInterval();

      //   return false;
      // } else if (value === 100) {
      //   setProgress(value);
      //   await processCompleted();

      //   setData({ errorMessage: "", isLoading: false });
      //   return true;
      // }
    } catch (error) {
      console.log(error);
    }
  }

  function disabledInteractions() {
    return viewingSubmissions.submissions.length === 0 || data.isLoading;
  }

  async function processCompleted() {
    clearInterval(interval);

    const response = await context.GetPlatformSubmissions("beecrowd", bee_id);

    if (response.length > 0) {
      state.user.bee_submissions = response;

      dispatch({
        type: "LOGIN",
        payload: {
          user: state.user,
          isLoggedIn: true,
        },
      });
    }

    return false;
  }

  // function initializeInterval() {
  //   interval = setInterval(async () => {
  //     await checkDownloadProgress();
  //   }, 500);
  // }

  useEffect(async () => {
    // if (isBindedBeecrowd() && !hasBeecrowdSubmissions()) {
    //   await checkExistingSubmissions();
    // } else {
      setData({ errorMessage: "", isLoading: false });
    // }
  }, [state.user]);

  function handleChangePlatform(event) {
    const value = event.target.value;
    const platformName = value.name;

    let actual = platforms[platformName];
    let submissions_str = actual.platformPrefix + "_submissions";
    let submissions = state.user[submissions_str] || [];

    setPlatform(value);
    setviewingSubmissions({
      submissions: submissions,
      actualPlatform: platformName,
    });
    setRows(submissions);
  }

  function capitalize(platformName) {
    return platformName.charAt(0).toUpperCase() + platformName.slice(1);
  }

  return (
    <>
      <DashboardContainer>
        <ViewContainer>
          <DashboardButtonsContainer
            visible={viewingSubmissions.submissions.length > 0}
          >
            <Filter
              columns={submissionsColumns}
              filteringRows={viewingSubmissions.submissions}
              setFilteredRows={setRows}
              setSearchingValue={(value) => {
                setSearchText(value);
              }}
              searchValue={searchText}
              langOptions={langOptions}
              disabled={disabledInteractions()}
            />
          </DashboardButtonsContainer>

          <Select
            containerStyle={{
              top: 8,
              right: 20,
              position: "absolute",
            }}
            color={platform.color}
            onChange={handleChangePlatform}
            options={orderPlatformsBySubmissions().map((platform) => {
              return {
                value: platform,
                label: capitalize(platform.name),
                itemColor: platform.color,
              };
            })}
          />

          {data.isLoading ? (
            <div
              style={{
                display: "flex",
                height: "50%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <ProgressBar variant="buffer" value={progress} width={350} />
            </div>
          ) : viewingSubmissions.submissions.length > 0 ? (
            <SubmissionsPanel
              loading={data.isLoading}
              submissions={viewingSubmissions.submissions}
              submissionsColumns={submissionsColumns}
              searchText={searchText}
              platform={viewingSubmissions.actualPlatform}
              maxHeight={maxHeight}
              rowsPerPage={viewingSubmissions.submissions.length > 0 ? 30 : 0}
              categoryOptions={categoryOptions}
              dateOptions={dateOptions}
              langOptions={langOptions}
              statusOptions={statusOptions}
            />
          ) : (
            <NotBind platform={platform} />
          )}
          {/* <JobsDrawer /> */}
        </ViewContainer>
      </DashboardContainer>
    </>
  );
}
