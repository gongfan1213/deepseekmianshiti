import { useState, useEffect } from 'react';

const PopupModal = () => {
  const STORAGE_KEY = 'popupClosedTime';
  const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000; // 7天的毫秒数

  const [isOpen, setIsOpen] = useState(false);

  // 组件加载时检查存储状态
  useEffect(() => {
    const closedTime = localStorage.getItem(STORAGE_KEY);
    const now = Date.now();

    if (!closedTime || (now - parseInt(closedTime)) > SEVEN_DAYS_MS) {
      setIsOpen(true);
    }
  }, []);

  // 处理关闭弹窗
  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(STORAGE_KEY, Date.now().toString());
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>欢迎访问！</h2>
        <p>这里是您的专属优惠内容...</p>
        <button 
          className="close-button"
          onClick={handleClose}
        >
          关闭
        </button>
      </div>
    </div>
  );
};

// CSS 样式（推荐使用 styled-components 或 CSS Modules）
const styles = `
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal-content {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    max-width: 500px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .close-button {
    margin-top: 1rem;
    padding: 8px 16px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
`;

// 注入样式
document.head.insertAdjacentHTML('beforeend', `<style>${styles}</style>`);

export default PopupModal;
