import { getNumberByDigits } from "@/features/helpers";
import { FC } from "react";
import "./styles.sass";

interface IProps {
  time: number;
  minesCount: number;
  face: string;
  newGame: () => void;
}

export const Header: FC<IProps> = ({ time, minesCount, face, newGame }) => {
  return (
    <header className="header">
      <div className="header__mines">
        {getNumberByDigits(minesCount).map((num, index) => (
          <div className={`number t${num}`} key={index} />
        ))}
      </div>
      <button className={`header__btn ${face}`} onClick={newGame} />
      <div className="header__seconds">
        {getNumberByDigits(time).map((num, index) => (
          <div className={`number t${num}`} key={index} />
        ))}
      </div>
    </header>
  );
};
