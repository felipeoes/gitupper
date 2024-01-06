import { useState } from "react";
import HorizontalList from "./../horizontalList/HorizontalList";
import { FilterContainer, SearchFilterButtonsContainer } from "./styles";
import SearchFilter from "./../searchFilter/SearchFilter";
import DropdownMenu from "./../dropdownMenu/DropdownMenu";

import { MdAdd } from "react-icons/md";
export default function Filter({
  columns,
  filteringRows,
  setFilteredRows,
  searchValue,
  // setSearchingValue,
  handleOnSubmitSearchText,
  langOptions,
  disabled,
}) {
  const [searchText, setSearchText] = useState("");
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [filteringColumns, setFilteringColumns] = useState([]);
  const [filters, setFilters] = useState(createFiltersObj());
  const [rows, setRows] = useState(filteringRows);
  const [prevFilters, setPrevFilters] = useState([]);

  function createFiltersObj() {
    const filters = {};

    columns.forEach((filter) => {
      filters[filter.id] = "";
    });

    return filters;
  }

  function handleOnUnsetFilter() {
    prevFilters.forEach((filter) => {
      handleOnSearchRequest(filter, prevFilters[filter]);
    });
    // setRows(prevRows); //seta a lista de itens com a filtragem imediatamente anterior
    // setFilteredRows(prevRows);
  }

  function checkHasFilter() {
    const hasFilter = Object.keys(filters).some((filter) => {
      return filters[filter] !== "";
    });

    return hasFilter;
  }

  function onClickItemClose(itemId) {
    setFilteringColumns(filteringColumns.filter((item) => item.id !== itemId));

    let newFilters = filters;
    newFilters[itemId] = "";

    const hasFilter = Object.keys(newFilters).some((filter) => {
      return newFilters[filter] !== "";
    });

    if (!hasFilter) {
      setRows(filteringRows);
      setFilteredRows(filteringRows);
    } else {
      handleOnUnsetFilter();
    }
  }

  function handleOnSearchRequest(column, filter, filterRequest) {
    Object.keys(filters).forEach((key) => {
      filters[key] !== "" &&
        !prevFilters.includes({ [key]: filters[key] }) &&
        prevFilters.push({ [key]: filters[key] });
    });

    // setPrevFilters(prevFiltersList);
    setFilters((prevState) => ({
      ...prevState,
      [column]: filter,
    }));

    const hasFilter = checkHasFilter();
    hasFilter && !filterRequest
      ? (filterRequest = true)
      : (filterRequest = false);

    // column === "date_submitted"
    //   ? requestSearch(null, filter[0], filter[1], filterRequest)
    //   : requestSearch(filter, null, null, filterRequest);
  }

  function handleOnRemoveFilters() {
    setFilteringColumns([]);
    setFilters({});
    setRows(filteringRows);
    setFilteredRows(filteringRows);
  }

  function escapeRegExp(value) {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  }

  function format_prog_language(prog_language) {
    return prog_language.split(" ")[0].replace(/[0-9]/g, "");
  }
  // const requestSearch = (searchValue, startDate, endDate, filterRequest) => {
  //   let targetRows = filteringRows;

  //   if (filterRequest) {
  //     targetRows = rows;
  //   }

  //   if (startDate) {
  //     const filteredRows = targetRows.filter((row) => {
  //       let submission_date = new Date(
  //         row.date_submitted.split(" ")[0].split("/").reverse().join("/")
  //       );
  //       return submission_date >= startDate && submission_date <= endDate;
  //     });

  //     setRows(filteredRows);
  //     setFilteredRows(filteredRows);
  //   } else if (searchValue) {
  //     let filteredRows = null;

  //     if (typeof searchValue === "object") {
  //       filteredRows = targetRows.filter((row) => {
  //         return Object.keys(row).some((field) => {
  //           return field !== "source_code" && field === "prog_language"
  //             ? searchValue.includes(format_prog_language(row[field]))
  //             : searchValue.includes(row[field].toString());
  //         });
  //       });
  //     } else {
  //       setSearchText(searchValue);

  //       const searchRegex = new RegExp(escapeRegExp(searchValue), "i");
  //       filteredRows = targetRows.filter((row) => {
  //         return Object.keys(row).some((field) => {
  //           return (
  //             field !== "source_code" && searchRegex.test(row[field].toString())
  //           );
  //         });
  //       });
  //     }

  //     setFilteredRows(filteredRows);
  //     setRows(filteredRows);
  //   } else {
  //     setSearchText("");
  //     setRows(filteringRows);
  //     setFilteredRows(filteringRows);
  //   }
  // };

  async function requestSearch(searchText) {
    setLoadingSearch(true);
    await handleOnSubmitSearchText(searchText);

    setLoadingSearch(false);
  }
  return (
    <FilterContainer>
      <SearchFilterButtonsContainer>
        <SearchFilter
          placeholder="Buscar por nome"
          value={searchText}
          // onChange={(e) => requestSearch(e.target.value)}
          onChange={(e) =>
            e.target.value
              ? setSearchText(e.target.value)
              : (setSearchText(""), requestSearch(""))
          }
          clearSearch={() => setSearchText("")}
          disabled={disabled}
          onClick={() => requestSearch(searchText)}
          loading={loadingSearch}
        />

        <DropdownMenu
          button
          Icon={MdAdd}
          buttonWidth={160}
          buttonHeight={40}
          buttonText="Adicionar filtro"
          iconMr={8}
          buttonMt={4}
          filteringColumns={filteringColumns}
          menuItems={columns}
          onClickItem={(item) => {
            setFilteringColumns((columns) => columns.concat(item));
          }}
          disabled={true}
          // disabled={disabled}
        />
      </SearchFilterButtonsContainer>
      <HorizontalList
        langOptions={langOptions}
        setFilter={(column, filter, filterRequest) =>
          handleOnSearchRequest(column, filter, filterRequest)
        }
        itemsList={filteringColumns}
        handleOnRemoveFilters={handleOnRemoveFilters}
        onClickClose={(itemId) => onClickItemClose(itemId)}
        disabled={true}
      />
    </FilterContainer>
  );
}
