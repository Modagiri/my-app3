import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Container from "@mui/material/Container";
import * as React from 'react';
import {Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField} from "@mui/material";
import {useState} from "react";

const Home = () => {

    const [jiraFileName, setJiraFileName] = useState("");
    const [sapFileName, setSapFileName] = useState("");
    const [jiraFile, setJiraFile] = useState(null);
    const [sapFile, setSapFile] = useState(null);

    const Item = styled(Paper)(({ theme }) => ({
        backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }));

    const columns = [
        {
            id: 'dato',
            label: 'Dato'
        },
        {
            id: 'prosjekt',
            label: 'Prosjekt'
        },
        {
            id: 'jira',
            label: 'Timer i Jira'
        },
        {
            id: 'sap',
            label: 'Timer i SAP'
        }
    ]

    return (
      <Container>
          <Grid container spacing={2}>
              <Grid xs={2}>
                  <Button variant="contained"
                          size="medium"
                          onClick={() => {
                              window.api.showOpenDialog();
                          }}
                  >Egen Jira-fil</Button>
              </Grid>
              <Grid xs={10}>
                  <TextField  size="small" fullWidth value={jiraFileName} />
              </Grid>
              <Grid xs={2}>
                  <Button variant="contained"
                          size="medium"
                          onClick={() => {
                              window.api.showOpenDialog();
                          }}
                  >Egen SAP-fil</Button>
              </Grid>
              <Grid xs={10}>
                  <TextField  size="small" fullWidth value={sapFileName} />
              </Grid>
          </Grid>

          <Paper sx={{ width: '100%', overflow: 'hidden' }}>
              <TableContainer sx={{ maxHeight: 440 }}>
                  <Table stickyHeader aria-label="sticky table">
                      <TableHead>
                          <TableRow>
                              {columns.map((column) => (
                                  <TableCell
                                      key={column.id}
                                  >
                                      {column.label}
                                  </TableCell>
                              ))}
                          </TableRow>
                      </TableHead>
                  </Table>
              </TableContainer>
          </Paper>
      </Container>
    );
}

export default Home;