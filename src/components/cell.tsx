import React from 'react';

interface CellProps {
  value: 'X' | 'O' | null;
  onClick: () => void;
}

const Cell: React.FC<CellProps> = ({ value, onClick }) => {
  return (
    <button
      className="w-16 h-16 border border-gray-300 text-2xl font-bold"
      onClick={onClick}
      disabled={value !== null}
    >
      {value}
    </button>
  );
};

export default Cell;