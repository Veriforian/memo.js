import './cell-list.css';
import React, { useEffect } from 'react';

import { useTypedSelector } from '../hooks/use-typed-selector';
import CellListItem from './cell-list-item';
import AddCell from './add-cell';
import { useActions } from '../hooks/use-actions';

const CellList: React.FC = () => {
  const cellsArr = useTypedSelector(({ cells }) =>
    cells?.order.map((id) => cells.data[id])
  );

  const { fetchCells } = useActions();

  useEffect(() => {
    fetchCells();
  }, [fetchCells]);

  const renderedCells = cellsArr?.map((cell) => {
    if (!cell) return '';
    return (
      <React.Fragment key={cell.id}>
        <CellListItem cell={cell} />
        <AddCell prevCellId={cell.id} />
      </React.Fragment>
    );
  });

  return (
    <div className='cell-list'>
      <AddCell forceVisible={true} prevCellId={null} />
      {renderedCells}
    </div>
  );
};

export default CellList;
