import { useRef, useEffect } from "react";
import { useTheme } from "styled-components";
import { ScrollMenu } from "react-horizontal-scrolling-menu";
import { ListContainer } from "./styles";

import { LeftArrow, RightArrow } from "./arrows";
import ListItem from "./listItem/ListItem";
import usePreventBodyScroll from "./usePreventBodyScroll";
import usePrevious from "./usePrevious";
import { IconButton } from "@mui/material";
import { MdClose } from "react-icons/md";
import Tooltip from "@mui/material/Tooltip";
import ServicesModal from "./../modal/Modal";
import PlatformDetails from "./../platformDetails/PlatformDetails";
import PlatformBind from './../../views/auth/platforms/PlatformBind';

export default function HorizontalList({
  itemsList,
  onClickClose,
  setFilter,
  handleOnRemoveFilters,
  requestSearch,
  langOptions,
  bindView,
  CustomListItem,
  listProps,
  paddingRight,
  scrollWidth,
  firstItemMl,
}) {
  const { disableScroll, enableScroll } = usePreventBodyScroll();
  const itemsPrev = usePrevious(itemsList);

  const apiRef = useRef({});
  const theme = useTheme();

  //list props
  const isUserBindedByPlatform = listProps && listProps.isUserBindedByPlatform;
  const currentPlatforms = listProps && listProps.currentPlatforms;
  const handleOnOpenUnbindModal =
    listProps && listProps.handleOnOpenUnbindModal;

  useEffect(() => {
    if (itemsList.length > itemsPrev?.length) {
      apiRef.current?.scrollToItem?.(
        apiRef.current?.getItemElementById(itemsList.slice(-1)?.[0]?.id)
      );
    }
  }, [itemsPrev, itemsList]);

  return (
    <ListContainer
      scrollWidth={scrollWidth}
      paddingRight={paddingRight}
      firstItemMl={firstItemMl}
    >
      <div onMouseEnter={disableScroll} onMouseLeave={enableScroll}>
        <ScrollMenu
          LeftArrow={<LeftArrow hasItem={itemsList.length > 0} />}
          RightArrow={<RightArrow hasItem={itemsList.length > 0} />}
          onWheel={onWheel}
          apiRef={apiRef}
          wrapperClassName="scroll-menu-wrapper"
        >
          {bindView
            ? Object.keys(itemsList).map((platform) => (
                <ListItem
                  ServicesModal={
                    <ServicesModal
                      headless
                      ModalContent={
                        isUserBindedByPlatform(platform)
                          ? PlatformDetails
                          : PlatformBind
                      }
                      modalProps={{
                        platformResetPath: currentPlatforms[platform].resetPath,
                        platformPrefix:
                          currentPlatforms[platform].platformPrefix,
                        platformLogo: currentPlatforms[platform].icon,
                        platformColor: theme.colors[`${platform}Primary`],
                        infos: currentPlatforms[platform].infos,
                        handleOnUnbindPlatform: () =>
                          handleOnOpenUnbindModal(platform),
                      }}
                      setModalFunction={(f) => {
                        currentPlatforms[platform].setModalFunction(f);
                      }}
                    />
                  }
                  CustomListItem={CustomListItem}
                  key={platform}
                  itemId={platform}
                  platform={platform}
                />
              ))
            : itemsList.map(({ id, label, icon, FilterView, select }) => (
                <ListItem
                  title={label}
                  itemId={id}
                  key={id}
                  icon={icon}
                  onClickClose={onClickClose}
                  select={select}
                  FilterView={FilterView}
                  setFilter={setFilter}
                  requestSearch={requestSearch}
                  options={langOptions}
                />
              ))}
        </ScrollMenu>
      </div>
      {!bindView && itemsList.length > 0 && (
        <Tooltip title="Limpar tudo" placement="top">
          <IconButton onClick={handleOnRemoveFilters}>
            <MdClose />
          </IconButton>
        </Tooltip>
      )}
    </ListContainer>
  );
}

function onWheel(apiObj, ev) {
  const isThouchpad = Math.abs(ev.deltaX) !== 0 || Math.abs(ev.deltaY) < 15;

  if (isThouchpad) {
    ev.stopPropagation();
    return;
  }

  if (ev.deltaY < 0) {
    apiObj.scrollNext();
  } else if (ev.deltaY > 0) {
    apiObj.scrollPrev();
  }
}
