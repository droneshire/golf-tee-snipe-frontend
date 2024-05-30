import { FC } from "react";
import { Button } from "@mui/material";
import { AccountSpec } from "./Account";

const TableDisplayButtons: FC<{
  items: AccountSpec[];
  visibleItems: number;
  setVisibleItems: (visibleItems: number) => void;
  incrementalVisibleItems: number;
}> = ({ items, visibleItems, setVisibleItems, incrementalVisibleItems }) => {
  return items.length > 0 && items.length > incrementalVisibleItems ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Button
        onClick={() => {
          setVisibleItems(incrementalVisibleItems);
        }}
        disabled={visibleItems <= incrementalVisibleItems}
      >
        Show Min
      </Button>
      <Button
        onClick={() => {
          setVisibleItems(visibleItems + incrementalVisibleItems);
        }}
        disabled={visibleItems > items.length}
      >
        Show More
      </Button>

      <Button
        onClick={() => {
          setVisibleItems(visibleItems - incrementalVisibleItems);
        }}
        disabled={visibleItems <= incrementalVisibleItems}
      >
        Show Less
      </Button>
      <Button
        onClick={() => {
          setVisibleItems(items.length);
        }}
        disabled={visibleItems === items.length}
      >
        Show All
      </Button>
    </div>
  ) : null;
};

export default TableDisplayButtons;
