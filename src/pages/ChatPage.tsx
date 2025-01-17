import {useState} from 'react';
import {Search, User, Users} from '../asserts/icons';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';
import type {Chat} from '../types';

const ChatPage = () => {
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const [chatType, setChatType] = useState<'private' | 'group'>('private');

    // Mock data - in a real app, this would come from an API
    const chats: Chat[] = [];

    return (
        <div className="flex h-screen -m-8">
            <div className="w-80 border-r border-gray-200 bg-white">
                <div className="p-4">
                    <div className="flex space-x-2 mb-4">
                        <button
                            onClick={() => setChatType('private')}
                            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                                chatType === 'private'
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <User className="w-4 h-4"/>
                            <span>Private</span>
                        </button>

                        <button
                            onClick={() => setChatType('group')}
                            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center space-x-2 ${
                                chatType === 'group'
                                    ? 'bg-gray-900 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                        >
                            <Users className="w-4 h-4"/>
                            <span>Groups</span>
                        </button>
                    </div>

                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-gray-500 focus:border-gray-500"
                        />
                        <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5"/>
                    </div>

                    <ChatList
                        chats={chats.filter((chat) => (chat.members.length === 2) === (chatType === 'group'))}
                        activeChat={activeChat}
                        onSelectChat={setActiveChat}
                    />
                </div>
            </div>

            <div className="flex-1 bg-gray-50">
                {activeChat ? (
                    <ChatWindow chat={activeChat}/>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        Select a conversation to start chatting
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;