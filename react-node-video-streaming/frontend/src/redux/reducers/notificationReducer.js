import { NOTIFICATION_ACTION_TYPES } from '../actions/notficationActions';

const initialState = {
  notifications: [],
};

const notificationReducer = (state = initialState, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTION_TYPES.saveList:
      return {
        ...state,
        notifications: action.payload,
      };

    case NOTIFICATION_ACTION_TYPES.markUnread:
      return {
        ...state,
        notifications: state.notifications.map((notification) =>
          notification.readAt !== undefined
            ? notification
            : {
                ...notification,
                readAt: new Date(),
              },
        ),
      };

    case NOTIFICATION_ACTION_TYPES.updateList:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
      };

    default:
      return state;
  }
};

export default notificationReducer;
