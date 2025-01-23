import {Plus} from "../../asserts/icons.tsx";
import {useState} from "react";
import {Loading} from "../../asserts/loading.tsx";

interface ChatListProps {
    chats: any[];
    activeChat: any | null;
    onSelectChat: (chat: any) => void;
    newChat: () => Promise<void>;
}

const ChatList = ({ chats, activeChat, onSelectChat, newChat}: ChatListProps) => {
    const [creatingChat, setCreatingChat] = useState<boolean>(false);

    return (
        <div className="space-y-2">
            <button
                key="new"
                onClick={async () => {
                    setCreatingChat(true);
                    await newChat();
                    setCreatingChat(false);
                }}
                disabled={creatingChat}
                className={`w-full p-3 rounded-lg flex items-center space-x-3 hover:bg-gray-50 border disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500`}
            >
                {
                    creatingChat ?
                        <div className="flex flex-row items-center space-x-2">
                            <Loading message="" scale={0.3} color="#444" />
                            <p className="text-nowrap">Creating New Chat</p>
                        </div>
                        :
                        <div className="flex flex-row items-center space-x-2">
                            <Plus className="w-8 h-8 rounded-full object-cover" />
                            <p className="text-nowrap">New Chat</p>
                        </div>
                }
            </button>
            {chats.map((chat) => {
                return (
                    <button
                        key={chat.id}
                        onClick={() => onSelectChat(chat)}
                        className={`w-full p-3 rounded-lg flex items-center space-x-3 hover:bg-gray-50 ${
                            activeChat?.id === chat.id ? 'bg-gray-50' : ''
                        }`}
                    >
                        <img
                            src={chat.avatar}
                            alt={chat.groupName}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1 text-left">
                            <h3 className="font-medium">{chat.groupName}</h3>
                            {chat.lastMessage && (
                                <p className="text-sm text-gray-500 truncate overflow-hidden">
                                    { chat.lastMessage.body.length <= 20?
                                        chat.lastMessage.body:
                                        `${chat.lastMessage.body.slice(0, 20)}...`
                                    }
                                </p>
                            )}
                        </div>
                    </button>
                );
            })}
        </div>
    );
};

export default ChatList;
