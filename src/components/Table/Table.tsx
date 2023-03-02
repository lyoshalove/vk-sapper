import { SIZE } from "@/constants";
import { FC, useEffect, useState } from "react";
import { Cell } from "../Cell";
import "./styles.sass";

interface IProps {
  cellsStatus: any;
  openCell: any;
  markCell: any;
  setFace: any;
  playable: any;
  openCellsByNumber: any;
}

export const Table: FC<IProps> = ({
  cellsStatus,
  openCell,
  markCell,
  setFace,
  playable,
  openCellsByNumber,
}) => {
  const [cells, setCells] = useState<any[]>([]);

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
  }, [openCell]);

  return <div className="table">{cells}</div>;
};
