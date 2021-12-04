import { modalActionTypes } from '../actions/modalActions';

const initialState = {
  isModalVisible: false,
};

const modalReducer = (state = initialState, action) => {
  switch (action.type) {
    case modalActionTypes.SHOW_MODAL:
      return {
        isModalVisible: true,
      };

    case modalActionTypes.HIDE_MODAL:
      return {
        isModalVisible: false,
      };

    default:
      return state;
  }
};

export default modalReducer;
