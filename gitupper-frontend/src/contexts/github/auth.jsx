import { Octokit } from "octokit";
import jwt_decode from "jwt-decode";

import api, {
  apiAuth,
  apiGithub,
  API_BASE_URL,
  API_AUTH_TOKEN_NAME,
  getGithubToken,
  GITHUB_TOKEN_NAME,
} from "../../services/api";

import { currentPlatforms as platforms } from "../../services/utils/platforms";

async function getFileFromUrl(url, name, defaultType = "image/jpg") {
  const response = await fetch(url);
  const data = await response.blob();
  return new File([data], name, {
    type: data.type || defaultType,
  });
}

export async function GetPlatformSubmissions(
  platform,
  platform_id,
  page,
  limit,
  problem_name
) {
  try {
    const response = await api.get(
      `/users/submissions/${platform}/${platform_id}/?page=${page}&limit=${limit}` +
        (problem_name ? `&problem_name=${problem_name}` : "")
    );

    if (response.status === 200 && response.data.results) {
      return response.data;
    } else if (!response.data.results) {
      return false;
    }
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function BindExistingSubmissions(user) {
  for (var platform in platforms) {
    let actualPlatform = platforms[platform];
    let platform_id = user[`${actualPlatform.platformPrefix}_id`];

    if (platform_id) {
      const submissions = await GetPlatformSubmissions(platform, platform_id);

      if (submissions.length > 0) {
        user[`${actualPlatform.platformPrefix}_id`] = platform_id;
        user[`${actualPlatform.platformPrefix}_submissions`] = submissions;
      }
    }
  }
}

async function checkRegistered(userData, gitupperUser) {
  let githubUser = userData.user;
  const github_id = githubUser.id;

  try {
    const data = {
      gitupper_id: gitupperUser?.gitupper_id, // send it to check if user is already registered and only need to bind github
      github_email: githubUser.email,
      github_id: github_id,
      github_token: userData.github_token,
    };

    const response = await api.post("/verify/github", data);

    if (response.status === 200 && response.data.tokens) {
      console.log("response.data.user", response.data.user);
      let gitupper_user = response.data.user;
      let tokens = response.data.tokens;

      await BindExistingSubmissions(gitupper_user);
      userData.user = gitupper_user;

      return { registered: true, authTokens: tokens };
    } else if (response.data.error || response.data.results.length === 0) {
      return false;
    }
  } catch (error) {
    console.log(error);
  }
}

export async function LoginGithub(code, gitupperUser) {
  const data = {
    code: code,
  };

  const response = await api.post("auth/github/", data, {
    headers: {},
  });

  try {
    const token = response.data["access_token"];

    const res = await apiGithub.get("user", {
      headers: {
        Authorization: `token ${token}`,
      },
    });

    let userData = {
      user: res.data,
      github_token: token,
    };

    const { registered, authTokens } = await checkRegistered(userData, gitupperUser);
    console.log("Registered: ", registered, "AuthTokens: ", authTokens);

    if (!registered) {
      let updatedUser = await RegisterGithubUser(userData);

      console.log("updatedUser", updatedUser);
      return updatedUser;
    }

    // add auth tokens to user
    userData["tokens"] = authTokens;

    return userData;
  } catch (error) {
    console.log(error);
    return null;
  }
}

async function RegisterGithubUser(userData) {
  const githubUser = userData.user;

  // temporary
  const generateRandomPass = (
    passwordLength = 12,
    passwordChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
  ) =>
    [...window.crypto.getRandomValues(new Uint32Array(passwordLength))]
      .map((x) => passwordChars[x % passwordChars.length])
      .join("");

  const randPass = generateRandomPass();
  let names = githubUser.name.split(" ");

  const file = await getFileFromUrl(
    githubUser.avatar_url,
    `${githubUser.id}.jpg`
  );

  let registerData = new FormData();
  registerData.append("first_name", names[0]);
  registerData.append("last_name", names[names.length - 1]);
  registerData.append("password", randPass);
  registerData.append("password2", randPass);
  registerData.append("email", githubUser.email);
  registerData.append("github_id", githubUser.id);
  registerData.append("profile_image", file);

  const response = await apiAuth.post(`/register/`, registerData);

  console.log("RegisterGithubUser response", response);
  if (response.data.tokens.access) {
    const responseUser = response.data.user;

    console.log("responseUser", responseUser);
    userData.user = responseUser;

    localStorage.setItem(API_AUTH_TOKEN_NAME, JSON.stringify(response.data));
  } else {
    localStorage.clear();
  }
  return userData;
}

const base64_arraybuffer = async (data) => {
  const base64url = await new Promise((r) => {
    const reader = new FileReader();
    reader.onload = () => r(reader.result);
    reader.readAsDataURL(new Blob([data]));
  });

  return base64url.split(",", 2)[1];
};

async function createGithubRepo(repoName, about) {
  const data = {
    name: repoName,
    description: about || "Gitupper Repository",
    private: false,
    has_issues: true,
    has_projects: true,
    has_wiki: true,
  };

  try {
    const response = await apiGithub.post("user/repos", data, {});

    if (response.status === 201) {
      return response.data;
    }
  } catch (error) {
    console.log(error.response);

    if (error.response.status === 422) {
      console.log("Repositório já existente");
      return true;
    }
  }
}

export async function GetUserRepos() {
  try {
    const user_res = await apiGithub.get("user", {});

    const userlogin = user_res.data.login;
    const reposPerPage = 100;
    let page = 1;

    let repos = [];
    while (true) {
      const response = await apiGithub.get(
        `user/repos?per_page=${reposPerPage}&page=${page}`
      );

      repos = repos.concat(response.data);
      if (response.data.length < reposPerPage) {
        break;
      }
      page++;
    }

    if (repos.length > 0) {
      const filteredRepos = repos.filter(
        (repo) => repo.owner.login === userlogin
      );

      const data = {
        repositories: filteredRepos,
        userLogin: userlogin,
      };
      return data;
    }
  } catch (error) {
    console.log(error.response);
    return error.response;
  }
}

const createCommit = async (
  owner,
  repoName,
  path,
  submissions,
  commitMessage,
  token
) => {
  try {
    const github = new Octokit({ auth: token });
    let response = null;

    try {
      response = await github.rest.repos.getContent({
        owner,
        repo: repoName,
        path: "",
      });
    } catch (error) {
      console.log(error);
    }

    const isEmpty = response === null;

    if (isEmpty) {
      const file = new Blob([`${repoName}`], {
        type: "text/plain",
      });

      await github.rest.repos.createOrUpdateFileContents({
        owner,
        repo: repoName,
        path: "README.md",
        message: "Repositório criado pelo Gitupper",
        content: await base64_arraybuffer(file),
        encoding: "base64",
      });
    }

    response = await github.rest.git.getRef({
      owner,
      repo: repoName,
      ref: "heads/main",
    });

    const main = response.data;
    let treeItems = [];
    let tree = null;

    for (let submission of submissions) {
      response = await github.rest.git.createBlob({
        owner,
        repo: repoName,
        content: submission.source_code,
        encoding: "utf-8",
      });
      let srcCodeGit = response.data;

      let srcCodePath = `${path}/${submission.path}/${submission.filename}`;
      treeItems.push({
        path: srcCodePath,
        sha: srcCodeGit.sha,
        mode: "100644",
        type: "blob",
      });
    }

    response = await github.rest.git.createTree({
      owner,
      repo: repoName,
      tree: treeItems,
      base_tree: main.object.sha,
    });

    tree = response.data;

    response = await github.rest.git.createCommit({
      owner,
      repo: repoName,
      message: commitMessage,
      tree: tree.sha,
      parents: main ? [main.object.sha] : [],
    });
    const commit = response.data;

    response = await github.rest.git.updateRef({
      owner,
      repo: repoName,
      ref: "heads/main",
      sha: commit.sha,
    });

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

export async function CreateGithubRepo({ owner, repoName, about }) {
  const created = await createGithubRepo(repoName, about);

  if (created) {
    console.log("Repositório criado com sucesso", created);
    const repoLink = `https://github.com/${owner}/${repoName}`;
    return repoLink;
  }

  return false;
}

export async function UploadSubmissions({
  repoName,
  path,
  owner,
  submissions,
  commitMessage,
  token,
}) {
  // const repoName = uploadData.repoName;

  // // await createGithubRepo(repoName);

  // const path = uploadData.path;
  // const owner = uploadData.owner;
  // const submissions = uploadData.submissions;
  // const token = getGithubToken().replace(/"/g, "");
  // const commitMessage = uploadData.commitMessage;

  const created = await createCommit(
    owner,
    repoName,
    path,
    submissions,
    commitMessage,
    token
  );

  if (created) return true;
  // if (created) {
  //   const repoLink = `https://github.com/${owner}/${repoName}`;
  //   return repoLink;
  // }

  return false;
}
