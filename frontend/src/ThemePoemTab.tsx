import {
  Autocomplete,
  Button,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import { requestBackend } from "./Util";
import { useState } from "react";

const poemTypes = ["Ballade", "Hymne", "Ode", "Haiku", "Sonett", "Limerick"];

export function ThemePoemTab() {
  const { register, handleSubmit } = useForm();
  const [poemText, setPoemText] = useState<string>();

  const submit = async (values: FieldValues) => {
    setPoemText(await requestBackend(values));
  };

  return (
    <form
      onSubmit={handleSubmit(submit)}
      style={{ display: "flex", justifyContent: "center" }}
    >
      <Grid container spacing={2}>
        <Grid size={6}>
          <TextField label="Name des Poeten" {...register("poet")} fullWidth />
        </Grid>
        <Grid size={6}>
          <Autocomplete
            fullWidth
            freeSolo
            renderInput={(params) => (
              <TextField
                label="Typ des Gedichts"
                {...register("type")}
                {...params}
              />
            )}
            options={poemTypes}
          />
        </Grid>
        <Grid size={12}>
          <TextField
            multiline
            minRows={3}
            fullWidth
            {...register("topic")}
            label="Thema des Gedichts"
          />
        </Grid>
        <Grid size={12}>
          <Button type="submit" variant="contained">
            Gedicht generieren
          </Button>
        </Grid>
        {poemText && (
          <Grid size={12}>
            <Typography variant="h3">Gedicht</Typography>
            <Typography>{poemText}</Typography>
          </Grid>
        )}
      </Grid>
    </form>
  );
}
