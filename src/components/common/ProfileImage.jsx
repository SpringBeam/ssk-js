import React, { useEffect } from "react";
import styled from "styled-components/native";

import color from "../../common/color";

const ProfileImage = ({ size = 35, image }) => {
  return (
    <Container size={size}>
      <Image
        source={
          image
            ? { uri: image, cache: "reload" }
            : require("../../assets/images/default_profile_image.png")
        }
      />
    </Container>
  );
};

export default ProfileImage;

const Container = styled.View`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
`;

const Image = styled.Image`
  width: 100%;
  height: 100%;
  border-radius: 100px;
  resize-mode: cover;
  overflow: hidden;
  border-width: 1;
  border-color: ${color.COLOR_GRAY_BORDER};
`;
