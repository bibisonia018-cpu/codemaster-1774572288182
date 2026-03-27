import { useState, useEffect, useRef } from 'react';
import { Send, LogOut, Lock } from 'lucide-react';
import { encryptMessage, decryptMessage } from '../utils/encryption';

const Chat = ({ socket, username, room, secretKey, onLeave }) => {
  const [currentMessage, setCurrentMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const messagesEndRef = useRef(null);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (currentMessage !== '') {
      // تشفير الرسالة قبل الإرسال
      const encryptedText = encryptMessage(currentMessage, secretKey);
      
      const messageData = {
        room: room,
        author: username,
        message: encryptedText, // إرسال النص المشفر فقط للخادم
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };

      await socket.emit('send_message', messageData);
      
      // حفظ الرسالة في الواجهة المحلية كنص واضح
      setMessageList((list) => [...list, { ...messageData, message: currentMessage }]);
      setCurrentMessage('');
    }
  };

  useEffect(() => {
    const receiveMessageHandler = (data) => {
      // فك التشفير عند الاستلام
      const decryptedText = decryptMessage(data.message, secretKey);
      
      setMessageList((list) => [...list, { ...data, message: decryptedText }]);
    };

    socket.on('receive_message', receiveMessageHandler);

    return () => {
      socket.off('receive_message', receiveMessageHandler);
    };
  }, [socket, secretKey]);

  // التمرير التلقائي للأسفل
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messageList]);

  return (
    <div className="w-full max-w-2xl bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 flex flex-col h-[80vh]">
      {/* Header */}
      <div className="p-4 bg-gray-900 rounded-t-2xl border-b border-gray-700 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Lock className="text-green-500 w-5 h-5" />
          <h2 className="text-lg font-bold">غرفة: {room}</h2>
        </div>
        <button onClick={onLeave} className="text-red-400 hover:text-red-500 flex items-center gap-1 transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="text-sm">خروج</span>
        </button>
      </div>

      {/* Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="text-center text-xs text-gray-500 mb-4 bg-gray-900/50 py-2 rounded-lg">
          تم تأمين هذه الدردشة بتشفير AES-256 من طرف إلى طرف.
        </div>
        
        {messageList.map((messageContent, index) => {
          const isMe = username === messageContent.author;
          return (
            <div key={index} className={`flex flex-col ${isMe ? 'items-start' : 'items-end'}`}>
              <div className={`max-w-[70%] rounded-xl p-3 ${
                isMe ? 'bg-green-600 text-white rounded-tr-none' : 'bg-gray-700 text-white rounded-tl-none'
              }`}>
                <p className="text-sm break-words">{messageContent.message}</p>
              </div>
              <div className="flex gap-2 text-xs text-gray-400 mt-1">
                <span>{messageContent.time}</span>
                <span>•</span>
                <span>{messageContent.author}</span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer */}
      <form onSubmit={sendMessage} className="p-4 bg-gray-900 rounded-b-2xl border-t border-gray-700 flex gap-2">
        <input
          type="text"
          value={currentMessage}
          placeholder="اكتب رسالتك السرية هنا..."
          onChange={(e) => setCurrentMessage(e.target.value)}
          className="flex-1 bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-green-500"
        />
        <button
          type="submit"
          disabled={!currentMessage}
          className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg px-4 py-3 transition-colors flex justify-center items-center"
        >
          <Send className="w-5 h-5 rtl:rotate-180" />
        </button>
      </form>
    </div>
  );
};

export default Chat;