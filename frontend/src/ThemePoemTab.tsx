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

export function ThemePoemTab({ register }: { register: any }) {
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
