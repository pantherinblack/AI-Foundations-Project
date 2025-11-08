import {
  Autocomplete,
  Box,
  Button,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { FieldValues, useForm } from "react-hook-form";
import React, { ReactNode, useRef, useState } from "react";
import { apiResponse, requestBackend } from "./Util";
import { ThemePoemTab } from "./ThemePoemTab";
import { ImagePoemTab } from "./ImagePoemTab";
import Markdown from "react-markdown";

const poemTypes = ["Ballade", "Hymne", "Ode", "Haiku", "Sonett", "Limerick"];

async function fileToBase64(file: File): Promise<string> {
  return await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

async function stripBody(body: any, tab: number) {
  return tab === 0
    ? {
        api_key: body.api_key,
        poet: body.poet,
        type: body.type,
        topic: body.topic,
      }
    : {
        api_key: body.api_key,
        poet: body.poet,
        type: body.type,
        base64_image: await fileToBase64(body.image?.item(0)),
      };
}

export function BaseTab({ tab }: { tab: number }) {
  const { register, handleSubmit, watch } = useForm();
  const [poem, setPoem] = useState<apiResponse>();
  const audioRef = useRef<HTMLAudioElement>(null);

  const submit = async (values: FieldValues) => {
    setPoem(await requestBackend(await stripBody(values, tab)));
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
        {tab === 0 ? (
          <ThemePoemTab register={register} />
        ) : (
          <ImagePoemTab register={register} watch={watch} />
        )}

        <Grid size={12}>
          <Button type="submit" variant="contained" fullWidth>
            Gedicht generieren
          </Button>
        </Grid>

        {poem && (
          <Grid size={12}>
            <Paper sx={{ p: 3 }}>
              <Box
                gap={2}
                mb={2}
                display="flex"
                justifyContent="space-between"
                width="100%"
              >
                <Typography variant="h6" gutterBottom>
                  Gedicht
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => {
                    audioRef.current?.play();
                  }}
                >
                  Vorlesen
                  <audio
                    ref={audioRef}
                    src={`data:audio/mpeg;base64,${poem.audio}`}
                  ></audio>
                </Button>
              </Box>
              <Markdown>{poem.text}</Markdown>
            </Paper>
          </Grid>
        )}
      </Grid>
    </form>
  );
}
