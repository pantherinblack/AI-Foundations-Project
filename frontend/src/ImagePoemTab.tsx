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

export function ImagePoemTab({
  register,
  watch,
}: {
  register: any;
  watch: any;
}) {
  const file = watch().image?.item(0);
  const image = file ? URL.createObjectURL(file) : undefined;
  return (
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
  );
}
