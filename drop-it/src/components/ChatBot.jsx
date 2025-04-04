import React, { useState, useRef, useEffect } from 'react';
import { Smile, Sticker, Send } from 'lucide-react';

const API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';
const API_KEY = 'AIzaSyAA6DXYNIuyxHKmA2bFhgSCShEsDdGR6Zo';

const emojis = ['😀', '😍', '🎉', '👍', '❤️', '😂', '🤔', '👏', '🌟', '😱'];

const stickers = [
  '/p1.png',
    '/p2.webp',
    '/p3.jpg',
    '/p5.png',
    '/p6.png'
];

const backgroundImagePositions = [
  { top: 'top-10', left: 'left-45', size: 'w-24 h-24' },
  { top: 'top-50', right: 'right-40', size: 'w-32 h-32' },
  { top: 'top-40', left: 'left-15', size: 'w-28 h-28' },
  { top: 'bottom-60', right: 'right-20', size: 'w-36 h-36' },
  { top: 'top-80', left: 'right-25', size: 'w-20 h-20' }
];

const Chatbot = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showStickerPicker, setShowStickerPicker] = useState(false);
    const chatMessagesRef = useRef(null);

    const backgroundImageUrls = [
        '/p1.png',
    '/p2.webp',
    '/p3.jpg',
    '/p5.png',
    '/p6.png'
    ];

    const generateResponse = async (prompt) => {
        const response = await fetch(`${API_URL}?key=${API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: prompt }]
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error('Failed to generate response');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    };

    const cleanMarkdown = (text) => {
        return text
            .replace(/#{1,6}\s?/g, '')
            .replace(/\\/g, '')
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    };

    const addMessage = (message, isUser, isSticker = false) => {
        setMessages((prevMessages) => [
            ...prevMessages, 
            { text: message, isUser, isSticker }
        ]);
    };

    const handleUserInput = async () => {
        if (!userInput.trim()) return;

        addMessage(userInput, true);
        setUserInput('');
        setIsLoading(true);

        try {
            const botMessage = await generateResponse(userInput);
            addMessage(cleanMarkdown(botMessage), false);
        } catch (error) {
            console.error('Error:', error);
            addMessage('Sorry, I encountered an error. Please try again.', false);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEmojiSelect = (emoji) => {
        setUserInput(prev => prev + emoji);
        setShowEmojiPicker(false);
    };

    const handleStickerSelect = (sticker) => {
        addMessage(sticker, true, true);
        setShowStickerPicker(false);
    };

    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div 
            className="relative min-h-screen flex items-center justify-center p-4 pixel-font"
            style={{ 
                backgroundImage: 'linear-gradient(#e5e5e5 1px, transparent 1px), linear-gradient(90deg, #e5e5e5 1px, transparent 1px)', 
                backgroundSize: '40px 40px' 
            }}
        >
            {/* Background Images */}
            {backgroundImageUrls.map((url, index) => (
                <img 
                    key={index} 
                    src={url} 
                    alt="Background" 
                    className={`
                        absolute opacity-30 rounded-lg 
                        ${backgroundImagePositions[index].top} 
                        ${backgroundImagePositions[index].left || backgroundImagePositions[index].right} 
                        ${backgroundImagePositions[index].size}
                    `}
                />
            ))}

            {/* Chat Container */}
            <div className="w-full max-w-4xl mx-auto flex flex-col bg-white/80 backdrop-blur-sm shadow-2xl rounded-xl overflow-hidden relative z-10">
                {/* Rest of the previous Chatbot component remains the same */}
                {/* Chat Header */}
                <div className="bg-gradient-to-r from-orange-300 to-orange-600 text-white p-4 text-center shadow-md">
                    <h1 className="text-xl font-bold tracking-wider">AI Companion</h1>
                </div>

                {/* Chat Messages */}
                <div 
                    ref={chatMessagesRef}
                    className="flex-grow overflow-y-auto p-4 space-y-4 bg-white/50"
                >
                    {messages.map((msg, index) => (
                        <div 
                            key={index} 
                            className={`flex items-start ${msg.isUser ? 'justify-end' : 'justify-start'}`}
                        >
                            {!msg.isUser && (
                                <img 
                                    src="/robo.jpg" 
                                    alt="Bot" 
                                    className="w-20 h-20 mr-2" 
                                />
                            )}
                            <div 
                                className={`
                                    max-w-[70%] px-4 py-2 rounded-2xl shadow-md
                                    ${msg.isUser 
                                        ? 'bg-orange-500 text-white' 
                                        : 'bg-orange-100 text-gray-800'
                                    }
                                    ${msg.isSticker ? 'p-0' : ''}
                                `}
                            >
                                {msg.isSticker ? (
                                    <img 
                                        src={msg.text} 
                                        alt="Sticker" 
                                        className="w-32 h-32 object-cover rounded-2xl" 
                                    />
                                ) : (
                                    msg.text
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div className="bg-white/80 backdrop-blur-sm p-4 border-t border-orange-200 flex items-center space-x-2 shadow-inner">
                    {/* Emoji Picker */}
                    <div className="relative">
                        <button 
                            onClick={() => {
                                setShowEmojiPicker(!showEmojiPicker);
                                setShowStickerPicker(false);
                            }}
                            className="p-2 rounded-full hover:bg-orange-100"
                        >
                            <Smile className="text-orange-600" />
                        </button>
                        {showEmojiPicker && (
                            <div className="absolute bottom-full left-0 bg-white shadow-lg rounded-lg p-2 flex space-x-1 border border-orange-200">
                                {emojis.map((emoji, index) => (
                                    <button 
                                        key={index} 
                                        onClick={() => handleEmojiSelect(emoji)}
                                        className="text-2xl hover:bg-orange-100 rounded"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                   {/* Sticker Picker */}
<div className="relative">
    <button 
        onClick={() => {
            setShowStickerPicker(!showStickerPicker);
            setShowEmojiPicker(false);
        }}
        className="p-2 rounded-full hover:bg-orange-100"
    >
        <Sticker className="text-orange-600" />
    </button>
   
    {showStickerPicker && (
        <div className="absolute bottom-full left-0 bg-white shadow-lg rounded-lg p-2 flex flex-col space-y-2 border border-orange-200">
            {/* Surprise Sticker Text */}
            <h6 className="text-orange-600 font-bold text-center">Surprise Sticker! </h6>

            <div className="flex space-x-1">
                {stickers.map((sticker, index) => (
                    <button 
                        key={index} 
                        onClick={() => handleStickerSelect(sticker)}
                        className="hover:bg-orange-100 rounded"
                    >
                        <img 
                            src={sticker} 
                            alt={`Sticker ${index + 1}`} 
                            className="w-20 h-20 object-contain rounded" 
                        />
                    </button>
                ))}
            </div>
        </div>
    )}
</div>


                    {/* Text Input */}
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleUserInput();
                            }
                        }}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className="flex-grow p-2 border border-orange-200 rounded-full px-4 
                                   focus:outline-none focus:ring-2 focus:ring-orange-500
                                   bg-white/70 text-gray-800"
                    />

                    {/* Send Button */}
                    <button 
                        onClick={handleUserInput} 
                        disabled={isLoading}
                        className="bg-orange-500 text-white p-2 rounded-full 
                                   hover:bg-orange-600 disabled:opacity-50 
                                   transition-colors duration-300 ease-in-out"
                    >
                        <Send className="w-6 h-6" />
                    </button>
                        
                   
                </div>
            </div>
        </div>
    );
};

export default Chatbot;