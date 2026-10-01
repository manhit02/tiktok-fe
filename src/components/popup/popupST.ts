import React from "react";

let openPopup: (content: React.ReactNode) => void = () => {};
let closePopup: () => void = () => {};

export const setPopupActions = (
  open: (content: React.ReactNode) => void,
  close: () => void,
) => {
  openPopup = open;
  closePopup = close;
};

export const popupST = {
  open(content: React.ReactNode) {
    openPopup(content);
  },

  close() {
    closePopup();
  },
};