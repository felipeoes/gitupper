import { useState } from "react";
import { useTheme } from "styled-components";
import Button from "../../../../../components/button/Button";
import { FilterViewContainer, ApplyButtonContainer } from "../date/styles";
import Checkbox from "../../../../../components/checkbox/Checkbox";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { LanguageOption, LanguageViewTitle } from "./styles";

export function LanguageFilterView({
  columnId,
  setFilter,
  setButtonText,
  langOptions,
}) {
  const [selectedValues, setSelectedValues] = useState([]);
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  function disabledButton() {
    return selectedValues.length === 0;
  }

  function getUniqueValues(values) {
    return [
      ...new Set(
        values.map((value) => value.split(" ")[0].replace(/[0-9]/g, ""))
      ),
    ];
  }

  function handleOnRequestSearch(values) {
    setFilter(columnId, values); // filterRequest === true

    setButtonText(`${selectedValues.map((value) => value)}`);
  }

  function handleOnClickApply() {
    setLoading(true);
    handleOnRequestSearch(selectedValues);
    setLoading(false);
  }

  function handleOnRemoveFilters() {
    setSelectedValues([]);
    setFilter(columnId, langOptions);
    setButtonText("Linguagem");
  }

  return (
    <FilterViewContainer>
      <LanguageViewTitle>Filtrar por linguagem</LanguageViewTitle>
      <Autocomplete
        id="auto-complete"
        autoComplete
        multiple
        disableCloseOnSelect
        options={getUniqueValues(langOptions)}
        value={selectedValues}
        clearText="Limpar filtragem"
        onChange={(event, newValue) => {
          newValue.length > 0
            ? setSelectedValues([...newValue])
            : handleOnRemoveFilters();
        }}
        renderOption={(props, option, { selected }) => (
          <LanguageOption {...props}>
            <Checkbox color={theme.colors.primary} checked={selected} />
            <span style={{ paddingLeft: 8 }}>{option}</span>
          </LanguageOption>
        )}
        style={{
          margin: 30,
          marginBottom: 24,
          paddingBottom: 24,
          width: 242,
          border: 0,
          height: 36,
          fontSize: 14,
          fontFamily: "InterMedium",
          fontWeight: "500",
        }}
        renderInput={(params) => (
          <TextField
            placeholder={selectedValues.length === 0 && "Digite a linguagem"}
            {...params}
          />
        )}
        size="small"
        placeholder="Digite a linguagem"
      />
      <ApplyButtonContainer>
        <Button
        disableElevation
          btnType="loading"
          type="button"
          bgColor={theme.colors.primary}
          fontFamily="InterSemiBold"
          width={90}
          height={32}
          fontSize={14}
          onClick={handleOnClickApply}
          disabled={disabledButton()}
          loading={loading}
          marginBottom={24}
        >
          Aplicar
        </Button>
      </ApplyButtonContainer>
    </FilterViewContainer>
  );
}
