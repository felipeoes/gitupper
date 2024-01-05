import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import Loading from "../loading/Loading";
import { PaginateContainer } from "./styles";

export default function PaginatedItems({
  itemsPerPage,
  items,
  ReactElementItem,
  ReactElementProps,
  forcedPage,
}) {
  const [currentItems, setCurrentItems] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    setTimeout(setCurrentItems(items.slice(itemOffset, endOffset)), 3000);

    setPageCount(Math.ceil(items.length / itemsPerPage));
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, [itemOffset, itemsPerPage, items, forcedPage]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );

    setItemOffset(newOffset);
  };

  function Items({ currentItems, ReactElementProps }) {
    return (
      currentItems &&
      currentItems.map((item, index) => (
        <ReactElementItem
          checked={ReactElementProps.selectAllChecked}
          currentItem={item}
          key={index}
        />
      ))
    );
  }

  return (
    <div>
      {/* {!loading ? ( */}
      <>
        <Items
          currentItems={currentItems}
          ReactElementProps={ReactElementProps}
        />
        <PaginateContainer>
          <ReactPaginate
            forcePage={forcedPage === 0 && setItemOffset(0)}
            containerClassName={"pagination"}
            previousLinkClassName={"pagination__link"}
            nextLinkClassName={"pagination__link"}
            disabledClassName={"pagination__link--disabled"}
            activeClassName={"pagination__link--active"}
            breakLabel="..."
            nextLabel="→"
            onPageChange={handlePageClick}
            pageRangeDisplayed={5}
            pageCount={pageCount}
            previousLabel="←"
            renderOnZeroPageCount={null}
          />
        </PaginateContainer>
      </>
      {/* ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10%",
          }}
        >
          <Loading />
        </div>
      )} */}
    </div>
  );
}
