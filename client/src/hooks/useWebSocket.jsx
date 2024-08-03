import { useEffect, useRef, useState } from 'react';

const useWebSocket = (url) => {
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(url);

    ws.current.onmessage = (event) => {
      setMessages(prevMessages => [event.data, ...prevMessages]);
    };

    ws.current.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.current.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.current.close();
    };
  }, [url]);

  const sendMessage = (message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    }
  };

  return { messages, sendMessage };
};

export default useWebSocket;
