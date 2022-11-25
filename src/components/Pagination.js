import { useState } from 'react';
import './Pagination.css';

const Pagination = ({ userPerPage, totalUsers, handlePageNumber }) => {
  const [currentPageNumber, setCurrentPageNumber] = useState(1);

  const pageNumbers = [];
  for (
    let pageNumber = 1;
    pageNumber <= Math.ceil(totalUsers / userPerPage);
    pageNumber++
  ) {
    pageNumbers.push(pageNumber);
  }

  return (
    <div>
      <ul>
        <div className="pagination">
          <>
            <div
              className="arrow"
              onClick={() => {
                handlePageNumber(1);
                setCurrentPageNumber(1);
              }}
            >
              {'<<'}
            </div>
            <div
              className="arrow"
              onClick={() => {
                if (currentPageNumber - 1 > 0) {
                  handlePageNumber(currentPageNumber - 1);
                  setCurrentPageNumber(currentPageNumber - 1);
                }
              }}
            >
              {'<'}
            </div>
          </>
          <>
            {pageNumbers.map((pageNumber) => (
              <div
                key={pageNumber}
                className={
                  currentPageNumber === pageNumber
                    ? 'arrow-selected'
                    : 'arrow mobile-page'
                }
                onClick={() => {
                  handlePageNumber(pageNumber);
                  setCurrentPageNumber(pageNumber);
                }}
              >
                {pageNumber}
              </div>
            ))}
          </>
          <>
            <div
              className="arrow"
              onClick={() => {
                if (currentPageNumber + 1 <= pageNumbers.length) {
                  handlePageNumber(currentPageNumber + 1);
                  setCurrentPageNumber(currentPageNumber + 1);
                }
              }}
            >
              {'>'}
            </div>
            <div
              className="arrow"
              onClick={() => {
                handlePageNumber(pageNumbers[pageNumbers.length - 1]);
                setCurrentPageNumber(pageNumbers[pageNumbers.length - 1]);
              }}
            >
              {'>>'}
            </div>
          </>
        </div>
      </ul>
    </div>
  );
};

export default Pagination;
