import React from "react";
import "./Modal.scss";

interface ModalProps {
  isWon: boolean;
  isOpened: boolean;
  onClose: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  isWon,
  isOpened,
  onClose,
}: ModalProps) => {
  return isOpened ? (
    <div className="overlay">
      <div className={`modal ${isWon ? "success" : "fail"}`}>
        <span className="game-over-title">
          {isWon ? "You Won!" : "Game Over!"}
        </span>
        <button
          className={`close-button ${isWon ? "success" : "fail"}`}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  ) : null;
};
