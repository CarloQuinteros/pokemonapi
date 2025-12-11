function Pagination({ currentPage, totalPages, onChangePage }) {
  return (
    <>
      <nav>
        <button
          disabled={currentPage === 1}
          onClick={() => onChangePage(currentPage - 1)}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
          <button key={num} onClick={() => onChangePage(num)}>
            {num}
          </button>
        ))}
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
