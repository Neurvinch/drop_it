import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

// Connect to the backend Socket.IO server
const socket = io('http://localhost:5000', {
  withCredentials: true,
});

const ChatRoom = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isUsernameSet, setIsUsernameSet] = useState(false);

  // Set up Socket.IO listeners when the component mounts
  useEffect(() => {
    // Load initial messages from the server
    socket.on('initMessages', (initialMessages) => {
      setMessages(initialMessages);
    });

    // Listen for new messages from the server
    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Handle connection errors
    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err);
      setError('Failed to connect to the chat server');
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off('initMessages');
      socket.off('message');
      socket.off('connect_error');
    };
  }, []);

  const handleUsernameSubmit = (e) => {
    e.preventDefault();
    const enteredUsername = e.target.username.value.trim();
    if (enteredUsername) {
      setUsername(enteredUsername || 'Anonymous');
      setIsUsernameSet(true);
    }
  };

  const sendMessage = async () => {
    if (input.trim() && username) {
      setLoading(true);
      setError('');

      const newMessage = {
        text: input,
        user: username,
      };

      try {
        // Emit the message to the server
        socket.emit('sendMessage', newMessage);
        setInput('');
      } catch (error) {
        console.error('Error sending message:', error);
        setError('Message send failed!');
      }

      setLoading(false);
    }
  };

  const backgroundImages = [
    { src: '/p1.png', top: 'top-10', left: 'left-5' },
    { src: '/p2.webp', top: 'top-1/4', right: 'right-10' },
    { src: '/p3.jpg', bottom: 'bottom-20', left: 'left-1/3' },
    { src: '/p5.png', top: 'top-1/2', right: 'right-1/4' },
    { src: '/p6.png', bottom: 'bottom-10', right: 'right-1/3' },
  ];

  // Username Entry Page
  if (!isUsernameSet) {
    return (
      <div className="relative min-h-screen bg-black flex items-center justify-center overflow-hidden">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={`absolute ${image.top || ''} ${image.bottom || ''} ${image.left || ''} ${image.right || ''} opacity-20 z-0`}
          >
            <img
              src={image.src}
              alt={`Background image ${index + 1}`}
              className="rounded-2xl shadow-lg transform rotate-6 hover:rotate-0 transition-all duration-300 w-30 h-30"
            />
          </div>
        ))}

        <div className="relative z-10 w-full max-w-md bg-black border-4 border-white rounded-2xl p-8 shadow-2xl">
          <h2 className="text-3xl font-bold text-white text-center mb-6 pixel-font">
            Enter Your Username
          </h2>
          <form onSubmit={handleUsernameSubmit} className="space-y-4">
            <input
              type="text"
              name="username"
              placeholder="Choose a username"
              required
              className="w-full p-3 bg-black border-2 border-white text-white rounded-lg pixel-font placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-black text-sm font-bold py-3 rounded-lg hover:bg-gray-200 pixel-font transition-colors duration-300"
            >
              Join Chat
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Chat Room View
  return (
    <div className="relative min-h-screen bg-gray-100 overflow-hidden">
      {/* Grid Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="grid grid-cols-12 grid-rows-12 h-full w-full opacity-10">
          {[...Array(144)].map((_, index) => (
            <div
              key={index}
              className="border border-gray-300 dark:border-gray-700"
            ></div>
          ))}
        </div>
      </div>

      {/* Background Images */}
      {backgroundImages.map((image, index) => (
        <div
          key={index}
          className={`absolute ${image.top || ''} ${image.bottom || ''} ${image.left || ''} ${image.right || ''} opacity-20 z-0`}
        >
          <img
            src={image.src}
            alt={`Background image ${index + 1}`}
            className="rounded-2xl shadow-lg transform rotate-6 hover:rotate-0 transition-all duration-300 w-30 h-30"
          />
        </div>
      ))}

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-2xl relative">
          <div className="bg-black rounded-2xl shadow-2xl border-4 border-white p-8 relative">
            <div className="absolute inset-0 border-4 border-white opacity-50 pointer-events-none"></div>

            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white pixel-font tracking-wider">
                Just_meet Chat
              </h1>
            </div>

            {/* Chat Messages Container */}
            <div className="h-[400px] overflow-y-auto bg-black border-2 border-white rounded-lg mb-4 p-4 space-y-2">
              {messages.length === 0 ? (
                <p className="text-gray-400 text-center pixel-font">
                  No messages yet. Start chatting!
                </p>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className="bg-gray-800 p-3 rounded-lg text-left border border-white"
                  >
                    <strong className="text-green-500 mr-2 pixel-font">{msg.user}:</strong>
                    <span className="text-white pixel-font">{msg.text}</span>
                  </div>
                ))
              )}
            </div>

            {/* Message Input Area */}
            <div className="space-y-4">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Type a message..."
                className="w-full p-3 bg-black border-2 border-white text-white rounded-lg pixel-font placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
              />

              <button
                onClick={sendMessage}
                disabled={loading}
                className="w-full bg-green-500 text-black text-sm font-bold py-3 rounded-lg hover:bg-gray-200 pixel-font transition-colors duration-300"
              >
                {loading ? 'Sending...' : 'Send Message'}
              </button>

              {error && (
                <p className="text-red-500 text-center pixel-font mt-2">{error}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;