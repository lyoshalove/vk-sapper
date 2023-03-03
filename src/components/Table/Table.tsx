import { SIZE } from "@/constants";
import { ICoordinates, TCells, TSmileValues } from "@/types";
import { FC, ReactElement, useEffect, useState } from "react";
import { Cell } from "@/components/Cell";
import "./styles.sass";

interface IProps {
  cellsStatus: TCells;
  openCell: (coordinates: ICoordinates) => void;
  markCell: (coordinates: ICoordinates) => void;
  setFace: (newFace: TSmileValues) => void;
  playable: boolean;
  openCellsByNumber: (coordinates: ICoordinates) => void;
}

export const Table: FC<IProps> = ({
  cellsStatus,
  openCell,
  markCell,
  setFace,
  playable,
  openCellsByNumber,
}) => {
  const [cells, setCells] = useState<ReactElement[]>([]);

  useEffect(() => {
    setCells([]);

    for (let x = 0; x < SIZE; x++) {
      for (let y = 0; y < SIZE; y++) {
        setCells((prev) => [
          ...prev,
          <Cell
            key={x * SIZE + y}
            x={x}
            y={y}
            cellStatus={cellsStatus[x][y]}
            openCell={openCell}
            markCell={markCell}
            setFace={setFace}
            playable={playable}
            openCellsByNumber={openCellsByNumber}
          />,
        ]);
      }
    }
  }, [cellsStatus]);

  return <div className="table">{cells}</div>;
};
