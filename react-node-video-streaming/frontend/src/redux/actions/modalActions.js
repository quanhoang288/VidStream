export const modalActionTypes = {
  SHOW_MODAL: 'show',
  HIDE_MODAL: 'hide',
};

const showModal = () => ({
  type: modalActionTypes.SHOW_MODAL,
});

const hideModal = () => ({
  type: modalActionTypes.HIDE_MODAL,
});

export { hideModal, showModal };
