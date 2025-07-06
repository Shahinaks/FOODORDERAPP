import React, { useEffect } from 'react';
import { FaCommentDots } from 'react-icons/fa';

const FloatingChatIcon = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://embed.tawk.to/6864291f16d5a819113f43f4/1iv3k19br';
    script.async = true;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.body.appendChild(script);

    const interval = setInterval(() => {
      if (window.Tawk_API?.hideWidget) {
        window.Tawk_API.hideWidget();
        clearInterval(interval);
      }
    }, 500);
  }, []);

  const handleClick = () => {
    if (window.Tawk_API?.toggle) {
      window.Tawk_API.toggle(); 
    } else if (window.Tawk_API?.showWidget) {
      window.Tawk_API.showWidget(); 
    }
  };

  return (
    <div
      onClick={handleClick}
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        backgroundColor: '#007bff',
        color: 'white',
        borderRadius: '50%',
        width: '60px',
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        zIndex: 9999,
      }}
    >
      <FaCommentDots size={28} />
    </div>
  );
};

export default FloatingChatIcon;
