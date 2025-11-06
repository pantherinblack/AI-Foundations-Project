import {
  Autocomplete,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import { useState } from "react";
import { requestBackend } from "./Util";

const poemTypes = ["Ballade", "Hymne", "Ode", "Haiku", "Sonett", "Limerick"];

export function ImagePoemTab() {
  const { register, handleSubmit, watch } = useForm<{
    poet: string;
    type: string;
    image: FileList;
    api_key: string;
  }>();
  const [poemText, setPoemText] = useState<string>();
  const file = watch().image?.item(0);
  const image = file ? URL.createObjectURL(file) : undefined;

  const submit = async (values: FieldValues) => {
    setPoemText(await requestBackend(values));
  };
  return (
    <form
      onSubmit={handleSubmit(submit)}
      style={{ display: "flex", justifyContent: "center", width: "100%" }}
    >
      <Grid container spacing={2}>
        <Grid size={12}>
          <TextField
            type="password"
            label="API-Key"
            {...register("api_key", { required: true })}
            fullWidth
          />
        </Grid>
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            {image && (
              <Box
                component="img"
                src={image}
                alt="Selected"
                sx={{
                  maxWidth: 240,
                  width: "100%",
                  height: "auto",
                  borderRadius: 1,
                  boxShadow: 1,
                }}
              />
            )}
            <Button component="label" variant="outlined" sx={{ height: 48 }}>
              Bild auswählen
              <input
                type="file"
                accept="image/*"
                capture="environment"
                style={{ display: "none" }}
                {...register("image")}
              />
            </Button>
          </Box>
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
