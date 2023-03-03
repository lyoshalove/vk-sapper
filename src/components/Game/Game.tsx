import { minesCount, SIZE, smile } from "@/constants";
import { ICoordinates, TCells, TSmileValues } from "@/types";
import { FC, useEffect, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { Sapper } from "@/features/logic";
import { Table } from "@/components/Table";
import "./styles.sass";

export const Game: FC = () => {
  const sapper = useRef(new Sapper(SIZE, minesCount));
  const [time, setTime] = useState<number>(0);
  const [playable, setPlayable] = useState<boolean>(true);
  const [cellStatus, setCellStatus] = useState<TCells>(
    sapper.current.getVisibleCells()
  );
  const [face, setFace] = useState<TSmileValues>("smile");
  const [timer, setTimer] = useState<ReturnType<typeof setInterval>>();

  const newGame = () => {
    sapper.current = new Sapper(SIZE, minesCount);
    clearInterval(timer);
    setTime(0);
    setFace(smile.SMILE);
    setPlayable(true);
    setCellStatus(sapper.current.getVisibleCells());
  };

  const openCellHandle = (cell: ICoordinates) => {
    if (!sapper.current.isStarted()) {
      sapper.current.startGame(cell);
    } else {
      sapper.current.openCell(cell);
    }
    updateCells();
  };

  const openCellsByNumberHandle = (cell: ICoordinates) => {
    sapper.current.openCellsByNumber(cell);
    updateCells();
  };

  const markCellHandle = (cell: ICoordinates) => {
    sapper.current.markCell(cell);
    updateCells();
  };

  const updateCells = () => {
    setCellStatus([...sapper.current.getVisibleCells()]);

    if (sapper.current.isDefeat()) {
      endGame(false);
    }
    if (sapper.current.isVictory()) {
      endGame(true);
    }
  };

  const setFaceHandle = (face: TSmileValues) => setFace(face);

  const endGame = (isWin: boolean) => {
    if (isWin) {
      setFaceHandle(smile.COOL);
    } else {
      setFaceHandle(smile.DEAD);
    }

    setPlayable(false);
    clearInterval(timer);
  };

  useEffect(() => {
    if (sapper.current.isStarted()) {
      setTimer(
        setInterval(() => {
          setTime((prev) => ++prev);

          if (sapper.current.isDefeat()) {
            endGame(false);
          }

          if (sapper.current.isVictory()) {
            endGame(true);
          }
        }, 1000)
      );
    }
  }, [sapper.current.isStarted()]);

  useEffect(() => {
    if (time >= 999) {
      endGame(false);
    }
  }, [time]);

  return (
    <div className="game">
      <Header
        time={time}
        minesCount={sapper.current.getMinesLeft()}
        face={face}
        newGame={newGame}
      />
      <Table
        cellsStatus={cellStatus}
        openCell={openCellHandle}
        markCell={markCellHandle}
        setFace={setFaceHandle}
        openCellsByNumber={openCellsByNumberHandle}
        playable={playable}
      />
    </div>
  );
};
