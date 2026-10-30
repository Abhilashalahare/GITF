import React from 'react';

export default function Pagination({
  currentPage = 1,
  totalPages = 0,
  onPageChange,
  light = false,
}) {
  // Hide pagination when there is only one page
  if (totalPages <= 1) return null;

  const buttonClass = (active, disabled) => {
    const base =
      'px-4 py-2 text-sm font-semibold border rounded-lg transition-colors duration-200';

    if (disabled) {
      return `${base} opacity-40 cursor-not-allowed ${
        light ? 'border-white/20 text-white' : 'border-gray-200 text-gray-400'
      }`;
    }

    if (active) {
      return `${base} ${
        light
          ? 'bg-white text-[#7E5CAD] border-white'
          : 'bg-[#7E5CAD] text-white border-[#7E5CAD]'
      }`;
    }

    return `${base} ${
      light
        ? 'border-white/30 text-white hover:bg-white/10'
        : 'border-gray-300 text-gray-700 hover:bg-gray-100'
    }`;
  };

  // Show the current page and up to two pages on either side
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, currentPage + 2);

  const pages = [];

  for (let page = startPage; page <= endPage; page++) {
    pages.push(page);
  }

  return (
    <nav
      aria-label="Gallery pagination"
      className="mt-8 flex flex-wrap items-center justify-center gap-2"
    >
      <button
        type="button"
        disabled={currentPage <= 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={buttonClass(false, currentPage <= 1)}
      >
        Previous
      </button>

      {pages.map((page) => (
        <button
          key={page}
          type="button"
          aria-current={page === currentPage ? 'page' : undefined}
          onClick={() => onPageChange(page)}
          className={buttonClass(page === currentPage, false)}
        >
          {page}
        </button>
      ))}

      <button
        type="button"
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={buttonClass(false, currentPage >= totalPages)}
      >
        Next
      </button>
    </nav>
  );
}