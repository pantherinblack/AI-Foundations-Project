import {
  Autocomplete,
  Box,
  Button,
  Grid,
  TextField,
  Typography,
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
  }>();
  const [poemText, setPoemText] = useState<string>();
  const file = watch().image?.item(0);
  const image = file ? URL.createObjectURL(file) : undefined;
  console.log(image);

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
          {image && <img src={image} alt="Selected Image" />}
          <Button component="label" variant="outlined">
            Bild auswählen
            <input
              type="file"
              accept="image/png"
              capture="environment"
              style={{ height: 0, width: 0, overflow: "hidden" }}
              {...register("image")}
            />
          </Button>
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
