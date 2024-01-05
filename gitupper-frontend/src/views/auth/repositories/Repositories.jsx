import { useState, useEffect, useContext } from "react";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import { Container, RepositoriesContainer } from "./styles";
import RepoEventCard from "../../../components/repoEventCard/RepoEventCard";
import AuthContext from "../../../contexts/auth";
import { ViewContainer } from "../homepage/styles";

import { API_BASE_URL } from "../../../services/api";
import useWindowDimensions from "../../../services/utils/useWindowsDimensions";

export default function Repositories(props) {
  const context = useContext(AuthContext);
  const { user } = context.state;

  const [state, setState] = useState({
    isLoggedIn: false,
    messages: [],
    value: "",
    name: `${user.first_name} ${user.last_name}`,
    page: "repositories",
  });
  const [repositories, setRepositories] = useState([]);
  const [loading, setLoading] = useState(true);

  const maxHeight = useWindowDimensions().height - 60;
  const client = new W3CWebSocket(
    `ws://${API_BASE_URL.replace("http://", "")}/ws/repos/` +
      state.page +
      "/" +
      user.gitupper_id +
      "/"
  );

  const onButtonClicked = (e) => {
    e.preventDefault();

    client.send(
      JSON.stringify({
        type: "message",
        message: state.value,
        name: state.name,
      })
    );

    setState({ ...state, value: "" });
  };

  useEffect(() => {
    async function loadRepositories() {
      const response = await context.GetRepoEvents();

      if (response && response.results) {
        setRepositories(response.results);
      }

      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }

    client.onopen = () => {
      console.log("WebSocket Client Connected");
    };

    client.onmessage = (message) => {
      const dataFromServer = JSON.parse(message.data);
      console.log("got reply! ", message.type);
      if (dataFromServer) {
        setState((state) => ({
          ...state,
          messages: [
            ...state.messages,
            {
              msg: dataFromServer.message,
              name: dataFromServer.name,
            },
          ],
        }));
      }
    };

    loadRepositories();
  }, []);

  return (
    <Container>
      <ViewContainer>
        {/* <div>
          Repositórios
          <Paper
            style={{
              maxHeight: 500,
              overflow: "auto",
              boxShadow: "none",
            }}
          >
            {state.messages.map((message) => (
              <Card>
                <CardHeader
                  avatar={
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      variant="dot"
                    >
                      <Avatar
                        alt="user profile image"
                        src={user.profile_image}
                      />
                    </StyledBadge>
                  }
                  title={message.name}
                  subheader={message.msg}
                />
              </Card>
            ))}
          </Paper>
          <form noValidate onSubmit={onButtonClicked}>
            <TextField
              id="outlined-helperText"
              label="Make a comment"
              defaultValue="Default Value"
              variant="outlined"
              value={state.value}
              fullWidth
              onChange={(e) => {
                setState({ ...state, value: e.target.value });
                //   value = state.value;
              }}
            />
            <Button type="submit" fullWidth variant="contained" color="primary">
              Start Chatting
            </Button>
          </form>
        </div> */}
        <RepositoriesContainer>
          <div style={{ maxHeight: maxHeight, overflow: "auto" }}>
            {loading
              ? Array(3)
                  .fill(0)
                  .map((_, index) => (
                    <RepoEventCard key={index} loading={true} />
                  ))
              : repositories.map((repository) => (
                  <RepoEventCard
                    key={repository.id}
                    loading={loading}
                    profile_image={user.profile_image}
                    first_name={repository.first_name}
                    last_name={repository.last_name}
                    date_created={repository.date_created}
                    message={repository.message}
                    associated_submissions={repository.associated_submissions}
                    comments={repository.comments}
                  />
                ))}
          </div>
        </RepositoriesContainer>
      </ViewContainer>
    </Container>
  );
}
