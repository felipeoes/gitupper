export function getGithubUrlToken(url) {
  let code = null;
  const hasUserToken = url.includes("?code=");

  if (hasUserToken) {
    const newUrl = url.split("?code=");
    window.history.pushState({}, null, newUrl[0]);

    code = newUrl[1];
  }

  return code;
}

export async function handleOnLoginGithub(code, context, dispatch, alreadyLoggedIn) {
  const user = context.state.user;
  const response = await context.LoginGithub(code, user);

  try {
    dispatch({
      type: "LOGIN",
      payload: {
        user: response.user,
        isLoggedIn: true,
        github_token: response.github_token,
        alreadyLoggedIn: alreadyLoggedIn,
      },
    });
  } catch (error) {
    console.log(error);
  }
}
