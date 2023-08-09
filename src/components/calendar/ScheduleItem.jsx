import React from "react";
import styled from "styled-components/native";
import color from "../../common/color";

import { Pressable, StyleSheet, Platform } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import UserInfo from "../common/UserInfo";
import tags from "../../common/tags";

const ScheduleItem = ({ handlePressScheduleItem, item }) => {
  // console.log(item);
  return (
    <>
      <Pressable
        style={styles.container}
        onPress={handlePressScheduleItem.bind(this, item)}
      >
        <FontAwesome5 name="check" color={tags[item.color]} size={20} />

        <TimeContainer>
          <StartTime>18:00</StartTime>
          <EndTime>~ 21:00</EndTime>
        </TimeContainer>

        <VerticalLine tagColor={tags[item.color]} />

        <UserInfo />
      </Pressable>
    </>
  );
};

export default ScheduleItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.COLOR_WHITE_BACKGROUND,
    width: "98%",
    height: 55,
    borderRadius: 5,
    marginVertical: 3,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    paddingHorizontal: 20,
    paddingVertical: 7,
    ...Platform.select({
      ios: {
        shadowColor: color.COLOR_BOX_SHADOW,
        shadowOffset: {
          width: 0,
          height: 1,
        },
        shadowOpacity: 0.25,
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});

const TimeContainer = styled.View`
  margin-left: 15;
`;

const StartTime = styled.Text`
  font-weight: bold;
  font-size: 16;
`;

const EndTime = styled.Text`
  font-weight: 500;
  color: ${color.COLOR_GRAY_TEXT};
`;

const VerticalLine = styled.View`
  height: 100%;
  width: 5;
  border-radius: 100;
  background-color: ${({ tagColor }) => (tagColor ? tagColor : "black")};
  margin-horizontal: 15;
`;
