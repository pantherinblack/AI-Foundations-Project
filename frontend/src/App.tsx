import React from "react";
import {
  Box,
  Tab,
  Tabs,
  Typography,
  AppBar,
  Toolbar,
  Container,
} from "@mui/material";
import { ThemePoemTab } from "./ThemePoemTab";
import { ImagePoemTab } from "./ImagePoemTab";
import { BaseTab } from "./BaseTab";

export function App() {
  let [tab, setTab] = React.useState(0);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            KI Gedicht Generierung
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Sie können ein Gedicht mithilfe eines Themas oder eines Bildes
          generieren.
        </Typography>

        <Tabs
          centered
          value={tab}
          onChange={(_, newValue) => setTab(newValue)}
          sx={{ mb: 3 }}
        >
          <Tab label="Gedicht durch Text" value={0} />
          <Tab label="Gedicht durch Bild" value={1} />
        </Tabs>

        <Box display="flex" justifyContent="center">
          <BaseTab tab={tab}></BaseTab>
        </Box>
      </Container>
    </Box>
  );
}
