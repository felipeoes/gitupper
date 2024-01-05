import { useState } from "react";
import {
  TextField,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { BindMessage, Container } from "../../../../platforms/styles";
import Button from "./../../../../../../components/button/Button";

import { useTheme } from "styled-components";

export default function NewRepoModal({ handleOnNewRepo, handleOnClose }) {
  const [repoName, setRepoName] = useState("");

  const theme = useTheme();
  const handleClose = () => {
    setRepoName("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    handleOnNewRepo(repoName);

    handleClose();
    handleOnClose();
  };

  return (
    <Container width={446}>
      <DialogTitle>Criar um novo repositório</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Deseja fazer o upload de suas submissões para um novo repositório?
          Você pode criá-lo aqui mesmo!
        </DialogContentText>

        <BindMessage color={theme.colors.blackLight} marginTop={32}>
          Nome do repositório
        </BindMessage>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          fullWidth
          value={repoName}
          placeholder="Digite o nome do repositório"
          onChange={(event) =>
            setRepoName(event.target.value.replace(/\s/g, "-"))
          }
          type="text"
          variant="outlined"
          sx={{
            mt: 0,
            "& .MuiOutlinedInput-root": {
              height: 38,
              pt: 0,
              margin: 0,
            },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          type="submit"
          onClick={handleSubmit}
          width={220}
          bgColor={theme.colors.primary}
          color={theme.colors.white}
          marginBottom={32}
          disabled={repoName.length === 0}
        >
          Confirmar
        </Button>
      </DialogActions>
    </Container>
  );
}
