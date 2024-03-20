import ProjectListItem from "./ProjectListItem";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";

import { Box, InputAdornment, InputBase, List } from "@mui/material";

const ProjectList = ({
  searchQuery,
  handleSearch,
  dataFiltered,
  editProject,
  deleteProject,
  runProject,
  uploadToCloud,
  loading,
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState(null);

  return (
    <>
      <Box sx={{ p: 1, my: 2, borderBottom: `solid 1px gray` }}>
        <InputBase
          fullWidth={true}
          placeholder="Search Project..."
          value={searchQuery}
          onChange={handleSearch}
          startAdornment={
            <InputAdornment position="start">
              <SearchIcon variant="pageIcon" />
            </InputAdornment>
          }
          endAdornment={<></>}
          inputProps={{
            sx: { typography: "h6" },
          }}
        />
      </Box>

      <List disablePadding>
        {dataFiltered.map((project) => (
          <ProjectListItem
            loading={loading}
            setSelectedProjectId={setSelectedProjectId}
            selectedProjectId={selectedProjectId}
            runProject={runProject}
            deleteProject={deleteProject}
            key={project.id}
            project={project}
            uploadToCloud={uploadToCloud}
            searchQuery={searchQuery}
            editProject={editProject}
          />
        ))}
      </List>
    </>
  );
};

export default ProjectList;
