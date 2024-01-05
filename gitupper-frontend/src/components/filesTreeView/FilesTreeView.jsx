import { useTheme } from "styled-components";
import { TreeView, TreeItem } from "@mui/lab";

import { MdOutlineExpandMore, MdOutlineExpandLess } from "react-icons/md";

export default function FilesTreeView({ treeData }) {
  const theme = useTheme();

  return (
    <TreeView
      aria-label="upload-files-navigator"
      defaultCollapseIcon={
        <MdOutlineExpandMore size={24} color={theme.colors.iconColor} />
      }
      defaultExpandIcon={
        <MdOutlineExpandLess size={24} color={theme.colors.iconColor} />
      }
      sx={{
        "& .MuiTreeItem-iconContainer": {
          width: "auto",
        },
        maxHeight: 240,
        flexGrow: 1,
        maxWidth: 260,
        minWidth: 260,
      }}
    >
      {treeData.map(
        (item, index) =>
          item.children?.length > 0 && (
            <TreeItem
              key={item.name}
              nodeId={`${(index + 1) * 100}`}
              label={
                <span style={{ fontFamily: "InterMedium", fontSize: 14 }}>
                  {item.name}
                </span>
              }
            >
              {item.children.map((item, index) => (
                <TreeItem
                  key={`${item}${index}`}
                  nodeId={`${(index + 1) * 100 + 1}`}
                  label={
                    <span style={{ fontFamily: "InterMedium", fontSize: 14 }}>
                      {item}
                    </span>
                  }
                />
              ))}
            </TreeItem>
          )
      )}
    </TreeView>
  );
}
