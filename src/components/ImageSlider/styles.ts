import styled, { css } from "styled-components/native";
import { Dimensions } from "react-native";
import FastImage from "react-native-fast-image";

import { Bullet } from "../Bullet";

interface SliderBulletProps {
  isFirst: boolean;
}

interface CarImageProps {
  active: boolean;
}

export const Container = styled.View`
  width: 100%;
`;

export const ImageIndexes = styled.View`
  flex-direction: row;
  align-self: flex-end;
  padding-right: 24px;
`;

export const SliderBullet = styled(Bullet)<SliderBulletProps>`
  ${({ isFirst }) =>
    !isFirst &&
    css`
      margin-left: 8px;
    `};
`;

export const CarImageWrapper = styled.View`
  width: ${Dimensions.get("window").width}px;
  height: 132px;
  justify-content: center;
  align-items: center;
`;

export const CarImage = styled(FastImage)<CarImageProps>`
  width: 280px;
  height: 132px;
  opacity: ${({ active }) => (active ? 1 : 0.5)};
`;
