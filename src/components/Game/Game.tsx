import { minesCount, SIZE, smile } from "@/constants";
import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Header } from "../Header";
import Sapper from "../logic/Sapper";
import { Table } from "../Table";
import "./styles.sass";

export const Game: FC = () => {
  const sapper = useRef(new Sapper(SIZE, minesCount));
  const [time, setTime] = useState<number>(0);
  const [playable, setPlayable] = useState<boolean>(true);
  const [minesLeft, setMinesLeft] = useState<any>(minesCount);
  const [cellStatus, setCellStatus] = useState<any>(
    sapper.current.getVisibleCells()
  );
  const [face, setFace] = useState<string>("smile");
  const [timer, setTimer] = useState<any>();

  const newGame = () => {
    sapper.current = new Sapper(SIZE, minesCount);
    timer && clearInterval(timer);
    setTime(0);
    setFace(smile.SMILE);
    setPlayable(true);
    setCellStatus(sapper.current.getVisibleCells());
  };

  const openCellHandle = (cell: any) => {
    if (!sapper.current.isStarted()) {
      sapper.current.startGame(cell);
    } else {
      sapper.current.openCell(cell);
    }
    updateCells();
  };

  const openCellsByNumberHandle = (cell: any) => {
    sapper.current.openCellsByNumber(cell);
    updateCells();
  };

  const markCellHandle = (cell: any) => {
    sapper.current.markCell(cell);
    setMinesLeft(sapper.current.getMinesLeft());
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

  const setFaceHandle = (face: any) => {
    setFace(face);
  };

  const endGame = (isWin: boolean) => {
    if (isWin) {
      setFaceHandle(smile.COOL);
    } else {
      setFaceHandle(smile.DEAD);
    }

    setPlayable(false);
    setMinesLeft(sapper.current.getMinesLeft());
    console.log(timer);
    timer && clearInterval(timer);
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
      console.log(timer);
      endGame(false);
    }
  }, [time]);

  useEffect(() => timer && clearInterval(timer), []);

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
        playable={playable}
        openCellsByNumber={openCellsByNumberHandle}
      />
    </div>
  );
};
