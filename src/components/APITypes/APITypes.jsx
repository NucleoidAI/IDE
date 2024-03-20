import Schema from "../Schema/Schema";
import SchemaEditor from "../SchemaEditor";
import { useContext } from "../../context/context";

import {
  Box,
  Button,
  Divider,
  IconButton,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Check, Close, Delete, Edit, MoreVert } from "@mui/icons-material";
import React, { useState } from "react";

const TypeEditor = ({ initialValue = "", onConfirm, onCancel }) => {
  const [typeName, setTypeName] = useState(initialValue);

  const handleConfirm = () => {
    onConfirm(typeName);
    setTypeName("");
  };

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <TextField
        value={typeName}
        onChange={(e) => setTypeName(e.target.value)}
        variant="outlined"
        size="small"
        sx={{ width: "70%", marginRight: 1 }}
      />
      <Box>
        <IconButton onClick={handleConfirm} size="small">
          <Check />
        </IconButton>
        <IconButton onClick={onCancel} size="small">
          <Close />
        </IconButton>
      </Box>
    </Box>
  );
};

const APITypes = ({ tstypes, nuctypes, typesRef }) => {
  const [state, dispatch] = useContext();
  const [isAddingType, setIsAddingType] = useState(false);
  const [showOptions, setShowOptions] = useState(null);
  const [editingType, setEditingType] = useState(null);

  const combinedData = [
    ...tstypes.map((item) => ({ ...item, isTypeScript: true })),
    ...nuctypes.map((item) => ({ ...item, isTypeScript: false })),
  ];

  const [selectedType, setSelectedType] = useState(
    combinedData.length > 0 ? combinedData[0].name : null
  );

  const preloaded = {};
  combinedData.forEach((item) => {
    preloaded[item.name] = true;
  });

  const handleAddTypeClick = () => {
    setIsAddingType(true);
  };

  const handleAddTypeConfirm = (typeName) => {
    dispatch({
      type: "ADD_TYPE",
      payload: { typeName },
    });
    setIsAddingType(false);
  };

  const isTypeScriptType = (typeName) => {
    return tstypes.some((type) => type.name === typeName);
  };

  const handleMoreClick = (event, typeName) => {
    event.stopPropagation();
    setShowOptions(typeName);
  };

  const handleCloseOptions = () => {
    setShowOptions(null);
  };

  const handleEditType = () => {
    setEditingType(showOptions);
    handleCloseOptions();
  };

  const handleDeleteType = () => {
    dispatch({
      type: "DELETE_TYPE",
      payload: { typeName: showOptions },
    });
    handleCloseOptions();
  };

  const handleUpdateType = (updatedTypeName) => {
    dispatch({
      type: "UPDATE_TYPE_NAME",
      payload: { oldTypeName: editingType, newTypeName: updatedTypeName },
    });
    setEditingType(null);
  };

  const renderRightPanel = () => {
    if (!selectedType) return null;

    const useSchemaEditor = !isTypeScriptType(selectedType);
    const initialData = findSchemaByName(selectedType);

    return (
      <Box sx={{ width: "100%", height: "100%" }}>
        {useSchemaEditor ? (
          <SchemaEditor
            key={selectedType}
            ref={typesRef}
            initialData={initialData}
          />
        ) : (
          <Schema initialData={initialData} />
        )}
      </Box>
    );
  };

  const handleTypeSelect = (name) => {
    setSelectedType(name);
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        height: "85%",
        p: 2,
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            p: 2,
            bgcolor: "background.paper",
            borderRadius: 2,
            height: "100%",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ width: "100%", overflowY: "auto" }}>
            {combinedData.map((item) => (
              <Box
                key={item.name}
                onClick={() => handleTypeSelect(item.name)}
                sx={{
                  padding: "8px 16px",
                  cursor: "pointer",
                  bgcolor:
                    selectedType === item.name
                      ? "primary.light"
                      : "background.paper",
                  "&:hover": {
                    bgcolor: "primary.light",
                  },
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
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
                    <Box sx={{ display: "flex", alignItems: "center" }}>
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
                      {!item.isTypeScript &&
                        (showOptions === item.name ? (
                          <>
                            <IconButton
                              size="small"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleEditType();
                              }}
                            >
                              <Edit />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={(event) => {
                                event.stopPropagation();
                                handleDeleteType();
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </>
                        ) : (
                          <IconButton
                            size="small"
                            onClick={(event) =>
                              handleMoreClick(event, item.name)
                            }
                          >
                            <MoreVert />
                          </IconButton>
                        ))}
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
          </Box>
          <Box sx={{ width: "100%", mt: 2 }}>
            {!isAddingType && (
              <Button onClick={handleAddTypeClick} fullWidth>
                Add Type
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
      <Divider orientation="vertical" flexItem sx={{ width: "1rem" }} />

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Paper
          elevation={3}
          sx={{
            width: "100%",
            p: 2,
            bgcolor: "background.paper",
            borderRadius: 2,
            height: "100%",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {renderRightPanel()}
        </Paper>
      </Box>
    </Box>
  );

  function findSchemaByName(name) {
    const schema = combinedData.find((schema) => schema.name === name);
    return schema ? schema.schema : null;
  }
};

export default APITypes;
