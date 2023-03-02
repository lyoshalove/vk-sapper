import { FC } from "react";
import "./styles.sass";

interface IProps {
  time: number;
  minesCount: number;
  face: string;
  newGame: () => void;
}

export const Header: FC<IProps> = ({ time, minesCount, face, newGame }) => {
  const getNumberByCategory = (value: number) => {
    return value.toString().split("").map(Number).reverse();
  };
  const checkTimeToUndefined = (seconds: number) => (seconds ? seconds : 0);

  return (
    <header className="header">
      <div className="header__minutes">
        <div
          className={`time t${checkTimeToUndefined(
            getNumberByCategory(minesCount)[2]
          )}`}
        />
        <div
          className={`time t${checkTimeToUndefined(
            getNumberByCategory(minesCount)[1]
          )}`}
        />
        <div
          className={`time t${checkTimeToUndefined(
            getNumberByCategory(minesCount)[0]
          )}`}
        />
      </div>
      <button className={`header__btn ${face}`} onClick={newGame} />
      <div className="header__seconds">
        <div
          className={`time t${checkTimeToUndefined(
            getNumberByCategory(time)[2]
          )}`}
        />
        <div
          className={`time t${checkTimeToUndefined(
            getNumberByCategory(time)[1]
          )}`}
        />
        <div
          className={`time t${checkTimeToUndefined(
            getNumberByCategory(time)[0]
          )}`}
        />
      </div>
    </header>
  );
};
