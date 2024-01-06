/* eslint-disable no-restricted-globals */
export default function SubmissionsUploaderWorker({ token }) {
  const github_api_base_url = "https://api.github.com";

  async function getRequest(endpoint) {
    const url = github_api_base_url + endpoint;

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const res = await response.json();

    if (res.error) {
      return JSON.stringify(res);
    }

    return res;
  }

  async function postRequest(endpoint, body) {
    const url = github_api_base_url + endpoint;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const res = await response.json();
    if (res.error) {
      return JSON.stringify(res);
    }

    return res;
  }

  async function putRequest(endpoint, body) {
    const url = github_api_base_url + endpoint;

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    const res = await response.json();
    if (res.error) {
      return JSON.stringify(res);
    }

    return res;
  }

  const base64_arraybuffer = async (data) => {
    const base64url = await new Promise((r) => {
      const reader = new FileReader();
      reader.onload = () => r(reader.result);
      reader.readAsDataURL(new Blob([data]));
    });

    return base64url.split(",", 2)[1];
  };

  function sendInitializedMessage(submissions) {
    postMessage({
      command: "initialized",
      totalSubmissions: submissions.length,
    });
  }

  function sendProgressMessage(progress, totalSubmissions) {
    postMessage({
      command: "progress",
      progress: progress,
      totalSubmissions: totalSubmissions,
    });
  }

  function sendDoneMessage(repoLink, totalSubmissions) {
    postMessage({
      command: "done",
      repoLink: repoLink,
      totalSubmissions: totalSubmissions,
      progress: 100,
    });
  }

  async function uploadSubmissions(
    owner,
    repoName,
    path,
    submissions,
    commitMessage
  ) {
    try {
      let response = null;

      const contentsUrl = `/repos/${owner}/${repoName}/contents`;

      let isEmpty = false;
      try {
        response = await getRequest(contentsUrl);

        if (response.message === "This repository is empty.") {
          isEmpty = true;
        }
      } catch (error) {
        console.log(error);
      }

      if (isEmpty) {
        const file = new Blob([`${repoName}`], {
          type: "text/plain",
        });

        const readMePath = `${contentsUrl}/README.md`;

        response = await putRequest(readMePath, {
          message: "Repositório criado pelo Gitupper",
          content: await base64_arraybuffer(file),
          encoding: "base64",
        });
      }

      response = await getRequest(
        `/repos/${owner}/${repoName}/git/ref/heads/main`
      );

      const main = response;
      let treeItems = [];
      let tree = null;

      let current = 0;

      sendInitializedMessage(submissions);
      for (let submission of submissions) {
        const data = await postRequest(
          `/repos/${owner}/${repoName}/git/blobs`,
          {
            content: submission.source_code,
            encoding: "utf-8",
          }
        );

        let srcCodePath = `${path}/${submission.path}/${submission.id}_${submission.filename}`;
        treeItems.push({
          path: srcCodePath,
          sha: data.sha,
          mode: "100644",
          type: "blob",
        });

        // update progress
        current += 1;
        sendProgressMessage(
          Math.round((current / submissions.length) * 100),
          submissions.length
        );
      }

      response = await postRequest(`/repos/${owner}/${repoName}/git/trees`, {
        owner,
        repo: repoName,
        tree: treeItems,
        base_tree: main.object.sha,
      });

      tree = response;

      response = await postRequest(`/repos/${owner}/${repoName}/git/commits`, {
        message: commitMessage,
        tree: tree.sha,
        parents: main ? [main.object.sha] : [],
      });

      const commit = response;

      const ref = "heads/main";
      response = await postRequest(
        `/repos/${owner}/${repoName}/git/refs/${ref}`,
        {
          sha: commit.sha,
        }
      );

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  onmessage = async function (e) {
    console.log("Worker: Message received from main script", e.data);
    const owner = e.data?.owner;
    const repoName = e.data?.repoName;
    const path = e.data?.path;
    const submissions = e.data?.submissions;
    const commitMessage = e.data?.commitMessage;

    const created = await uploadSubmissions(
      owner,
      repoName,
      path,
      submissions,
      commitMessage
    );

    if (typeof response === "string") {
      postMessage({
        command: "error",
        error: JSON.parse(created),
      });

      return;
    } else if (!created) {
      postMessage({
        command: "error",
        error: "Não foi possível criar o repositório",
      });
      return;
    }

    const repoLink = `https://github.com/${owner}/${repoName}`;

    sendDoneMessage(repoLink, submissions.length);

    close();
  };
}
