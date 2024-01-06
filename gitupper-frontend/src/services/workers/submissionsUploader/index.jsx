/* eslint-disable import/no-webpack-loader-syntax */
import { useContext } from "react";
import { AuthContext, NotificationsContext } from "../../../contexts/";
import { capitalize } from "../../utils/functions";
import { platforms_obj } from "../../utils/platforms";

import { loadWorker } from "../../workers/createWorker";
import SubmissionsUploaderWorker from "./submissionsUploader";

export default function GetSubmissionsUploader({
  githubToken,
  platformName,
  setButtonLoading,
}) {
  const context = useContext(AuthContext);
  const { stateNotif, dispatchNotif } = useContext(NotificationsContext);
  const { state, dispatch } = context;

  const workerProps = {
    token: githubToken,
  };

  const subUploaderWorker = loadWorker(SubmissionsUploaderWorker, workerProps);

  let notificationId = null;

  const platform = Object.values(platforms_obj).find(
    (platform) => platform.name.toLowerCase() === platformName.toLowerCase()
  );

  subUploaderWorker.onmessage = (message) => {
    // console.log("Message from worker: ", message.data);
    // console.log("Current user: ", state.user);

    const { data } = message;
    const { command } = data;

    switch (command) {
      case "initialized":
        function Content({ repoLink }) {
          return (
            <div>
              <p>
                Fazendo o upload de {data.totalSubmissions} submissões da
                plataforma{" "}
                <span style={{ fontWeight: "bold", color: platform.color }}>
                  {capitalize(platformName)}
                </span>
              </p>

              {/* {repoLink && (
                <p>
                  <button
                    onClick={() => window.open(repoLink, "_blank")}
                    style={{
                      fontSize: "1.2rem",
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: platform.color,
                      padding: "0.5rem 1rem",
                      borderRadius: "0.5rem",
                      border: "none",
                    }}
                  >
                    Clique aqui para acessar o repositório
                  </button>
                </p>
              )} */}
            </div>
          );
        }

        let notif = {
          timestamp: new Date(),
          content: <Content />,
          type: "submission_job",
          value: 0,
        };

        dispatchNotif({
          type: "ADD_NOTIFICATION",
          payload: {
            notification: notif,
          },
        });
        notificationId = stateNotif.offset;

        break;

      case "progress":
        // update notification
        let notifProgress = {
          content: <Content />,
          type: "submission_job",
          value: data.progress,
        };

        dispatchNotif({
          type: "UPDATE_NOTIFICATION",
          payload: {
            notification: notifProgress,
            index: notificationId,
          },
        });

        break;
      case "error":
        console.log("Error: ", data.error);
        setButtonLoading((prevState) => ({ ...prevState, upload: true }));
        break;
      case "done":
        console.log("Done: ", data);
        const repoLink = data.repoLink;

        console.log("repoLink: ", repoLink);
        let notifDone = {
          content: <Content repoLink={repoLink} />,
          type: "submission_job",
          value: data.progress,
          repoLink: repoLink,
        };

        dispatchNotif({
          type: "UPDATE_NOTIFICATION",
          payload: {
            notification: notifDone,
            index: notificationId,
          },
        });

        dispatchNotif({
          type: "SERIALIZE_NOTIFICATION",
          payload: {
            notification: notifDone,
            index: notificationId,
          },
        });

        dispatch({
          type: "SET_UPLOADING_SUBMISSIONS",
          payload: {
            hasOngoingUpload: false,
          },
        });

        // terminate worker
        subUploaderWorker.terminate();
        break;
      default:
        console.log("Unknown command: ", command);
        break;
    }
  };

  subUploaderWorker.onerror = (error) => {
    console.log("Error: ", error);
  };

  return subUploaderWorker;
}
