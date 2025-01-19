import type { Chat } from '../../types';

interface ChatListProps {
    chats: Chat[];
    activeChat: Chat | null;
    onSelectChat: (chat: Chat) => void;
}

const ChatList = ({ chats, activeChat, onSelectChat }: ChatListProps) => {
    return (
        <div className="space-y-2">
            {chats.map((chat) => {
                const participant = chat.members[0];
                const lastMessage = chat.messages[chat.messages.length - 1];

                return (
                    <button
                        key={chat.id}
                        onClick={() => onSelectChat(chat)}
                        className={`w-full p-3 rounded-lg flex items-center space-x-3 hover:bg-gray-50 ${
                            activeChat?.id === chat.id ? 'bg-gray-50' : ''
                        }`}
                    >
                        <img
                            src={participant.avatar}
                            alt={participant.username}
                            className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1 text-left">
                            <h3 className="font-medium">{participant.username}</h3>
                            {lastMessage && (
                                <p className="text-sm text-gray-500 truncate">
                                    {lastMessage.content}
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