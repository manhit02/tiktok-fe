"use client";

import { useEffect, useState } from "react";
import Popup from "./PopupUi";
import { setPopupActions } from "./popupST";

export default function PopupProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [content, setContent] = useState<React.ReactNode>(null);
  useEffect(() => {
    document.body.style.overflow = content ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [content]);
  const open = (content: React.ReactNode) => {
    setContent(content);
  };

  const close = () => {
    setContent(null);
  };

  setPopupActions(open, close);

  return (
    <>
      {children}

      {content && <Popup onClose={close}>{content}</Popup>}
    </>
  );
}
