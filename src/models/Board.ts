import { Block } from "./Block";
import { BoardSize } from "./BoardSize";
import * as _ from "lodash";
import { v4 } from "uuid";
import { Chance } from "chance";
import { Position } from "./Position";

const chance = new Chance();

export class Board {
  public blocks: Block[][];
  private size: BoardSize;
  private difficulty: number;
  isGameOver: boolean;
  isGameFinished: boolean;
  isGameActive: boolean;

  constructor(options: { size: BoardSize; difficulty?: number }) {
    this.size = options.size;
    this.isGameOver = false;
    this.isGameActive = false;
    this.isGameFinished = false;
    this.difficulty = options.difficulty ?? 1;
    this.blocks = [];
    for (let i = 0; i < this.size.height; i++) {
      this.blocks?.push([]);
      for (let j = 0; j < this.size.width; j++) {
        this.blocks![i].push({
          id: v4(),
          value: 0,
          hasBomb: false,
          isHidden: true,
          isFlagged: false,
        });
      }
    }
  }

  reset() {
    this.isGameActive = true;
    this.isGameFinished = false;
    this.isGameOver = false;
    this.generateBoard();
  }

  checkWin() {
    const boardSize = this.size.height * this.size.width;
    let numberOfBombs = 0;
    let revealedBlocks = 0;
    for (let i = 0; i < this.size.height; i++) {
      for (let j = 0; j < this.size.width; j++) {
        if (this.blocks![i][j].hasBomb) {
          numberOfBombs++;
        }
        if (!this.blocks![i][j].hasBomb && !this.blocks![i][j].isHidden) {
          revealedBlocks++;
        }
      }
    }

    if (revealedBlocks + numberOfBombs === boardSize) {
      this.isGameOver = false;
      this.isGameFinished = true;
      console.log({
        isGameOver: this.isGameOver,
        isGameFinished: this.isGameFinished,
      });
    }
  }

  generateBoard() {
    for (let i = 0; i < this.size.height; i++) {
      for (let j = 0; j < this.size.width; j++) {
        this.blocks![i][j] = {
          id: v4(),
          value: 0,
          hasBomb: chance.bool({ likelihood: this.difficulty * 10 }),
          isHidden: true,
          isFlagged: false,
        };
      }
    }
    this.calculateNearestBombs();
  }

  private calculateNearestBombs() {
    for (let i = 0; i < this.size.height; i++) {
      for (let j = 0; j < this.size.width; j++) {
        if (!this.blocks![i][j].hasBomb) {
          this.blocks![i][j].value = this.findAllNearestBombs(
            this.blocks[i][j].id,
          );
        }
      }
    }
  }

  private revealAll() {
    for (let i = 0; i < this.size.height; i++) {
      for (let j = 0; j < this.size.width; j++) {
        this.blocks![i][j].isHidden = false;
      }
    }
  }

  private findAllNearestBombs(id: string) {
    const position = this.getBlockPosition(id);
    let numberOfBombs = 0;
    if (position.column > 0) {
      numberOfBombs +=
        this.getBlockByPosition(position.row, position.column - 1).hasBomb
          ? 1
          : 0;
    }

    if (position.column < this.size.width - 1) {
      numberOfBombs +=
        this.getBlockByPosition(position.row, position.column + 1).hasBomb
          ? 1
          : 0;
    }

    if (position.row > 0) {
      numberOfBombs +=
        this.getBlockByPosition(position.row - 1, position.column).hasBomb
          ? 1
          : 0;
    }

    if (position.row < this.size.height - 1) {
      numberOfBombs +=
        this.getBlockByPosition(position.row + 1, position.column).hasBomb
          ? 1
          : 0;
    }

    if (position.column > 0 && position.row > 0) {
      numberOfBombs +=
        this.getBlockByPosition(position.row - 1, position.column - 1).hasBomb
          ? 1
          : 0;
    }

    if (position.column < this.size.width - 1 && position.row > 0) {
      numberOfBombs +=
        this.getBlockByPosition(position.row - 1, position.column + 1).hasBomb
          ? 1
          : 0;
    }

    if (position.column > 0 && position.row < this.size.height - 1) {
      numberOfBombs +=
        this.getBlockByPosition(position.row + 1, position.column - 1).hasBomb
          ? 1
          : 0;
    }

    if (
      position.column < this.size.width - 1 &&
      position.row < this.size.height - 1
    ) {
      numberOfBombs +=
        this.getBlockByPosition(position.row + 1, position.column + 1).hasBomb
          ? 1
          : 0;
    }

    return numberOfBombs;
  }

  private openAllNearestEmpty(id: string) {
    const position = this.getBlockPosition(id);
    const currentBlock = this.getBlockByPosition(position.row, position.column);

    if (position.column > 0) {
      const block = this.getBlockByPosition(position.row, position.column - 1);
      if (!block.hasBomb && currentBlock.value === 0 && block.isHidden) {
        block.isHidden = false;
        this.openAllNearestEmpty(block.id);
      }
    }

    if (position.column < this.size.width - 1) {
      const block = this.getBlockByPosition(position.row, position.column + 1);
      if (!block.hasBomb && currentBlock.value === 0 && block.isHidden) {
        block.isHidden = false;
        this.openAllNearestEmpty(block.id);
      }
    }

    if (position.row > 0) {
      const block = this.getBlockByPosition(position.row - 1, position.column);
      if (!block.hasBomb && currentBlock.value === 0 && block.isHidden) {
        block.isHidden = false;
        this.openAllNearestEmpty(block.id);
      }
    }

    if (position.row < this.size.height - 1) {
      const block = this.getBlockByPosition(position.row + 1, position.column);
      if (!block.hasBomb && currentBlock.value === 0 && block.isHidden) {
        block.isHidden = false;
        this.openAllNearestEmpty(block.id);
      }
    }

    if (position.column > 0 && position.row > 0) {
      const block = this.getBlockByPosition(
        position.row - 1,
        position.column - 1,
      );
      if (!block.hasBomb && currentBlock.value === 0 && block.isHidden) {
        block.isHidden = false;
        this.openAllNearestEmpty(block.id);
      }
    }

    if (position.column < this.size.width - 1 && position.row > 0) {
      const block = this.getBlockByPosition(
        position.row - 1,
        position.column + 1,
      );
      if (!block.hasBomb && currentBlock.value === 0 && block.isHidden) {
        block.isHidden = false;
        this.openAllNearestEmpty(block.id);
      }
    }

    if (position.column > 0 && position.row < this.size.height - 1) {
      const block = this.getBlockByPosition(
        position.row + 1,
        position.column - 1,
      );
      if (!block.hasBomb && currentBlock.value === 0 && block.isHidden) {
        block.isHidden = false;
        this.openAllNearestEmpty(block.id);
      }
    }

    if (
      position.column < this.size.width - 1 &&
      position.row < this.size.height - 1
    ) {
      const block = this.getBlockByPosition(
        position.row + 1,
        position.column + 1,
      );
      if (!block.hasBomb && currentBlock.value === 0 && block.isHidden) {
        block.isHidden = false;
        this.openAllNearestEmpty(block.id);
      }
    }
  }

  getBlockPosition(id: string): Position {
    for (let i = 0; i < this.size.height; i++) {
      for (let j = 0; j < this.size.width; j++) {
        if (this.blocks![i][j].id === id) {
          return { row: i, column: j };
        }
      }
    }
    return { row: 0, column: 0 };
  }

  private getBlockByPosition(row: number, column: number) {
    return this.blocks[row][column];
  }

  toggleFlag(id: string) {
    this.findBlock(id).isFlagged = !this.findBlock(id).isFlagged;
  }

  reveal(id: string) {
    const block = this.findBlock(id);
    if (block.isFlagged) {
      return;
    }
    block.isHidden = false;
    if (block.hasBomb) {
      this.isGameOver = true;
      this.isGameFinished = true;
      this.revealAll();
    }

    if (!block.hasBomb && block.value === 0) {
      this.openAllNearestEmpty(block.id);
    }

    if (!this.isGameOver) {
      this.checkWin();
    }
  }

  private findBlock(id: string) {
    return _.find(_.flatten(this.blocks), { "id": id })!;
  }
}
