import { useState } from "react";
import { useTheme } from "styled-components";
import {
  ApplyButtonContainer,
  FilterViewContainer,
  CustomizedViewContainer,
} from "./styles";
import RadioButton from "../../../../../components/radioButton/RadioButton";
import Button from "../../../../../components/button/Button";
import DatePicker from "../../../../../components/datePicker/DatePicker";

const options = [
  { id: "a", label: "Últimas 24 horas" },
  { id: "b", label: "Últimos 7 dias" },
  { id: "c", label: "Últimos 30 dias" },
  { id: "d", label: "Período customizado" },
];

const dateOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

const defaultEndDate = new Date();

export function DateFilterView({ columnId, setFilter, setButtonText }) {
  const [selectedValue, setSelectedValue] = useState(options[0].label);
  const [selectedDate, setSelectedDate] = useState({ from: "", to: "" });
  const [loading, setLoading] = useState(false);
  const theme = useTheme();

  const handleChange = (event) => {
    setSelectedValue(event.target.value);
  };

  const controlProps = (item) => ({
    checked: selectedValue === item.label,
    onChange: handleChange,
    value: item.label,
    name: "date-radio-button",
    inputProps: { "aria-label": item.label },
  });

  function disabledButton() {
    return (
      !selectedValue ||
      (selectedValue === "Período customizado" &&
        (!selectedDate.from || !selectedDate.to))
    );
  }

  function formatDate(date) {
    const splittedDate = date
      .toLocaleDateString("pt-BR", dateOptions)
      .split("de");

    return (
      splittedDate[0] +
      splittedDate[1].replace(".", ",") +
      splittedDate[2].substr(-2)
    );
  }

  function handleOnRequestSearch(startDate, endDate = defaultEndDate) {
    setFilter(columnId, [startDate, endDate]);

    const startDateStr = formatDate(startDate);
    const endDateStr = formatDate(endDate);

    setButtonText(`${startDateStr} - ${endDateStr}`);
  }

  function handleOnApply24Hours() {
    let startDate = new Date();
    startDate.setHours(startDate.getHours() - 24);

    handleOnRequestSearch(startDate);
  }

  function handleOnApply7Days() {
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    handleOnRequestSearch(startDate);
  }

  function handleOnApply30Days() {
    let startDate = new Date();
    startDate.setDate(startDate.getDate() - 30);

    handleOnRequestSearch(startDate);
  }

  function handleOnApplyCustomized() {
    handleOnRequestSearch(selectedDate.from, selectedDate.to);
  }

  function handleOnClickApply() {
    setLoading(true);

    switch (selectedValue) {
      case options[0].label:
        handleOnApply24Hours();
        break;
      case options[1].label:
        handleOnApply7Days();
        break;
      case options[2].label:
        handleOnApply30Days();
        break;
      case options[3].label:
        handleOnApplyCustomized();
        break;
      default:
        break;
    }

    setLoading(false);
  }

  return (
    <FilterViewContainer>
      {options.map((item) => (
        <RadioButton id={item.id} label={item.label} {...controlProps(item)} />
      ))}
      {selectedValue === "Período customizado" && (
        <CustomizedViewContainer>
          <DatePicker
            marginRight={2}
            getCustomizedDate={(date) =>
              setSelectedDate((prevState) => ({
                ...prevState,
                from: date,
              }))
            }
          />
          <DatePicker
            getCustomizedDate={(date) =>
              setSelectedDate((prevState) => ({
                ...prevState,
                to: date,
              }))
            }
          />
        </CustomizedViewContainer>
      )}
      <ApplyButtonContainer>
        <Button
          disableElevation
          btnType="loading"
          type="button"
          bgColor={theme.colors.primary}
          fontFamily="InterSemiBold"
          width={76}
          height={29}
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
