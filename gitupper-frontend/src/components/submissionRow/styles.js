import styled from 'styled-components';

export const SubmissionRowContainer = styled.div`
  width: 100%;
`;

export const IconButtonContainter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  border-radius: 4px;
  background-color: ${(props) => props.theme.colors.beecrowdPrimary};

  width: 70px;
  margin-left: 16px;
`;

export const RowContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.colors.white};
  border-radius: 16px;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-left: 16px;
  padding-right: 16px;

  max-width: ${(props) => (props.showText ? "100%" : "150px")};
  overflow: hidden;
  text-overflow: ${(props) => (props.showText ? "clip" : "ellipsis")};
  white-space: nowrap;
  line-height: 12px;
`;

export const SubmissionNumberText = styled.span`
  font-family: InterMedium;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0em;

  color: ${(props) => props.color || props.theme.colors.semiblack};
  opacity: 0.7;
`;