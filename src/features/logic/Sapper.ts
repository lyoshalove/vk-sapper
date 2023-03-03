import { cellStatuses } from "@/constants";
import { TCells } from "@/types";

interface ICoordinates {
  x: number;
  y: number;
}

class Sapper {
  public size: number;
  public mines: number;
  public cells: TCells;
  public visibleCells: TCells;
  public started: boolean;
  public victory: boolean;
  public defeat: boolean;
  public openedCells: number;
  public minesLeft: number;

  constructor(size: number, mines: number) {
    this.size = size;
    this.mines = mines;
    this.cells = [];
    this.visibleCells = [];
    this.started = false;
    this.victory = false;
    this.defeat = false;
    this.openedCells = 0;
    this.minesLeft = mines;

    for (let i = 0; i < size; ++i) {
      this.cells.push([]);
      this.visibleCells.push([]);
      for (let j = 0; j < size; ++j) {
        this.visibleCells[i].push(cellStatuses.CLOSED);
      }
    }
  }

  startGame({ x, y }: ICoordinates) {
    this.started = true;
    const emptyCells = new Set(Array(this.size * this.size).keys());

    emptyCells.delete(this.getCellHash({ x, y }));
    this.getNeighbours({ x, y }).forEach((neighbour) => {
      emptyCells.delete(this.getCellHash(neighbour));
    });

    for (let i = 0; i < this.mines; ++i) {
      const cellHash = this.getRandomCell(emptyCells);
      emptyCells.delete(Number(cellHash));
      const cell = this.getCellFromHash(Number(cellHash));
      this.cells[cell.x][cell.y] = cellStatuses.MINE;
    }

    for (let x = 0; x < this.size; ++x) {
      for (let y = 0; y < this.size; ++y) {
        if (this.cells[x][y] !== cellStatuses.MINE) {
          this.cells[x][y] = this.countNearMines({ x, y });
        }
      }
    }

    this.openCell({ x, y });
  }

  openCell(cell: ICoordinates) {
    const status = this.cells[cell.x][cell.y];

    if (status === cellStatuses.MINE) {
      this.visibleCells[cell.x][cell.y] = cellStatuses.BOOM;
      this.endGameByLosing();
      return;
    }

    this.visibleCells[cell.x][cell.y] = status;

    if (status === 0) {
      this.getNeighbours(cell).forEach((neighbour) => {
        if (
          this.visibleCells[neighbour.x][neighbour.y] === cellStatuses.CLOSED
        ) {
          this.openCell(neighbour);
        }
      });
    }

    this.openedCells += 1;

    if (this.openedCells + this.mines === this.size * this.size) {
      this.endGameByWinning();
    }
  }

  openCellsByNumber(cell: ICoordinates) {
    const mines = this.visibleCells[cell.x][cell.y];

    if (typeof mines !== "number") {
      return;
    }

    if (
      this.getNeighbours(cell).filter(
        ({ x, y }) => this.visibleCells[x][y] === cellStatuses.FLAG
      ).length !== mines
    ) {
      return;
    }

    this.getNeighbours(cell).forEach(({ x, y }) => {
      if (this.visibleCells[x][y] === cellStatuses.CLOSED) {
        this.openCell({ x, y });
      }
    });
  }

  markCell(cell: ICoordinates) {
    if (this.minesLeft > 0) {
      switch (this.visibleCells[cell.x][cell.y]) {
        case cellStatuses.CLOSED:
          this.visibleCells[cell.x][cell.y] = cellStatuses.FLAG;
          this.minesLeft--;
          break;
        case cellStatuses.FLAG:
          this.visibleCells[cell.x][cell.y] = cellStatuses.QUESTION;
          this.minesLeft++;
          break;
        case cellStatuses.QUESTION:
          this.visibleCells[cell.x][cell.y] = cellStatuses.CLOSED;
          break;
      }
    }
  }

  countNearMines(cell: ICoordinates) {
    return this.getNeighbours(cell).filter(
      (cell) => this.cells[cell.x][cell.y] === cellStatuses.MINE
    ).length;
  }

  getCellHash(cell: ICoordinates) {
    return cell.x * this.size + cell.y;
  }

  getCellFromHash(hash: number): ICoordinates {
    return {
      x: Math.floor(hash / this.size),
      y: hash % this.size,
    };
  }

  endGameByLosing() {
    this.defeat = true;

    for (let x = 0; x < this.size; ++x) {
      for (let y = 0; y < this.size; ++y) {
        if (
          (this.visibleCells[x][y] === cellStatuses.CLOSED ||
            this.visibleCells[x][y] === cellStatuses.QUESTION) &&
          this.cells[x][y] === cellStatuses.MINE
        ) {
          this.visibleCells[x][y] = cellStatuses.MINE;
        } else if (
          this.visibleCells[x][y] === cellStatuses.FLAG &&
          this.cells[x][y] !== cellStatuses.MINE
        ) {
          this.visibleCells[x][y] = cellStatuses.RED_MINE;
        }
      }
    }
  }

  endGameByWinning() {
    this.victory = true;
    this.minesLeft = 0;

    for (let x = 0; x < this.size; ++x) {
      for (let y = 0; y < this.size; ++y) {
        if (this.cells[x][y] === cellStatuses.MINE) {
          this.visibleCells[x][y] = cellStatuses.FLAG;
        }
      }
    }
  }

  getNeighbours({ x, y }: ICoordinates) {
    let ans = [];

    if (x > 0 && y > 0) {
      ans.push({ x: x - 1, y: y - 1 });
    }
    if (x > 0) {
      ans.push({ x: x - 1, y });
    }
    if (x > 0 && y < this.size - 1) {
      ans.push({ x: x - 1, y: y + 1 });
    }
    if (y > 0) {
      ans.push({ x, y: y - 1 });
    }
    if (y < this.size - 1) {
      ans.push({ x, y: y + 1 });
    }
    if (x < this.size - 1 && y > 0) {
      ans.push({ x: x + 1, y: y - 1 });
    }
    if (x < this.size - 1) {
      ans.push({ x: x + 1, y });
    }
    if (x < this.size - 1 && y < this.size - 1) {
      ans.push({ x: x + 1, y: y + 1 });
    }

    return ans;
  }

  getRandomCell(emptyCells: Set<number>) {
    let items = Array.from(emptyCells);
    
    return items[Math.floor(Math.random() * items.length)];
  }

  getVisibleCells() {
    return this.visibleCells;
  }

  isStarted() {
    return this.started;
  }

  isDefeat() {
    return this.defeat;
  }

  isVictory() {
    return this.victory;
  }

  getMinesLeft() {
    return Math.max(this.minesLeft, 0);
  }
}

export { Sapper };
