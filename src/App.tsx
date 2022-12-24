import { useCallback, useState } from "react";
import "./App.scss";
import { Board } from "./models/Board";
import Modal from "./components/Modal";
import Game from "./components/Game";
import Difficulty from "./components/Difficulty";

const App = () => {
  const [board, setBoard] = useState<Board>();
  const [difficulty, setDifficulty] = useState<number>(3);

  const startGame = useCallback(() => {
    const board = new Board({ size: { height: 10, width: 12 }, difficulty });
    board.reset();
    setBoard(board);
  }, [difficulty]);

  const updateDifficulty = useCallback((difficulty: number) => {
    setDifficulty(difficulty);
  }, []);

  return (
    <div className="App">
      {board ? (
        <Modal
          isOpened={board.isGameFinished}
          onClose={() => setBoard(undefined)}
          isWon={!board.isGameOver}
        />
      ) : null}
      <h1 className="title">Minesweeper</h1>
      {!board?.isGameActive ? (
        <Difficulty
          difficulty={difficulty}
          updateDifficulty={updateDifficulty}
        />
      ) : null}
      {board && board?.isGameActive ? (
        <Game board={board} setBoard={setBoard} />
      ) : (
        <button className="new-game" onClick={startGame}>
          Start Game
        </button>
      )}

      <span className="credits">
        Created by <a href="https://patrickchek.com">Patrick Samuel Chekroun</a>
      </span>
    </div>
  );
};

export default App;
