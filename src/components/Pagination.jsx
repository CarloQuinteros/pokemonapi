function Pagination({ currentPage, totalPages, onChangePage }) {
  const windowSize = 5;
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);
  return (
    <>
      <nav>
        <button
          disabled={currentPage === 1}
          onClick={() => onChangePage(currentPage - 1)}
        >
          Prev
        </button>
        {start > 1 && <button onClick={() => onChangePage(1)}>1</button>}

        {start > 2 && <span>...</span>}

        {Array.from({ length: end - start + 1 }, (_, i) => {
          const pageNum = start + i;
          return (
            <button key={pageNum} onClick={() => onChangePage(pageNum)}>
              {pageNum}
            </button>
          );
        })}

        {end < totalPages - 1 && <span>...</span>}
        {end < totalPages && (
          <button onClick={() => onChangePage(totalPages)}>{totalPages}</button>
        )}
        <button
          disabled={currentPage === totalPages}
          onClick={() => onChangePage(currentPage + 1)}
        >
          Next
        </button>
      </nav>
    </>
  );
}

export default Pagination;
