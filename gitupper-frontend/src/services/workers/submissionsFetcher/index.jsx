import { useContext, Fragment } from "react";
// import ReactDOMServer from "react-dom/server";

import { AuthContext, NotificationsContext } from "../../../contexts/";

import { loadWorker } from "../../workers/createWorker";
import SubmissionsFetcherWorker from "../../workers/submissionsFetcher/submissionsFetcher";

import api from "../../../services/api";
import { platforms_obj } from "../../utils/platforms";
import { capitalize } from "../../utils/functions";

const submissionsFetchURL = api.defaults.baseURL + "/fetch/submissions/";

const workerProps = {
  fetchURL: submissionsFetchURL,
};

export default function GetSubmissionsFetcher({ platformPrefix, platformId }) {
  const context = useContext(AuthContext);
  const { dispatchNotif } = useContext(NotificationsContext);
  const { state, dispatch } = context;

  const subFetcherWorker = loadWorker(SubmissionsFetcherWorker, workerProps);

  const platform = Object.values(platforms_obj).find(
    (platform) => platform.platformPrefix === platformPrefix
  );

  function handleOnMessageError(messageData) {
    console.log("Error: ", messageData);
    const serverData = messageData?.error;

    if (serverData?.error?.toLowerCase().includes("token inválido")) {
      function Content() {
        return (
          <div>
            <p>
              O token de acesso da plataforma{" "}
              <span style={{ fontWeight: "bold", color: platform.color }}>
                {capitalize(platform.name)}
              </span>{" "}
              está inválido ou expirado. Por favor, clique no botão abaixo para
              atualizar suas credenciais de acesso.
            </p>
          </div>
        );
      }

      let notif = {
        timestamp: new Date(),
        title: "Token inválido ou expirado",
        content: <Content />,
        type: "invalid_token",
      };

      dispatchNotif({
        type: "ADD_NOTIFICATION",
        payload: {
          notification: notif,
        },
      });
    } else {
      console.log("Error: ", messageData);
      let notif = {
        timestamp: new Date(),
        title: "Erro ao atualizar submissões",
        content: (
          <div>
            <p>
              Ocorreu um erro ao atualizar suas submissões da plataforma{" "}
              <span style={{ fontWeight: "bold", color: platform.color }}>
                {capitalize(platform.name)}
              </span>
              . Verifique se as suas credenciais de acesso estão incorretas ou
              expiradas.
            </p>
          </div>
        ),
      };

      dispatchNotif({
        type: "ADD_NOTIFICATION",
        payload: {
          notification: notif,
        },
      });
    }
  }

  subFetcherWorker.onmessage = function (message) {
    const messageData = message.data;

    if (messageData?.command === "error") {
      handleOnMessageError(messageData);
    } else {
      if (messageData?.submissions) {
        const submissions = messageData.submissions;

        let notif = {
          timestamp: new Date(),
          title: "Submissões atualizadas",
          content: (
            <div>
              <p>
                Suas submissões da plataforma{" "}
                <span style={{ fontWeight: "bold", color: platform.color }}>
                  {capitalize(platform.name)}
                </span>{" "}
                foram atualizadas com sucesso.
              </p>
            </div>
          ),
        };

        dispatchNotif({
          type: "ADD_NOTIFICATION",
          payload: {
            notification: notif,
          },
        });

        dispatch({
          type: "UPDATE_USER_SUBMISSIONS",
          payload: {
            platformPrefix: platformPrefix,
            platformId: platformId,
            submissions: submissions,
          },
        });
      }
    }

    // terminate worker
    subFetcherWorker.terminate();
  };

  subFetcherWorker.onerror = function (error) {
    console.log("Error: ", error);
    handleOnMessageError(error);
  };

  return subFetcherWorker;
}
