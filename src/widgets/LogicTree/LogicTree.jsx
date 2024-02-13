import AddIcon from "@mui/icons-material/Add";
import HubIcon from "@mui/icons-material/Hub";
import SvgIcon from "@mui/material/SvgIcon";
import { TreeView } from "@mui/x-tree-view/TreeView";
import { useContext } from "../../context/context";

import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Fab,
  Stack,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { TreeItem, treeItemClasses } from "@mui/x-tree-view/TreeItem";
import { alpha, styled } from "@mui/material/styles";

function MinusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      <circle cx="12" cy="12" r="8" fill="#209958" opacity=".3" />
      <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10s10-4.47 10-10S17.53 2 12 2m0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8s8 3.58 8 8s-3.58 8-8 8" />
    </SvgIcon>
  );
}

function PlusSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      <path
        fill="#209958"
        d="M12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22"
      />
    </SvgIcon>
  );
}

function CloseSquare(props) {
  return (
    <SvgIcon fontSize="inherit" style={{ width: 14, height: 14 }} {...props}>
      <path
        fill="#209958"
        d="m10.562 15.908l6.396-6.396l-.708-.708l-5.688 5.688l-2.85-2.85l-.708.708zM12.003 21q-1.866 0-3.51-.708q-1.643-.709-2.859-1.924q-1.216-1.214-1.925-2.856Q3 13.87 3 12.003q0-1.866.708-3.51q.709-1.643 1.924-2.859q1.214-1.216 2.856-1.925Q10.13 3 11.997 3q1.866 0 3.51.708q1.643.709 2.859 1.924q1.216 1.214 1.925 2.856Q21 10.13 21 11.997q0 1.866-.708 3.51q-.709 1.643-1.924 2.859q-1.214 1.216-2.856 1.925Q13.87 21 12.003 21"
      />
    </SvgIcon>
  );
}

const CustomTreeItem = ({ label, ...otherProps }) => {
  const formattedLabel =
    label.length > 30 ? `${label.substring(0, 30)}..` : label;
  return <TreeItem label={formattedLabel} title={label} {...otherProps} />;
};

const StyledTreeItem = styled(CustomTreeItem)(({ theme }) => ({
  [`& .${treeItemClasses.iconContainer}`]: {
    "& .close": {
      opacity: 0.3,
    },
  },
  [`& .${treeItemClasses.group}`]: {
    marginLeft: 15,
    paddingLeft: 18,
    borderLeft: `2px solid ${alpha("#209958", 0.4)}`,
  },
}));

function LogicTree({ openLogicDialog }) {
  const firstUpdate = React.useRef(true);

  const [state, dispatch] = useContext();
  const [treeData, setTreeData] = React.useState({});
  const [selectedKey, setSelectedKey] = useState(null);

  const declarations = state.nucleoid.declarations;

  useEffect(() => {
    const treeData = {};

    declarations.map((desc) => {
      const descSummary = desc.summary;
      const descClass = desc?.definition?.split("$")[1]?.match(/\b(\w+)\b/)[0];
      if (!treeData[descClass]) {
        treeData[descClass] = [];
      }

      treeData[descClass].push(descSummary);
    });
    setTreeData(treeData);
  }, []);

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }

    const desc = declarations[declarations.length - 1];
    const descSummary = desc.summary;
    const descClass = desc?.definition?.split("$")[1]?.match(/\b(\w+)\b/)[0];

    setTreeData((prevTreeData) => {
      const newTreeData = { ...prevTreeData };

      if (!newTreeData[descClass]) {
        newTreeData[descClass] = [];
      }
      newTreeData[descClass].push(descSummary);

      return newTreeData;
    });

    select(`${descClass}-${treeData[descClass].length}`);
  }, [declarations.length]);

  function select(value) {
    const logicClass = value.split("-")[0];
    const logicIndex = value.split("-")[1];

    setSelectedKey(`${logicClass}-${logicIndex}`);

    if (logicIndex === undefined) {
      return;
    }

    const selectedSummary = treeData[logicClass][logicIndex];

    const item = declarations.find((item) => item.summary === selectedSummary);

    if (item) {
      dispatch({
        type: "SET_SELECTED_LOGIC",
        payload: { logic: item },
      });
    }
  }

  return (
    <>
      <Card sx={{ width: "100%", height: "100%" }}>
        <CardHeader avatar={<HubIcon sx={{ color: "#c3c5c8" }} />} />
        <CardContent sx={{ width: "100%", height: "100%" }}>
          <TreeView
            aria-label="customized"
            defaultExpanded={["5"]}
            defaultCollapseIcon={<MinusSquare />}
            defaultExpandIcon={<PlusSquare />}
            defaultEndIcon={<CloseSquare />}
            sx={{ overflowX: "hidden" }}
            onNodeSelect={(event, value) => select(value)}
            selected={selectedKey}
          >
            {Object.entries(treeData).map(([nodeId, labels], index) => (
              <StyledTreeItem
                key={nodeId}
                nodeId={index.toString()}
                label={nodeId}
              >
                {labels.map((label, index) => (
                  <Stack key={index} direction="row" sx={{ width: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        width: 1,
                        alignSelf: "center",
                        height: 10,
                        marginTop: -0.8,
                        marginLeft: -2.3,
                        marginRight: -2.3,
                        maxWidth: "6%",
                        borderWidth: "2px",
                        borderStyle: "none none solid none",
                        borderRadius: "30px 30px 30px 80px",
                        borderColor: alpha("#209958", 0.5),
                      }}
                    ></Box>
                    <StyledTreeItem
                      key={index}
                      nodeId={`${nodeId}-${index}`}
                      label={label}
                    />
                  </Stack>
                ))}
              </StyledTreeItem>
            ))}
          </TreeView>
        </CardContent>
        <CardActions>
          <Fab size="small" onClick={openLogicDialog}>
            <AddIcon />
          </Fab>
        </CardActions>
      </Card>
    </>
  );
}

export default LogicTree;
