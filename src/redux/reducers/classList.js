import ClassListActionTypes from "../actions/types/ClassListActionTypes";

// Default State
const initialState = {
  classList: null,
};

// Reducer
export default function classListReducer(state = initialState, action) {
  switch (action.type) {
    case ClassListActionTypes.GET_CLASS_LSIT:
      return {
        ...state,
        classList: action.classList,
      };
    case ClassListActionTypes.CREATE_CLASS:
      return {
        ...state,
        classList: action.payload,
      };
    case ClassListActionTypes.UPDATE_CLASS:
      return {
        ...state,
        classList: action.payload,
      };
    case ClassListActionTypes.DELETE_CLASS:
      return {
        ...state,
        classList: action.payload,
      };
    case ClassListActionTypes.CLEAR_CLASS_LIST:
      return {
        ...state,
        classList: null,
      };
    default:
      return state;
  }
}
