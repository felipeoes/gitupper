import React, { createContext, useReducer, useState } from "react";
import GetSubmissionsFetcher from "../../services/workers/submissionsFetcher/index";
import GetSubmissionsUploader from "../../services/workers/submissionsUploader/index";

import { getGithubToken, getJwtToken } from "../../services/api";

const WorkersContext = createContext({});

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_SUBMISSIONS":
      const platforms = action.payload.platforms; // platforms is a object containing platformPrefix: platformId
      const authToken = action.payload.authToken || getJwtToken();

      console.log("FETCH_SUBMISSIONS", platforms);
      console.log("FETCH_SUBMISSIONS", authToken);

      Object.keys(platforms).forEach((platformPrefix, platformId) => {
        const subFetcherWorker = GetSubmissionsFetcher({
          platformPrefix,
          platformId,
        });

        subFetcherWorker.postMessage({
          platformPrefix: platformPrefix,
          platformId: platformId,
          authToken: authToken,
        });

        state[platformPrefix] = subFetcherWorker;
      });

      return {
        ...state,
      };

    case "UPLOAD_SUBMISSIONS":
      console.log("UPLOAD_SUBMISSIONS");
      const owner = action.payload.owner;
      const repoName = action.payload.repoName;
      const path = action.payload.path;
      const submissions = action.payload.submissions;
      const commitMessage = action.payload.commitMessage;
      const githubToken = action.payload.token || getGithubToken();
      const platformName = action.payload.platformName;
      const setButtonLoading = action.payload.setButtonLoading;

      // const jobsQueue = state["jobsQueue"] || [];

      // jobsQueue.push({
      //   owner,
      //   repoName,
      //   path,
      //   submissions,
      //   commitMessage,
      //   githubToken,
      //   platformName,
      // });

      // state["jobsQueue"] = jobsQueue;

      const subUploaderWorker = GetSubmissionsUploader({
        githubToken,
        platformName,
        setButtonLoading,
      });

      subUploaderWorker.postMessage({
        owner,
        repoName,
        path,
        submissions,
        commitMessage,

      });

      state["submissionsUploader"] = subUploaderWorker;

      return {
        ...state,
        submissionsUploader: subUploaderWorker,
      };

    default:
      return state;
  }
};

export const WorkersProvider = ({ children }) => {
  const [workerState, dispatchWorker] = useReducer(reducer, {});

  return (
    <WorkersContext.Provider
      value={{
        workerState,
        dispatchWorker,
      }}
    >
      {children}
    </WorkersContext.Provider>
  );
};

export default WorkersContext;
