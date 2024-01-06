/* eslint-disable no-restricted-globals */
export default function SubmissionsFetcherWorker({ fetchURL }) {
  async function fetchSubmissions(platform, authToken) {
    // fetch submissions from platform using native API
    const data = {
      platform_prefix: platform,
    };

    console.log(data);

    const response = await fetch(fetchURL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    });

    console.log("************** RESPONSE Fetcher", response)

    let res = await response.json();

    if (res.error) {
      return JSON.stringify(res);
    }

    // if success, res will be an array of submissions
    let submissions = res;

    console.log("************** DADOS DO WORKER", submissions);

    if (response.status === 200 && submissions) {
      // concatena submissões aceitas e não aceitas, caso existam
      let accepted = submissions?.accepted || [];
      let notAccepted = submissions?.not_accepted || [];

      if (accepted.length > 0 || notAccepted.length > 0) {
        submissions = accepted.concat(notAccepted);
      }

      return submissions;
    }

    return JSON.stringify(response); // é necessário retornar uma string como mensagem
  }

  onmessage = async function (e) {
    console.log("Worker: Message received from main script");
    const platform = e.data.platformPrefix;
    const authToken = e.data.authToken;

    const response = await fetchSubmissions(platform, authToken);

    if (typeof response === "string") {
      postMessage({
        command: "error",
        error: JSON.parse(response),
      });
      return;
    }

    postMessage({
      command: "done",
      submissions: response,
    });

    close();
  };
}
