import styled from "styled-components";

export const UploadViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding-left: 32px;
  padding-right: 32px;
`;

export const TextFieldsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

export const UploadOptionContainer = styled.div`
  display: flex;
  flex-direction: column;

  margin-left: ${(props) => props.marginLeft || 0}px;
  margin-right: ${(props) => props.marginRight || 0}px;
  margin-top: ${(props) => props.marginTop || 16}px;
  margin-bottom: ${(props) => props.marginBottom || 0}px;
  width: ${(props) => props.width || "100%"};
`;

export const UploadGroupingContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  margin-top: ${(props) => props.marginTop || 8}px;
`;

export const RadioButtonsContainer = styled.div`
  margin-left: -16px;
`;

export const FilesTreeViewContainer = styled.div`
  padding-top: 8px;
  max-height: 152px;
  overflow: auto;
`;
