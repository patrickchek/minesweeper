import React from "react";

interface DifficultyProps {
  difficulty: number;
  updateDifficulty: (difficulty: number) => void;
}

export const Difficulty: React.FC<DifficultyProps> = ({
  difficulty,
  updateDifficulty,
}: DifficultyProps) => {
  return (
    <div className="difficulty">
      <span>Difficulty</span>
      <div className="range">
        <span>1</span>
        <input
          type="range"
          min={1}
          max={5}
          value={difficulty}
          onChange={(e) => updateDifficulty(Number(e.currentTarget.value))}
        />
        <span>5</span>
      </div>
    </div>
  );
};
