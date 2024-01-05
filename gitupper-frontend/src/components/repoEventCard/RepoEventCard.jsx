import { useState } from "react";
import { styled } from "@mui/material/styles";

import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Skeleton,
  Avatar,
  Badge,
  TextField,
} from "@mui/material";
import Button from "../button/Button";
import { useTheme } from "styled-components";

import { MdOutlineAddReaction } from "react-icons/md";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

export default function RepoEventCard({
  loading,
  profile_image,
  first_name,
  last_name,
  date_created,
  message,
  associated_submissions,
  comments,
}) {
  const [newComment, setNewComment] = useState(false);
  const theme = useTheme();

  return (
    <Card sx={{ marginBottom: 2 }}>
      <CardHeader
        avatar={
          loading ? (
            <Skeleton
              animation="wave"
              variant="circular"
              width={40}
              height={40}
            />
          ) : (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              variant="dot"
            >
              <Avatar alt="user profile image" src={profile_image} />
            </StyledBadge>
          )
        }
        title={
          loading ? (
            <Skeleton animation="wave" variant="text" width={100} height={16} />
          ) : (
            `${first_name} ${last_name}`
          )
        }
        subheader={
          loading ? (
            <Skeleton animation="wave" variant="text" width={140} height={14} />
          ) : (
            date_created
          )
        }
      />
      <CardContent>
        {loading ? (
          <Skeleton
            sx={{ height: 60 }}
            animation="wave"
            variant="rectangular"
          />
        ) : (
          <div>
            <h4 style={{ marginBottom: 8, marginTop: 0 }}>{message}</h4>
            <p style={{ margin: 0 }}>
              {`${first_name} ${last_name}`} criou um novo repositório{" "}
              {associated_submissions.length > 0 &&
                `com ${associated_submissions.length} submissões associadas `}{" "}
            </p>

            {comments.length > 0 && (
              <div>
                <h4 style={{ marginBottom: 8, marginTop: 4 }}>
                  {`${comments.length} comentários`}
                </h4>
                {comments.map((comment) => (
                  <Card key={comment.id}>
                    <CardHeader
                      avatar={
                        <StyledBadge
                          overlap="circular"
                          anchorOrigin={{
                            vertical: "bottom",
                            horizontal: "right",
                          }}
                          variant="dot"
                        >
                          <Avatar
                            alt="user profile image"
                            src={profile_image}
                          />
                        </StyledBadge>
                      }
                      title={`${first_name} ${last_name}`}
                      subheader={date_created}
                    />
                    <CardContent>
                      <p style={{ margin: 0 }}>{comment.message}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardActions>
        {loading ? (
          <Skeleton
            animation="wave"
            variant="rectangular"
            width={100}
            height={20}
          />
        ) : (
          <div style={{ display: "flex" }}>
            <Button
              Icon={MdOutlineAddReaction}
              iconMr={4}
              type="button"
              border={theme.colors.primary}
              bgColor="transparent"
              color={theme.colors.black}
              width={120}
              onClick={() => setNewComment(true)}
            >
              Comentar
            </Button>
            <Button
              Icon={MdOutlineAddReaction}
              iconMr={4}
              type="button"
              border={theme.colors.primary}
              bgColor="transparent"
              color={theme.colors.black}
              width={120}
              marginLeft={8}
            >
              Reagir
            </Button>
          </div>
        )}
      </CardActions>
      <CardContent>
        {newComment && (
          <div>
            <TextField
              id="outlined-basic"
              variant="outlined"
              style={{ width: "100%" }}
              placeholder="Digite seu comentário aqui"
            />
            <Button
              Icon={MdOutlineAddReaction}
              iconMr={4}
              type="button"
              border={theme.colors.primary}
              bgColor="transparent"
              color={theme.colors.black}
              width={120}
              marginTop={4}
            >
              Enviar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
