import {
  Autocomplete,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
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
      style={{ display: "flex", justifyContent: "center", width: "100%" }}
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
          <Button type="submit" variant="contained" fullWidth>
            Gedicht generieren
          </Button>
        </Grid>

        {poemText && (
          <Grid size={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Gedicht
              </Typography>
              <Typography whiteSpace="pre-line">{poemText}</Typography>
            </Paper>
          </Grid>
        )}
      </Grid>
    </form>
  );
}
