import { useState } from 'react';
import { Send } from '../../asserts/icons';
import {server} from "../../utils/address.ts";
import {popup} from "../../utils/popup.ts";
import {readCookies} from "../../utils/cookies.ts";
import {Loading} from "../../asserts/loading.tsx";


const ChatWindow = ({ chat }: { chat: any }) => {
    const [message, setMessage] = useState<string>('');
    const cookie = readCookies();
    const uid = cookie.id;
    const [sending, setSending] = useState<boolean>(false);

    const handleSend = async () => {
        if (message.trim()) {
            setSending(true);
            try {
                const response = await fetch(`${server}/v2/chat/messageSend/${chat.id}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        requestFields: {
                            id: uid,
                            body: message,
                        },
                        responseFields: [],
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    const message: any = {};
                    message.id = result.id;
                    message.body = result.body;
                    message.sender = result.sender;
                    message.sendTime = result.sendTime;

                    chat.messages.push(message);
                    chat.lastMessage = message;
                    setMessage('');
                } else {
                    popup(result.error);
                }
            } catch (error) {
                console.error(error);
                popup("Unable to Create a New Chat, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.");
            } finally {
                setSending(false);
            }
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="border-b border-gray-200 bg-white p-4">
                <div className="flex items-center space-x-3">
                    <img
                        src={chat.avatar}
                        alt={chat.groupName}
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <h2 className="font-medium">{chat.groupName}</h2>
                        <p className="text-sm text-gray-500">
                            {chat.members.length > 2 ? 'Group Chat' : 'Private Chat'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {chat.messages.map((msg: any) => (
                    <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender === uid ? 'justify-end' : 'justify-start'
                        }`}
                    >
                        <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                                msg.sender === uid
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-white border border-gray-200'
                            }`}
                        >
                            <p>{msg.body}</p>
                            <span className="text-xs text-gray-400 mt-1 block">
                                {msg.sendTime.toString()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t border-gray-200 bg-white p-4">
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="flex-1 rounded-lg border-gray-300 focus:ring-gray-500 focus:border-gray-500 p-2"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSend().then();
                            }
                        }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!message.trim() || sending}
                        className="p-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                        { sending?
                            <Loading scale={0.2} color="#fff" message=""/> :
                            <Send className="w-5 h-5"/>
                        }
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatWindow;