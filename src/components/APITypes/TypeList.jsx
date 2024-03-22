import TypeEditor from "./TypeEditor";

import { Add, Delete, Edit, MoreVert } from "@mui/icons-material";
import { Box, Fab, IconButton, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

const TypeList = ({
  combinedData,
  selectedType,
  onTypeSelect,
  onAddType,
  onUpdateType,
  onDeleteType,
}) => {
  const [isAddingType, setIsAddingType] = useState(false);
  const [showOptions, setShowOptions] = useState(null);
  const [editingType, setEditingType] = useState(null);
  const optionsRef = useRef(null);

  const handleAddTypeClick = () => {
    setIsAddingType(true);
  };

  const handleAddTypeConfirm = (typeName) => {
    onAddType(typeName);
    setIsAddingType(false);
    onTypeSelect(typeName);
  };

  const handleMoreClick = (event, typeName) => {
    if (event.target.closest(".more-button")) {
      setShowOptions(typeName);
    }
  };

  const handleCloseOptions = () => {
    setShowOptions(null);
  };

  const handleEditType = (item) => {
    setEditingType(item);
    handleCloseOptions();
  };

  const handleDeleteType = (item) => {
    const deletedIndex = combinedData.findIndex(
      (item) => item.name === showOptions
    );

    onDeleteType(item);
    handleCloseOptions();

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
  };

  const handleUpdateType = (updatedTypeName) => {
    onTypeSelect(null);
    onUpdateType(editingType, updatedTypeName);
    setEditingType(null);
    setTimeout(() => {
      onTypeSelect(updatedTypeName);
    }, 0);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      let targetElement = event.target;
      let shouldCloseOptions = true;

      while (targetElement) {
        if (
          targetElement.className &&
          typeof targetElement.className === "string" &&
          (targetElement.className.includes("more-button") ||
            targetElement.className.includes("ignore-outside-click"))
        ) {
          shouldCloseOptions = false;
          break;
        }
        targetElement = targetElement.parentElement;
      }

      if (shouldCloseOptions) {
        setShowOptions(null);
      }
    }

    if (showOptions !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showOptions]);

  return (
    <Box
      sx={{
        width: "100%",
        overflowY: "auto",
        position: "relative",
        height: "100%",
      }}
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
        >
          {editingType === item.name ? (
            <TypeEditor
              initialValue={item.name}
              onConfirm={handleUpdateType}
              onCancel={() => setEditingType(null)}
            />
          ) : (
            <>
              <Typography variant="body1" style={{ textAlign: "left" }}>
                {item.name}
              </Typography>
              <Box
                ref={optionsRef}
                sx={{ display: "flex", alignItems: "center" }}
              >
                {item.isTypeScript && (
                  <span
                    style={{
                      marginRight: "4px",
                      color: "#808080",
                      fontWeight: "bold",
                    }}
                  >
                    TS
                  </span>
                )}
                {!item.isTypeScript && (
                  <>
                    {showOptions === item.name ? (
                      <Box>
                        <IconButton
                          size="small"
                          className="ignore-outside-click"
                          onClick={() => {
                            handleEditType(item.name);
                          }}
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          size="small"
                          className="ignore-outside-click"
                          onClick={() => {
                            handleDeleteType(item.name);
                          }}
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    ) : (
                      <IconButton
                        className="more-button"
                        size="small"
                        onClick={(event) => handleMoreClick(event, item.name)}
                      >
                        <MoreVert />
                      </IconButton>
                    )}
                  </>
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
        <Fab color="primary" onClick={handleAddTypeClick} size="small">
          <Add />
        </Fab>
      </Box>
    </Box>
  );
};
export default TypeList;
