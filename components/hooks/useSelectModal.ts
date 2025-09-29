import { useState } from "react";

// 选择器 Modal 的通用 hook
export const useSelectModal = () => {
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  return {
    visible,
    showModal,
    hideModal,
  };
};
