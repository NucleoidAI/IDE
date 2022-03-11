import ArrowIcon from "../../icons/Arrow";
import React from "react";
import {
  Box,
  Button,
  Collapse,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const rows = [
  { branch: "Production 1.1", classes: 15, functions: 14, size: 8 },
  { branch: "Production 1.2", classes: 16, functions: 18, size: 9 },
  { branch: "Development 1.4", classes: 23, functions: 11, size: 11 },
  { branch: "Development 1.5", classes: 26, functions: 9, size: 12 },
  { branch: "Development 1.6", classes: 35, functions: 24, size: 16 },
];

function Branches() {
  const [open, setOpen] = React.useState(rows[0].branch);

  return (
    <>
      <Typography variant="h5" gutterBottom component="div">
        Branches
      </Typography>
      <Grid container spacing={1}>
        <Grid item xs={8}>
          <Paper>
            <TableContainer component={Paper}>
              <Table aria-label="collapsible table">
                <TableHead>
                  <TableRow>
                    <TableCell />
                    <TableCell>Branch</TableCell>
                    <TableCell>Components</TableCell>
                    <TableCell align="right">Size</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <React.Fragment key={row.branch}>
                      <TableRow>
                        <TableCell>
                          <IconButton
                            aria-label="expand row"
                            size="small"
                            onClick={() => setOpen(row.branch)}
                          >
                            {open === row.branch ? (
                              <ArrowIcon down />
                            ) : (
                              <ArrowIcon right />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell>{row.branch}</TableCell>
                        <TableCell>
                          {row.classes} Classes, {row.functions} Functions
                        </TableCell>
                        <TableCell align="right">{row.size} MB</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={6}
                        >
                          <Collapse
                            in={open === row.branch}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box margin={1} textAlign={"right"}>
                              <Button size={"small"} sx={{ margin: 1 }}>
                                Export
                              </Button>
                              <Button size={"small"} sx={{ margin: 1 }}>
                                Fork
                              </Button>
                              <Button
                                sx={{
                                  background:
                                    "linear-gradient(45deg, #fe6b8b 30%, #ff8e53 90%)",
                                  color: "white",
                                  boxShadow:
                                    "0 3px 5px 2px rgba(255, 105, 135, .3)",
                                }}
                              >
                                Tag
                              </Button>
                              <Button size={"small"} sx={{ margin: 1 }}>
                                Delete
                              </Button>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h6" gutterBottom component="div">
            History
          </Typography>
          <List
            sx={{
              width: "100%",
              maxWidth: 360,
              bgcolor: "background.paper",
            }}
          >
            <ListItem>
              <ListItemText
                primary="Add user related functions"
                secondary="@canmingir - 20m"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Initialize user class"
                secondary="@canmingir - 3d"
              />
            </ListItem>
            <ListItem>
              <ListItemText
                primary="Initial commit"
                secondary="@canmingir - 6d"
              />
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </>
  );
}

export default Branches;
