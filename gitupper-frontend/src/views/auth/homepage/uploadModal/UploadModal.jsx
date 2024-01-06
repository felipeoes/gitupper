import { useContext } from "react";

import AuthContext from "../../../../contexts/auth";
import BindView from "./bindView/BindView";
import UploadView from "./uploadView/UploadView";

export default function UploadModal(props) {
  const { user } = useContext(AuthContext).state;

  return user?.github_user?.github_id ? (
    <UploadView {...props} />
  ) : (
    <BindView />
  );
}
