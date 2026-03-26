"use client";
import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import { Send, Search, UserCircle, MoreVertical, MessageSquare } from 'lucide-react';
import api from '../../utils/api';

export default function MessagesPage() {
  const [user, setUser] = useState(null);
  const [connections, setConnections] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    let newSocket;
    const initData = async () => {
      try {
        const uRes = await api.get('/auth/me');
        setUser(uRes.data);
        
        // Connect socket
        const backendUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:8000';
        newSocket = io(backendUrl);
        setSocket(newSocket);
        
        newSocket.emit('join', uRes.data._id);
        
        // Listen for messages
        newSocket.on('message', (msg) => {
          setMessages(prev => [...prev, msg]);
        });
        newSocket.on('messageSent', (msg) => {
          setMessages(prev => [...prev, msg]);
        });
        
        // Fetch connections
        const fullUser = await api.get(`/users/${uRes.data._id}`);
        setConnections(fullUser.data.connections || []);
      } catch (err) {
        console.error('Failed to init messages:', err);
      }
    };
    initData();
    
    return () => {
      if (newSocket) newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (selectedUser && user) {
      // fetch history
      api.get(`/messages/${selectedUser._id}`).then(res => {
        setMessages(res.data);
      });
    }
  }, [selectedUser, user]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputVal.trim() || !selectedUser || !socket) return;
    
    socket.emit('sendMessage', {
      senderId: user._id,
      receiverId: selectedUser._id,
      content: inputVal
    });
    
    setInputVal('');
  };

  const getFilteredMessages = () => {
    if (!selectedUser) return [];
    return messages.filter(m => 
      (m.senderId === user?._id && m.receiverId === selectedUser._id) ||
      (m.senderId === selectedUser._id && m.receiverId === user?._id)
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 h-[80vh] flex overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-slate-100 flex flex-col bg-slate-50">
        <div className="p-4 border-b border-slate-100">
          <h2 className="font-bold font-heading text-lg text-slate-900 mb-4">Messaging</h2>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search messages" 
              className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {connections.map(conn => (
            <div 
              key={conn._id} 
              onClick={() => setSelectedUser(conn)}
              className={`flex items-center gap-3 p-4 cursor-pointer transition-colors border-b border-slate-100 last:border-0 ${selectedUser?._id === conn._id ? 'bg-emerald-50 border-emerald-100' : 'hover:bg-white'}`}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden bg-emerald-100 flex-shrink-0 flex items-center justify-center">
                {conn.profileImage ? (
                  <img src={conn.profileImage} alt={conn.name} className="w-full h-full object-cover" />
                ) : (
                  <UserCircle className="w-8 h-8 text-emerald-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold text-slate-900 truncate">{conn.name}</h3>
                </div>
                <p className="text-xs text-slate-500 truncate capitalize">{conn.role}</p>
              </div>
            </div>
          ))}
          {connections.length === 0 && (
            <div className="p-6 text-center text-slate-500 text-sm">
              Connect with others to start messaging.
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-white z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-emerald-100 flex items-center justify-center">
                  {selectedUser.profileImage ? (
                    <img src={selectedUser.profileImage} alt={selectedUser.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserCircle className="w-6 h-6 text-emerald-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{selectedUser.name}</h3>
                  <p className="text-xs text-emerald-600">Active now</p>
                </div>
              </div>
              <button className="text-slate-400 hover:text-slate-600">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            {/* Messages body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
              {getFilteredMessages().map((msg, idx) => {
                const isMine = msg.senderId === user?._id;
                return (
                  <div key={idx} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl p-3 ${
                        isMine 
                        ? 'bg-emerald-600 text-white rounded-tr-sm' 
                        : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm shadow-sm'
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Input area */}
            <div className="p-4 bg-white border-t border-slate-100">
              <form onSubmit={handleSend} className="flex gap-2">
                <input 
                  type="text" 
                  value={inputVal}
                  onChange={e => setInputVal(e.target.value)}
                  placeholder="Write a message..." 
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-full px-4 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <button 
                  type="submit"
                  disabled={!inputVal.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-full transition-colors disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
            <MessageSquare className="w-16 h-16 mb-4 text-slate-200" />
            <p className="text-lg font-medium text-slate-500">Select a conversation to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
}
