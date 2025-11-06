import {
  Autocomplete,
  Button,
  Grid,
  TextField,
  Typography,
  Paper,
  Input,
} from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import { requestBackend } from "./Util";
import { useState } from "react";

const poemTypes = ["Ballade", "Hymne", "Ode", "Haiku", "Sonett", "Limerick"];

export function ThemePoemTab({ register }: { register: any }) {
  const [poemText, setPoemText] = useState<string>();

  const submit = async (values: FieldValues) => {
    setPoemText(await requestBackend(values));
  };

  return (
    <Grid size={12}>
      <TextField
        multiline
        minRows={3}
        fullWidth
        {...register("topic")}
        label="Thema des Gedichts"
      />
    </Grid>
  );
}
