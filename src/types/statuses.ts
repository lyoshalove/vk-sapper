import { cellStatuses } from "@/constants";
import { changeToGetValuesType } from "@/features/helpers";

const cellStatusesCopy = changeToGetValuesType(cellStatuses);

type TCellStatusesKeys = keyof typeof cellStatusesCopy;

export type TCellStatusesValues = typeof cellStatusesCopy[TCellStatusesKeys];

export type TCellStatuses = {
  MINE: "mine";
  FLAG: "flag";
  CLOSED: "closed";
  EMPTY: "empty";
  RED_MINE: "red-mine";
  QUESTION: "question";
  BOOM: "boom";
};
