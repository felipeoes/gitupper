import { useContext } from "react";

import AuthContext from "../../../../contexts/auth";
import BindView from "./bindView/BindView";
import UploadView from "./uploadView/UploadView";

export default function UploadModal({
  columns,
  categoryOptions,
  dateOptions,
  langOptions,
  statusOptions,
  platformName,
  platformPrefix,
  platformId,
  selectedSubmissions,
  setLoading,
  handleOnClose,
}) {
  const { state } = useContext(AuthContext);

  return state.user.github_id ? (
    <UploadView
      columns={columns}
      categoryOptions={categoryOptions}
      dateOptions={dateOptions}
      langOptions={langOptions}
      statusOptions={statusOptions}
      platformName={platformName}
      platformPrefix={platformPrefix}
      platformId={platformId}
      selectedSubmissions={selectedSubmissions}
      keepMounted={setLoading}
      handleOnClose={handleOnClose}
    />
  ) : (
    <BindView />
  );
}
