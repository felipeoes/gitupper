/* eslint-disable react-hooks/exhaustive-deps */
import { useContext, useState } from "react";
import { DashboardContainer, ViewContainer } from "./styles";
import { AuthContext } from "../../../contexts";

import {
  platforms_obj as platforms,
  submissionsColumns,
} from "./../../../services/utils/platforms";

import useWindowDimensions, {
  totalHeaderHeight,
} from "../../../services/utils/useWindowsDimensions";
import Select from "./../../../components/common/select/Select";
import NotBind from "./../../../components/notBind/NotBind";
import SubmissionsPanel from "./submissionsPanel/SubmissionsPanel";

export default function HomePage(props) {
  const context = useContext(AuthContext);

  const { state, dispatch } = context;

  const user = state.user;
  const { gitupper_id, platforms_users } = user;
  const [platform, setPlatform] = useState(orderPlatformsBySubmissions()[0]);

  const { height } = useWindowDimensions();
  const maxHeight = height - totalHeaderHeight;

  function orderPlatformsBySubmissions() {
    // platforms withouth submissions are at the end of the array
    let orderedPlatforms = [];
    let platformsWithoutSubmissions = [];

    for (let platform in platforms) {
      let actual = platforms[platform];
      if (platforms_users[actual.platformPrefix]) {
        actual.platformId =
          platforms_users[actual.platformPrefix][`${actual.platformPrefix}_id`];
        orderedPlatforms.push(actual);
      } else {
        platformsWithoutSubmissions.push(actual);
      }
    }
    return orderedPlatforms.concat(platformsWithoutSubmissions);
  }

  function handleChangePlatform(event) {
    const value = event.target.value;
    const platformName = value.name;

    setPlatform(value);
  }

  function capitalize(platformName) {
    return platformName.charAt(0).toUpperCase() + platformName.slice(1);
  }

  return (
    <>
      <DashboardContainer>
        <ViewContainer>
          <Select
            containerStyle={{
              top: 8,
              right: 20,
              position: "absolute",
            }}
            color={platform.color}
            onChange={handleChangePlatform}
            options={orderPlatformsBySubmissions().map((platform) => {
              return {
                value: platform,
                label: capitalize(platform.name),
                itemColor: platform.color,
              };
            })}
          />
          {platforms_users[platform.platformPrefix] ? (
            <SubmissionsPanel
              submissionsColumns={submissionsColumns}
              platform={platform}
              maxHeight={maxHeight}
            />
          ) : (
            <NotBind platform={platform} />
          )}
        </ViewContainer>
      </DashboardContainer>
    </>
  );
}
