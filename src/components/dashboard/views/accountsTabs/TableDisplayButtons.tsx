import { FC } from "react";
import { Box, Button } from "@mui/material";
import { AccountSpec } from "./Account";

const TableDisplayButtons: FC<{
  items: AccountSpec[];
  visibleItems: number;
  setVisibleItems: (visibleItems: number) => void;
  incrementalVisibleItems: number;
}> = ({ items, visibleItems, setVisibleItems, incrementalVisibleItems }) => {
  return items.length > 0 && items.length > incrementalVisibleItems ? (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 1,
        py: 2,
        px: 1,
        borderTop: "1px solid",
        borderColor: "divider",
        bgcolor: "action.hover",
      }}
    >
      <Button
        size="small"
        variant="outlined"
        onClick={() => {
          setVisibleItems(incrementalVisibleItems);
        }}
        disabled={visibleItems <= incrementalVisibleItems}
      >
        Show min
      </Button>
      <Button
        size="small"
        variant="outlined"
        onClick={() => {
          setVisibleItems(visibleItems + incrementalVisibleItems);
        }}
        disabled={visibleItems > items.length}
      >
        Show more
      </Button>
      <Button
        size="small"
        variant="outlined"
        onClick={() => {
          setVisibleItems(visibleItems - incrementalVisibleItems);
        }}
        disabled={visibleItems <= incrementalVisibleItems}
      >
        Show less
      </Button>
      <Button
        size="small"
        variant="contained"
        color="primary"
        onClick={() => {
          setVisibleItems(items.length);
        }}
        disabled={visibleItems === items.length}
      >
        Show all
      </Button>
    </Box>
  ) : null;
};

export default TableDisplayButtons;
