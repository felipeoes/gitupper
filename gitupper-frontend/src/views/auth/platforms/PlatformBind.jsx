import { useContext, useState } from "react";
import { useTheme } from "styled-components";
import {
  AuthContext,
  NotificationsContext,
  WorkersContext,
} from "../../../contexts/";
import {
  BindMessage,
  Container,
  ModalFormContainer,
  StyledALink,
} from "./styles";
import { PlatformLogo } from "../bind/styles";
import Input from "../../../components/input/Input";
import { LoginOptionsText } from "../../non-auth/login/styles";
import Button from "../../../components/button/Button";
import ElevatedButtons from "../../../components/elevatedButtons/ElevatedButtons";
import { paths } from "../../../services/utils/paths";
import ErrorMessage from "./../../../components/errorMessage/ErrorMessage";
import { loadWorker } from "../../../services/workers/createWorker";
import SubmissionsFetcherWorker from "../../../services/workers/submissionsFetcher/submissionsFetcher";
import api, { API_AUTH_TOKEN_NAME } from "../../../services/api";

export default function PlatformBind(props) {
  const theme = useTheme();
  const context = useContext(AuthContext);
  const { stateNotif, dispatchNotif } = useContext(NotificationsContext);
  const { workerState, dispatchWorker } = useContext(WorkersContext);
  const { state, dispatch, getJwtToken } = context;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", token: "" });
  const [disabledForm, setDisabledForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [firstButtonElevated, setFirstButtonElevated] = useState(true);

  const firstButtonValue = "Email e senha";
  const secondButtonValue = "Token";

  // props
  const platformPrefix = props.platformPrefix;
  const platformLogo = props.platformLogo;
  const platformColor = props.platformColor;
  const platformResetPath = props.platformResetPath;

  async function handleOnCreateRepoEvent(repoData) {
    const repoSubmissions = [];

    repoData.associated_submissions.forEach((submission) => {
      repoSubmissions.push({
        object_id: submission.id,
        submission: platformPrefix,
      });
    });

    const res = await context.CreateRepoSubmissions(repoSubmissions);
    if (res) {
      repoData.associated_submissions = repoSubmissions.map(
        (submission) => submission.object_id
      );

      context.CreateRepoEvent(repoData);
    } else {
      console.log("Erro ao criar evento de repositorio");
    }
  }

  // const subFetcherWorker = loadWorker(SubmissionsFetcherWorker);

  // subFetcherWorker.onmessage = function (message) {
  //   console.log("Message from worker: ", message.data);

  //   if (message.data.submissions) {
  //     const user = state.user;
  //     user[`${platformPrefix}_submissions`] = message.data.submissions;

  //     dispatch({
  //       type: "LOGIN",
  //       payload: {
  //         user: user,
  //         isLoggedIn: true,
  //       },
  //     });

  //     let notif = {
  //       timestamp: new Date(),
  //       title: "Submissões atualizadas",
  //       content: (
  //         <div>
  //           <p>"Suas submissões foram atualizadas com sucesso."</p>
  //         </div>
  //       ),
  //     };

  //     dispatchNotif({
  //       type: "ADD_NOTIFICATION",
  //       payload: {
  //         notification: notif,
  //       },
  //     });
  //   }
  // };

  async function handleOnAuthenticateUser(userObj) {
    const response = await context.BindPlatform(userObj);

    if (response.errors) {
      return response;
    }

    let newUserData = response.data;
    console.log(newUserData);
    // user[`${platformPrefix}_id`] = response.data[`${platformPrefix}_id`];

    const token = getJwtToken();

    // subFetcherWorker.postMessage({
    //   // find the platform which has platformPrefix
    //   platform: platformPrefix,
    //   // Object.keys(platforms_obj).find(
    //   //   (platform) =>
    //   //     platforms_obj[platform]["platformPrefix"] === platformPrefix
    //   // ),
    //   platform_id: user[`${platformPrefix}_id`],
    //   authToken: token,
    //   fetchURL: api.defaults.baseURL + "/fetch/submissions/",
    // });

    // let notificationTemp = {
    //   timestamp: new Date(),
    //   title: "Vinculação de plataforma",
    //   content: (
    //     <div>
    //       <p>Sua conta foi vinculada a {platformPrefix} com sucesso!</p>
    //     </div>
    //   ),
    // };

    // dispatchNotif({
    //   type: "ADD_NOTIFICATION",
    //   payload: {
    //     notification: notificationTemp,
    //   },
    // });

    const platforms = {};
    platforms[platformPrefix] = newUserData?.platforms_users[platformPrefix];

    dispatchWorker({
      type: "FETCH_SUBMISSIONS",
      payload: {
        platforms: platforms,
        authToken: token,
      },
    });

    // update old userData with new userData only the matching keys
    const user = Object.assign(state.user, newUserData);

    dispatch({
      type: "LOGIN",
      payload: {
        user: user,
        isLoggedIn: true,
      },
    });

    return true;

    // setTimeout(() => {

    //   // const repoData = {
    //   //   user: user.gitupper_id,
    //   //   message: "Novo repositório pessoal criado!",
    //   //   is_public: false,
    //   //   associated_submissions: user[`${platformPrefix}_submissions`],
    //   //   link: "https://personal.gitupper.com",
    //   // };

    //   // handleOnCreateRepoEvent(repoData);
    //   return true;
    // }, 2000);
  }

  function handleOnChangeForm(e) {
    const { value, name } = e.target;
    if (name === "email") {
      setEmail(value);
    }
    if (name === "password") {
      setPassword(value);
    }

    if (name === "token") {
      setToken(value);
    }
  }

  function resetFormOnError(errors) {
    if (errors.login || errors.password) {
      setErrors({ email: errors.error, password: errors.error, token: null });
    } else if (errors.token) {
      setErrors({ email: null, password: null, token: errors.error });
    } else {
      setErrors({
        email: errors.error,
        password: errors.error,
        token: errors.error,
      });
    }
    setLoading(false);
  }

  function checkButtonDisabled(loginByToken) {
    let value = true;

    loginByToken ? (value = !token) : (value = !email || !password);

    return value;
  }

  const onSubmit = async (e) => {
    e.preventDefault();

    let user = null;
    !firstButtonElevated && token
      ? (user = {
          session: token,
          gitupper_id: state.user.gitupper_id,
          platform_prefix: platformPrefix,
        })
      : (user = {
          login: email,
          password: password,
          gitupper_id: state.user.gitupper_id,
          platform_prefix: platformPrefix,
        });

    const res = await handleOnAuthenticateUser(user);

    if (res && res.errors) {
      resetFormOnError(res.errors);
    }
    setDisabledForm(false);

    setLoading(false);
    props.setLoading(false);
  };

  function handleOnSubmit(e) {
    setDisabledForm(true);
    setLoading(true);
    props.setLoading(true);

    onSubmit(e);
  }

  function handleOnSetElevatedButton(buttonValue) {
    if (buttonValue === firstButtonValue) {
      setFirstButtonElevated(true);
    } else {
      setFirstButtonElevated(false);
    }
  }

  return (
    <Container>
      <PlatformLogo src={platformLogo} />

      <ElevatedButtons
        height={40}
        width={320}
        buttonWidth={200}
        bgColor={platformColor}
        color={platformColor}
        value1={firstButtonValue}
        value2={secondButtonValue}
        onClick={(value) => handleOnSetElevatedButton(value)}
        elevated={firstButtonElevated}
        marginTop={32}
        disabled={disabledForm}
      />

      <ModalFormContainer onSubmit={handleOnSubmit}>
        <BindMessage color={platformColor} marginTop={24}>
          Vincular conta
        </BindMessage>

        {firstButtonElevated ? (
          <>
            <Input
              borderColor={theme.colors.disabledButton}
              bgColor="transparent"
              placeholder="Digite seu email"
              autoFocus
              type="email"
              name="email"
              color={theme.colors.semiblack}
              label="Email"
              labelColor={theme.colors.black}
              value={email}
              required
              lblTop={16}
              marginTop={8}
              onChange={(e) => handleOnChangeForm(e)}
              error={errors.email}
              disabled={disabledForm}
              activeColor={platformColor}
            />

            <Input
              borderColor={theme.colors.disabledButton}
              bgColor="transparent"
              placeholder="Digite sua senha"
              type="password"
              name="password"
              color={theme.colors.semiblack}
              label="Senha"
              labelColor={theme.colors.black}
              iconColor={theme.colors.black}
              value={password}
              required
              marginTop={8}
              lblTop={16}
              onChange={(e) => handleOnChangeForm(e)}
              error={errors.password}
              disabled={disabledForm}
              activeColor={platformColor}
            />
            <ErrorMessage error={errors.email || errors.password} />

            <StyledALink
              href={platformResetPath}
              target="_blank"
              marginTop={12}
              alignSelf="end"
            >
              <LoginOptionsText color={platformColor} textAlign="end">
                Esqueceu a senha?
              </LoginOptionsText>
            </StyledALink>
          </>
        ) : (
          <>
            <Input
              borderColor={theme.colors.disabledButton}
              bgColor="transparent"
              placeholder="Digite o token de acesso"
              autoFocus
              type="text"
              name="token"
              color={theme.colors.semiblack}
              label="Token"
              labelColor={theme.colors.black}
              value={token}
              required
              marginTop={10}
              onChange={(e) => handleOnChangeForm(e)}
              error={errors.token}
              disabled={disabledForm}
              activeColor={platformColor}
            />
            <ErrorMessage error={errors.token} />

            <StyledALink href={paths.getToken} target="_blank">
              <LoginOptionsText
                color={platformColor}
                textAlign="end"
                marginTop={8}
              >
                Não sabe como obter o token?
              </LoginOptionsText>
            </StyledALink>
          </>
        )}

        <Button
          btnType="loading"
          type="submit"
          width={320}
          marginTop={16}
          bgColor={platformColor}
          disabled={checkButtonDisabled(!firstButtonElevated) || loading}
          loading={loading}
          fontWeight="bold"
        >
          Autenticar
        </Button>
      </ModalFormContainer>
    </Container>
  );
}
