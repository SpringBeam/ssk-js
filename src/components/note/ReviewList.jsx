import React, { useEffect } from "react";

import { FlatList, StyleSheet } from "react-native";

import ReviewItem from "./ReviewItem";
import EmptyMessage from "../common/EmptyMessage";
import { useDispatch } from "react-redux";
import { getReviewList } from "../../redux/actions/reviewListAction";

const ReviewList = ({
  tutoringId,
  reviewList,
  editMode,
  selectedList,
  setSelectedList,
  completed = false,
}) => {
  const dispatch = useDispatch();

  const onPressItem = (data) => {
    if (selectedList.includes(data)) {
      setSelectedList(selectedList.filter((el) => el != data));
    } else {
      setSelectedList([...selectedList, data]);
    }
  };

  useEffect(() => {
    return () => {
      if (!completed) {
        getReviewList(tutoringId).then((ret) => {
          dispatch(ret);
        });
      }
    };
  }, [tutoringId]);

  if (!reviewList) {
    return <></>;
  }

  return (
    <>
      {reviewList.length == 0 ? (
        <EmptyMessage paddingVertical={15} message={"복습 목록이 없습니다!"} />
      ) : (
        <FlatList
          keyExtractor={(item, idx) => `review_${item.id}`}
          data={reviewList}
          renderItem={({ item }) => (
            <ReviewItem
              tutoringId={tutoringId}
              editMode={editMode}
              onPressItem={onPressItem}
              data={item}
              completed={completed}
            />
          )}
        />
      )}
    </>
  );
};

export default ReviewList;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "visible",
  },
});
