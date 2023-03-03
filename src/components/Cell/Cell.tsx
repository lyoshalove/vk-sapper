import { cellStatuses, smile } from "@/constants";
import { ICoordinates, TSmileValues } from "@/types";
import { FC, useState, MouseEvent } from "react";
import "./styles.sass";

interface IProps {
  x: number;
  y: number;
  cellStatus: number | string;
  playable: boolean;
  openCell: (coordinates: ICoordinates) => void;
  markCell: (coordinates: ICoordinates) => void;
  setFace: (newFace: TSmileValues) => void;
  openCellsByNumber: (coordinates: ICoordinates) => void;
}

export const Cell: FC<IProps> = ({
  x,
  y,
  cellStatus,
  playable,
  openCellsByNumber,
  openCell,
  markCell,
  setFace,
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isPressed, setIsPressed] = useState<boolean>(false);

  const clickHandle = () => {
    if (typeof cellStatus === "number" && cellStatus !== 0) {
      openCellsByNumber({ x, y });
      return;
    } else if (cellStatus !== cellStatuses.CLOSED) {
      return;
    }

    openCell({ x, y });
  };

  const contextMenuHandle = (e: MouseEvent) => {
    e.preventDefault();
    markCell({ x, y });
  };

  const pointerDownHandle = (e: MouseEvent) => {
    e.preventDefault();

    if (cellStatus !== cellStatuses.CLOSED) {
      return;
    }

    setIsActive(true);
    setIsPressed(true);
    setFace(smile.SCARED);
  };

  const pointerOutHandle = () => {
    if (isActive) {
      setIsActive(false);
      setIsPressed(false);
      setFace(smile.SMILE);
    }
  };

  const getClassName = () => {
    let className = "cell ";

    switch (cellStatus) {
      case cellStatuses.CLOSED:
        className += "closed";
        break;
      case cellStatuses.FLAG:
        className += "flag";
        break;
      case cellStatuses.BOOM:
        className += "boom";
        break;
      case cellStatuses.MINE:
        className += "mine";
        break;
      case cellStatuses.RED_MINE:
        className += "red-mine";
        break;
      case cellStatuses.QUESTION:
        className += "question";
        break;
      case 0:
        className += "empty";
        break;
      default:
        className += `mines${cellStatus}`;
    }

    if (isPressed) {
      className += " pressed";
    }

    return className;
  };

  if (playable) {
    return (
      <div
        className={getClassName()}
        onClick={clickHandle}
        onContextMenu={contextMenuHandle}
        onPointerDown={pointerDownHandle}
        onPointerOut={pointerOutHandle}
        onPointerUp={pointerOutHandle}
      ></div>
    );
  } else {
    return (
      <div
        className={getClassName()}
        onContextMenu={(e) => e.preventDefault()}
      ></div>
    );
  }
};
