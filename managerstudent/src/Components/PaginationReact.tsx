import React, { FC } from "react";
import Pagination from "react-bootstrap/Pagination";
export interface IPagination {
  totalPage: number;
  currentPage: number;
  onChangePage: any;
}
const PaginationRect: FC<IPagination> = ({
  totalPage,
  currentPage,
  onChangePage,
}) => {
  let pageMax = 6;
  var arrayPage = [];
  if (pageMax > totalPage) {
    for (let i = 1; i <= totalPage; i++) {
      arrayPage.push(i);
    }
  } else if (currentPage < pageMax) {
    for (let i = 1; i <= pageMax; i++) {
      arrayPage.push(i);
    }
  } else if (currentPage === totalPage) {
    for (let i = currentPage - 5; i <= currentPage; i++) {
      arrayPage.push(i);
    }
  } else {
    for (let i = currentPage - 4; i <= currentPage + 1; i++) {
      arrayPage.push(i);
    }
  }
  return (
    <>
      <nav aria-label="Page navigation">
        <ul className="pagination justify-content-end">
          <li className="page-item">
            <div
              className={`page-link ${currentPage <= 1 && "disabled"}`}
              aria-label="Previous"
              onClick={() => onChangePage(currentPage - 1)}
            >
              <span aria-hidden="true">«</span>
            </div>
          </li>
          {arrayPage.map((item, index) => (
            <li
              className={`page-item ${currentPage === item && "active"} `}
              key={index}
              onClick={() => onChangePage(item)}
            >
              <div className="page-link">{item}</div>
            </li>
          ))}

          <li className="page-item">
            <a
              className={`page-link ${
                currentPage === totalPage || currentPage > totalPage
                  ? "disabled"
                  : ""
              }`}
              aria-label="Next"
              onClick={() => onChangePage(currentPage + 1)}
            >
              <span aria-hidden="true">»</span>
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
};
export default PaginationRect;
