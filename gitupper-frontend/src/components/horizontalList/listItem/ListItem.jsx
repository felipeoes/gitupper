import { useContext, useState, Fragment } from "react";
import { useTheme } from "styled-components";
import { VisibilityContext } from "react-horizontal-scrolling-menu";
import DropdownMenu from "../../dropdownMenu/DropdownMenu";
import { IconButton } from "@mui/material";
import { MdClose } from "react-icons/md";
import { ListItemContainer } from "./styles";

export default function ListItem({
  title,
  itemId,
  icon,
  onClickClose,
  FilterView,
  setFilter,
  requestSearch,
  select,
  options,
  CustomListItem,
  ServicesModal,
  platform,
}) {
  const [buttonText, setButtonText] = useState(title);
  const theme = useTheme();
  const visibility = useContext(VisibilityContext);

  const visible = visibility.isItemVisible(itemId);

  return CustomListItem ? (
    <Fragment>
      {ServicesModal}
      <CustomListItem platform={platform} />
    </Fragment>
  ) : (
    <ListItemContainer>
      <IconButton
        className="list-item-close-icon"
        onClick={() => onClickClose(itemId)}
      >
        <MdClose size={16} />
      </IconButton>
      {/* {select ? (
        <FilterView />
      ) : ( */}
      <DropdownMenu
        keepMounted
        className="dropdown-menu"
        disabled={!visible}
        button
        buttonMr={12}
        Icon={icon && icon}
        iconSize={18}
        iconMr={8}
        fontSize={12}
        fontFamily="InterRegular"
        fontWeight="400"
        iconColor={theme.colors.filterText}
        buttonWidth={180}
        buttonHeight={36}
        buttonText={buttonText}
        color={theme.colors.filterText}
        borderColor={"transparent"}
        bgColor={theme.colors.filter}
        setFilter={setFilter}
        setButtonText={setButtonText}
        requestSearch={requestSearch}
        options={options}
        FilterView={FilterView}
        columnId={itemId}
        menuWidth={227}
        // onClickItem={(item) => console.log("Novo filtro: ", item)}
      />
      {/* )} */}
    </ListItemContainer>
  );
}
