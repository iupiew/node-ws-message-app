import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { useQuery } from '@tanstack/react-query';
import useWebSocket from './hooks/useWebSocket';
import { fetchMessages } from './api';

const App = () => {
// WebSocket connection
  const { messages: messagesFromWebSocket, sendMessage } = useWebSocket('ws://localhost:8080');
// Fetch messages from the server
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  //const { data: messages } = useQuery(['messages'], fetchMessages);
  const { data } = useQuery({
    queryKey: ['messages'],
    fetchMessages,
  });

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (newMessage.trim()) {
      sendMessage(newMessage);
      setNewMessage(''); // Clear input field after sending
    }
  };

  return (
    <>
     <div>
      <h3>Messages app</h3>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
       <button onClick={handleSendMessage}>Send</button>
      <ul>
        {messagesFromWebSocket.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
    </>
  )
}

export default App
