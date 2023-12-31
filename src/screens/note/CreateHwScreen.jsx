import React, { useEffect, useState } from "react";

import styled from "styled-components/native";
import color from "../../common/color";

import { useNavigation, useRoute } from "@react-navigation/native";

import {
  dateFormat,
  dateToTimeFormat,
  serverDateFormat,
  serverDateFormatToDate,
} from "../../utils/date";

import MainLayout from "../../components/common/MainLayout";
import NoteHeader from "../../components/note/NoteHeader";
import TextInputForm from "../../components/inputs/TextInputForm";
import HwFrequencyForm from "../../components/inputs/HwFrequencyForm";
import DateDurationForm from "../../components/inputs/DateDurationForm";
import KeyboardAvoidingLayout from "../../components/common/KeyboardAvoidingLayout";
import BigButton from "../../components/common/BigButton";
import PrevNextButtons from "../../components/common/PrevNextButtons";
import { FontAwesome5, MaterialIcons, Feather } from "@expo/vector-icons";
import { Alert, TouchableOpacity } from "react-native";

import days from "../../constants/days";
import client from "../../config/axios";
import ConfirmButtons from "../../components/common/ConfirmButtons";
import { getClassNote } from "../../redux/actions/classNoteAction";
import { useDispatch } from "react-redux";
import { getAssignmentList } from "../../redux/actions/assignmentListAction";
import { clearClassInfo } from "../../redux/actions/classInfoAction";
import { clearClassListInfo } from "../../redux/actions/classListInfoAction";

const AssignmentItem = ({
  body,
  amount,
  startDate,
  endDate,
  frequency,
  onPressXButton,
}) => {
  const sortedFrequency = frequency.sort();

  return (
    <AssignmentContainer>
      <AssignmentWrapper>
        <AssignmentBodyWrapper>
          <FontAwesome5 name="check" size={12} color={color.COLOR_GRAY_ICON} />
          <AssignmentBody>{body}</AssignmentBody>
        </AssignmentBodyWrapper>

        <TouchableOpacity onPress={onPressXButton}>
          <Feather name="x" size={18} color={color.COLOR_GRAY_ICON} />
        </TouchableOpacity>
      </AssignmentWrapper>

      <AssignmentWrapper>
        <AssignmentInfo>
          {startDate} ~ {endDate}
        </AssignmentInfo>

        {sortedFrequency.length > 0 && (
          <AssignmentInfo>
            매주 {sortedFrequency.map((day) => `${days[day].text} `)} 제출
          </AssignmentInfo>
        )}
      </AssignmentWrapper>

      <AssignmentWrapper style={{ justifyContent: "flex-end" }}>
        <AssignmentInfo>{amount}</AssignmentInfo>
      </AssignmentWrapper>
    </AssignmentContainer>
  );
};

const CreateHwScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute();
  const { date, tutoringId, prevStates, prevAssignment, noteId } = route.params;

  const [assignmentList, setAssignmentList] = useState([]);
  // 숙제 내용
  const [body, setBody] = useState("");
  // 시작, 끝 일시
  const today = new Date();
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);
  // 제출 빈도
  const [frequency, setFrequency] = useState([]);
  // 제출양
  const [amount, setAmount] = useState("");

  const getAssignmentBody = () => {
    const data = {
      body,
      frequency,
      startDate: serverDateFormat(startDate),
      endDate: serverDateFormat(endDate),
      amount,
    };

    return data;
  };

  const onPressPlusButton = () => {
    if (!body) {
      Alert.alert("숙제 내용을 입력해주세요!");
      return;
    }
    if (!amount) {
      Alert.alert("숙제 분량을 입력해주세요!");
      return;
    }

    const data = getAssignmentBody();
    setAssignmentList([...assignmentList, data]);
    setBody("");
    setStartDate(today);
    setEndDate(today);
    setFrequency([]);
    setAmount("");
  };

  const onPressXButton = (idx) => {
    setAssignmentList(assignmentList.filter((_, index) => index !== idx));
  };

  const onPressNext = () => {
    const nextStates = {
      ...prevStates,
      assignmentList,
    };
    navigation.navigate("CreateReviewScreen", {
      date,
      tutoringId,
      prevStates: nextStates,
    });
  };

  const refetchData = async () => {
    const noteId = prevAssignment?.noteId;

    if (noteId) {
      await getClassNote(noteId).then((ret) => dispatch(ret));
    }
    await getAssignmentList(tutoringId).then((ret) => dispatch(ret));
    dispatch(clearClassInfo());
    dispatch(clearClassListInfo());
  };

  const handleCreateAssignment = async () => {
    try {
      const data = {
        ...getAssignmentBody(),
        tutoringId,
        noteId: noteId ? noteId : 0,
      };

      // console.log(data);

      const ret = await client.post("/api/assignment", data);

      if (ret.status == 200) {
        await refetchData().then(() => {
          navigation.navigate("HwListScreen", {
            tutoringId,
          });
        });
      }
    } catch (err) {
      console.log("create assighment error: ", err);
    }
  };

  const handleUpdateAssignment = async () => {
    try {
      const data = getAssignmentBody();
      // console.log(data);

      const ret = await client.put(
        `/api/assignment/${prevAssignment.id}`,
        data
      );

      if (ret.status == 200) {
        await refetchData().then(() => {
          navigation.navigate("HwListScreen", {
            tutoringId,
          });
        });
      }
    } catch (err) {
      console.log("update assighment error: ", err);
    }
  };

  const handleDeleteAssignment = () => {
    Alert.alert("숙제 노트 삭제", "해당 숙제 노트를 삭제하시겠습니까?", [
      {
        text: "취소",
        onPress: () => {},
        style: "cancel",
      },
      {
        text: "삭제",
        onPress: async () => {
          try {
            const ret = await client.delete(
              `/api/assignment/${prevAssignment.id}`
            );

            if (ret.status == 200) {
              await refetchData().then(() => {
                navigation.navigate("HwListScreen", {
                  tutoringId,
                });
              });
            }
          } catch (err) {
            console.log("delete assighment error: ", err);
          }
        },
      },
    ]);
  };

  useEffect(() => {
    if (prevAssignment) {
      // console.log(prevAssignment);
      const { body, startDate, endDate, frequency, amount } = prevAssignment;
      setBody(body);
      setFrequency(frequency);
      setAmount(amount);
      setStartDate(serverDateFormatToDate(startDate));
      setEndDate(serverDateFormatToDate(endDate));
    }
  }, [prevAssignment]);

  return (
    <KeyboardAvoidingLayout>
      <MainLayout
        headerText={"숙제 노트 작성"}
        headerLeftType={"back"}
        bgColor="white"
      >
        <NoteHeader
          type="basic"
          text={
            date
              ? dateFormat(date)
              : prevAssignment
              ? "숙제 노트 편집"
              : "숙제 노트 추가"
          }
        />

        <TextInputForm
          label="숙제 내용"
          value={body}
          onChangeText={setBody}
          placeholder={"숙제 내용을 입력하세요."}
        />

        <TextInputForm
          label="숙제 분량"
          value={amount}
          onChangeText={setAmount}
          placeholder={"숙제 1회 제출 시 제출 분량을 입력하세요."}
        />

        <DateDurationForm
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />

        <HwFrequencyForm frequency={frequency} setFrequency={setFrequency} />

        <Container>
          {prevStates && (
            <>
              <PlusButton onPress={onPressPlusButton}>
                <FontAwesome5
                  name="plus"
                  size={16}
                  color={color.COLOR_GRAY_ICON}
                />
              </PlusButton>

              {assignmentList.length > 0 && (
                <AssignmentList>
                  {assignmentList.map((data, idx) => (
                    <AssignmentItem
                      key={`assingment_${idx}`}
                      body={data.body}
                      amount={data.amount}
                      startDate={data.startDate}
                      endDate={data.endDate}
                      frequency={data.frequency}
                      onPressXButton={onPressXButton.bind(this, idx)}
                    />
                  ))}
                </AssignmentList>
              )}
            </>
          )}
        </Container>
      </MainLayout>

      {prevStates ? (
        <PrevNextButtons onPressNext={onPressNext} />
      ) : prevAssignment ? (
        <ConfirmButtons
          cancelText="삭제"
          confirmText={"편집"}
          filled={true}
          cancelButtonColor={color.COLOR_RED_TEXT}
          buttonColor={color.COLOR_MAIN}
          onCancel={handleDeleteAssignment}
          onConfirm={handleUpdateAssignment}
        />
      ) : (
        <BigButton onPress={handleCreateAssignment} text={"숙제 노트 추가"} />
      )}
    </KeyboardAvoidingLayout>
  );
};

export default CreateHwScreen;

const Container = styled.View`
  padding-horizontal: 15;
`;

const PlusButton = styled.TouchableOpacity`
  align-self: center;
  align-items: center;
  justify-content: center;
  border-width: 2;
  border-color: ${color.COLOR_GRAY_ICON};
  border-radius: 100px;
  width: 30;
  height: 30;
  margin-vertical: 20;
`;

const AssignmentList = styled.View``;

const AssignmentContainer = styled.View`
  margin-bottom: 10;
`;

const AssignmentWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5;
`;

const AssignmentBodyWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

const AssignmentBody = styled.Text`
  font-size: 16;

  font-weight: bold;
  margin-left: 10;
`;

const AssignmentInfo = styled.Text`
  color: ${color.COLOR_GRAY_TEXT};
`;
