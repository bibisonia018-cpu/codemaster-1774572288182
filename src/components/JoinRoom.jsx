import { useState } from 'react';
import { Shield, Key, Users, UserCircle } from 'lucide-react';

const JoinRoom = ({ onJoin }) => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const handleJoin = (e) => {
    e.preventDefault();
    onJoin(username, room, secretKey);
  };

  return (
    <div className="w-full max-w-md bg-gray-800 p-8 rounded-2xl shadow-2xl border border-gray-700">
      <div className="text-center mb-8">
        <Shield className="w-16 h-16 mx-auto text-green-500 mb-4" />
        <h1 className="text-3xl font-bold text-white">الدردشة السرية</h1>
        <p className="text-gray-400 mt-2 text-sm">مشفرة من طرف إلى طرف (E2EE)</p>
      </div>

      <form onSubmit={handleJoin} className="space-y-4">
        <div className="relative">
          <UserCircle className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="الاسم المستعار"
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg py-3 pr-10 pl-4 focus:outline-none focus:border-green-500 transition-colors"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="relative">
          <Users className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="معرف الغرفة (مثال: Room99)"
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg py-3 pr-10 pl-4 focus:outline-none focus:border-green-500 transition-colors"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            required
          />
        </div>

        <div className="relative">
          <Key className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
          <input
            type="password"
            placeholder="المفتاح السري (لفك التشفير)"
            className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg py-3 pr-10 pl-4 focus:outline-none focus:border-green-500 transition-colors"
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
            required
          />
        </div>
        
        <p className="text-xs text-yellow-500 text-center">
          ⚠️ تأكد من مشاركة المفتاح السري مع الطرف الآخر فقط. الخادم لا يخزن هذه البيانات.
        </p>

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors flex justify-center items-center gap-2"
        >
          دخول الغرفة الآمنة
        </button>
      </form>
    </div>
  );
};

export default JoinRoom;