import React from "react";
import { Box, Icon, Tab, Tabs, Typography } from "@mui/material";
import { ThemePoemTab } from "./ThemePoemTab";
import { ImagePoemTab } from "./ImagePoemTab";

export function App() {
  let [tab, setTab] = React.useState(0);

  return (
    <Box>
      <header>
        <Typography variant="h1">KI Gedicht generierung</Typography>
      </header>
      <Typography>
        Sie können ein Gedicht mithilfe eines Themas oder eines Bildes
        generieren.
      </Typography>
      <Tabs centered value={tab} onChange={(_, newValue) => setTab(newValue)}>
        <Tab label="Gedicht durch Text" value={0} />
        <Tab label="Gedicht durch Bild" value={1} />
      </Tabs>
      <Box mt={4} justifyContent="center" display="flex">
        {tab === 0 ? <ThemePoemTab /> : <ImagePoemTab />}
      </Box>
    </Box>
  );
}
