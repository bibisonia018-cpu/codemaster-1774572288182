import { useState } from 'react';
import io from 'socket.io-client';
import Chat from './components/Chat';
import JoinRoom from './components/JoinRoom';

// في بيئة التطوير، يتصل بخادم Node المحلي. في الإنتاج، قم بوضع رابط الخادم الخاص بك.
const socket = io(import.meta.env.VITE_SERVER_URL || 'http://localhost:3001');

function App() {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [showChat, setShowChat] = useState(false);

  const joinRoom = (user, roomName, key) => {
    if (user !== '' && roomName !== '' && key !== '') {
      setUsername(user);
      setRoom(roomName);
      setSecretKey(key);
      socket.emit('join_room', roomName);
      setShowChat(true);
    }
  };

  const leaveRoom = () => {
    socket.emit('leave_room', room);
    setShowChat(false);
    setRoom('');
    setSecretKey('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {!showChat ? (
        <JoinRoom onJoin={joinRoom} />
      ) : (
        <Chat 
          socket={socket} 
          username={username} 
          room={room} 
          secretKey={secretKey} 
          onLeave={leaveRoom}
        />
      )}
    </div>
  );
}

export default App;