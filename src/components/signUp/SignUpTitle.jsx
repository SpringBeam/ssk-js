import React from "react";
import styled from "styled-components/native";

const SignUpTitle = ({ children }) => {
  return (
    <TitleContainer>
      <TitleText>
        {children}
      </TitleText>
    </TitleContainer>
  );
};

export default SignUpTitle;

// styled
const TitleContainer = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  padding: 0 30px;
`;

const TitleText = styled.Text`
  color: #818181;
  font-size: 24px;  
  font-family: "ExtraBold";
  line-height: 45px;
`;