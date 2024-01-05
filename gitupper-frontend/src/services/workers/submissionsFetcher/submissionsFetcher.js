export default function SubmissionsFetcherWorker() {
  async function fetchSubmissions(platform, authToken) {
    // fetch submissions from platform using native API
    const data = {
      platform_prefix: platform,
    };

    console.log(data);

    const response = await fetch(`http://127.0.0.1:8000/fetch/submissions/`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify(data),
    });

    const responseData = await response.json();

    console.log("************** DADOS DO WORKER", responseData);

    let submissions = responseData[`${platform}_submissions`];

    if (response.status === 200 && submissions) {
      // concatena submissões aceitas e não aceitas, caso existam
      let accepted = submissions?.accepted || [];
      let notAccepted = submissions?.not_accepted || [];

      if (accepted.length > 0 || notAccepted.length > 0) {
        submissions = accepted.concat(notAccepted);
      }

      return submissions;
    }

    return response;
  }

  onmessage = async function (e) {
    console.log("Worker: Message received from main script");
    const platform = e.data.platform;
    const authToken = e.data.authToken;

    const submissions = await fetchSubmissions(platform, authToken);

    postMessage({
      command: "done",
      submissions: submissions,
    });
  };
}
