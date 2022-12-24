import React, { useCallback } from "react";
import { Block } from "../../models/Block";
import { Board } from "../../models/Board";
import * as _ from "lodash";
import { useLongPress } from "use-long-press";

interface GameProps {
  board: Board;
  setBoard: React.Dispatch<React.SetStateAction<Board | undefined>>;
}

export const Game: React.FC<GameProps> = ({ board, setBoard }: GameProps) => {
  const bind = useLongPress((event) => {
    const id = (event.target as HTMLDivElement).id;
    if (id) {
      toggleFlagBlock(id);
    }
  });

  const toggleFlagBlock = useCallback((id: string) => {
    setBoard((board) => {
      board!.toggleFlag(id);
      return _.cloneDeep(board);
    });
  }, []);

  const reveal = useCallback((id: string) => {
    setBoard((board) => {
      board!.reveal(id);
      return _.cloneDeep(board);
    });
  }, []);

  const flagBlock = useCallback(
    (event: React.MouseEvent<HTMLDivElement, MouseEvent>, id: string) => {
      event.preventDefault();
      toggleFlagBlock(id);
    },
    []
  );

  return (
    <>
      <div>
        {board?.blocks!.map((row: Block[], index: number) => (
          <div className="row" key={index}>
            {row.map((block) => (
              <div
                key={block.id}
                id={block.id}
                {...bind()}
                onContextMenu={(e) => flagBlock(e, block.id)}
                onClick={() => reveal(block.id)}
                className={`block ${block.isHidden ? "hidden" : ""}`}
              >
                {block.isHidden ? (
                  block.isFlagged ? (
                    <img src="/images/flag.webp" width={30} height={30} />
                  ) : null
                ) : block.hasBomb ? (
                  <img src="/images/bomb.webp" width={30} height={30} />
                ) : (
                  <div>{block.value > 0 ? block.value : ""}</div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <button className="new-game" onClick={() => setBoard(undefined)}>
        Back
      </button>
    </>
  );
};
