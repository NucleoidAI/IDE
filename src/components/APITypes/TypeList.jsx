import ToggleableMenu from "../ToggleableMenu";
import TypeEditor from "./TypeEditor";

import { Add, Delete, Edit, MoreVert } from "@mui/icons-material";
import { Box, Fab, IconButton, Typography } from "@mui/material";
import React, { useState } from "react";

const TypeList = ({
  combinedData,
  selectedType,
  onTypeSelect,
  onAddType,
  onUpdateType,
  onDeleteType,
}) => {
  const [isAddingType, setIsAddingType] = useState(false);
  const [editingType, setEditingType] = useState(null);

  const handleAddTypeClick = () => {
    setIsAddingType(true);
  };

  const handleAddTypeConfirm = (typeName) => {
    onAddType(typeName);
    setIsAddingType(false);
    onTypeSelect(typeName);
  };

  const handleEditType = (item) => {
    setEditingType(item);
  };

  const handleDeleteType = (item) => {
    const deletedIndex = combinedData.findIndex(
      (item) => item.name === editingType
    );

    onDeleteType(item);

    if (deletedIndex > 0) {
      setTimeout(() => {
        onTypeSelect(combinedData[deletedIndex - 1].name);
      }, 0);
    } else if (deletedIndex < combinedData.length - 1) {
      setTimeout(() => {
        onTypeSelect(combinedData[deletedIndex + 1].name);
      }, 0);
    } else {
      onTypeSelect(null);
    }

    setEditingType(null);
  };

  const handleUpdateType = (updatedTypeName) => {
    onTypeSelect(null);
    onUpdateType(editingType, updatedTypeName);
    setEditingType(null);
    setTimeout(() => {
      onTypeSelect(updatedTypeName);
    }, 0);
  };

  return (
    <Box
      sx={{
        width: "100%",
        overflowY: "auto",
        position: "relative",
        height: "100%",
      }}
      data-cy="type-list"
    >
      {combinedData.map((item) => (
        <Box
          key={item.name}
          onClick={() => {
            onTypeSelect(item.name);
          }}
          sx={{
            padding: "6px 16px",
            height: "40px",
            width: "100%",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            cursor: "pointer",
            bgcolor: (theme) =>
              selectedType === item.name
                ? theme.palette.action.selected
                : theme.palette.background.paper,
            "&:hover": {
              bgcolor: (theme) => theme.palette.action.hover,
            },
          }}
          data-cy={`type-list-item-${item.name}`}
        >
          {editingType === item.name ? (
            <TypeEditor
              initialValue={item.name}
              onConfirm={handleUpdateType}
              onCancel={() => setEditingType(null)}
              data-cy="type-editor"
            />
          ) : (
            <>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                {item.name}
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center" }}
                data-cy={`type-item-actions-${item.name}`}
              >
                {item.isTypeScript && (
                  <span
                    style={{
                      marginRight: "4px",
                      color: "#808080",
                      fontWeight: "bold",
                    }}
                    data-cy={`typescript-item-${item.name}`}
                  >
                    TS
                  </span>
                )}
                {!item.isTypeScript && (
                  <ToggleableMenu defaultIcon={<MoreVert />}>
                    <IconButton
                      size="small"
                      onClick={() => handleEditType(item.name)}
                      data-cy={`edit-type-button-${item.name}`}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleDeleteType(item.name)}
                      data-cy={`delete-type-button-${item.name}`}
                    >
                      <Delete />
                    </IconButton>
                  </ToggleableMenu>
                )}
              </Box>
            </>
          )}
        </Box>
      ))}
      {isAddingType && (
        <TypeEditor
          onConfirm={handleAddTypeConfirm}
          onCancel={() => setIsAddingType(false)}
          data-cy="add-type-editor"
        />
      )}
      <Box
        sx={{
          position: "absolute",
          bottom: 16,
          left: "50%",
          transform: "translateX(-50%)",
        }}
      >
        <Fab
          color="primary"
          onClick={handleAddTypeClick}
          size="small"
          data-cy="add-type-button"
        >
          <Add />
        </Fab>
      </Box>
    </Box>
  );
};

export default TypeList;
