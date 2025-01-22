import {useEffect, useState} from 'react';
import {Search, User, Users} from '../asserts/icons';
import ChatList from '../components/chat/ChatList';
import ChatWindow from '../components/chat/ChatWindow';
import {readCookies} from "../utils/cookies.ts";
import {useNavigate} from "react-router-dom";
import {server} from "../utils/address.ts";
import {popup} from "../utils/popup.ts";
import {Loading} from "../asserts/loading.tsx";

/**
 * @TODO
 * 1. Order all chats in the order of (lastMessage.sendTime || chat.createTime)
 * 2. Invite other user(s) to join the chat
 * 3. Sync the last message on the ChatList when a user sent a new message
 * 4. Monitoring new messages from other users
 */

const ChatPage = () => {
    document.title = 'Chat';
    const [activeChat, setActiveChat] = useState<any | null>(null);
    const [chatType, setChatType] = useState<'private' | 'group'>('private');

    const cookies = readCookies();
    const id = cookies.id;
    const navigate = useNavigate();
    const [chats, setChats] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [loadingChat, setLoadingChat] = useState<boolean>(false);

    async function getMessages(id: number) {
        try {
            let message: any = {};
            const response = await fetch(`${server}/v2/chat/messageGet/${id}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requestFields: {},
                    responseFields: [],
                })
            });

            const result = await response.json();

            if (response.ok) {
                message.id = result.id;
                message.sender = result.sender;
                message.sendTime = result.sendTime;
                message.body = result.body;
                return message;
            } else {
                popup(result.error);
            }
        } catch (error) {
            console.error(error);
            popup("Unable to Fetch Chat Details, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.");
        }
    }

    async function onSelect(chat: any) {
        setLoadingChat(true);
        setActiveChat(null);
        const messagesPromise = [];
        for (let message of chat.messages) {
            messagesPromise.push(message.id === undefined ?
                getMessages(message) :
                (async () => {return message;})());  // The message object has already being fetched
        }
        chat.messages = await Promise.all(messagesPromise);
        setActiveChat(chat);
        setLoadingChat(false);
    }
    async function newChat() {
        const members = [id];
        // select and push other participants
        try {
            const response = await fetch(`${server}/v2/chat/new/-1`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requestFields: {
                        groupName: "New Chat",
                        members: members,
                    },
                    responseFields: [],
                })
            });

            const result = await response.json();

            if (response.ok) {
                const chat: any = {};
                chat.id = result.id;
                chat.messages = result.messages;
                chat.members = result.members;
                chat.groupName = result.groupName;
                chat.avatar = result.avatar;
                chat.lastMessage = null;

                setChats(chats.concat(chat));
            } else {
                popup(result.error);
            }
        } catch (error) {
            console.error(error);
            popup("Unable to Create a New Chat, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.");
        }
    }

    const getChat = async (chatId: number) => {
        try {
            let chat: any = {};
            const response = await fetch(`${server}/v2/chat/get/${chatId}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requestFields: {},
                    responseFields: [],
                })
            });

            const result = await response.json();

            if (response.ok) {
                chat.id = result.id;
                chat.messages = result.messages;
                chat.members = result.members;
                chat.groupName = result.groupName;
                chat.avatar = result.avatar;

                chat.lastMessage = result.messages.length > 0? await getMessages(result.messages[result.messages.length - 1]) : null;
                return chat;
            } else {
                popup(result.error);
            }
        } catch (error) {
            console.error(error);
            popup("Unable to Fetch Chat List, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.");
        }
    }

    useEffect(() => {

        const getUser = async () => {
            let user: any = {};
            try {
                const response = await fetch(`${server}/v2/user/get/${id}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        requestFields: {},
                        responseFields: ["activeChats"],
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    user.activeChats = result.activeChats;
                    return user;
                } else {
                    popup(result.error);
                }
            } catch (error) {
                console.error(error);
                navigate("/login");
                popup("Unable to Fetch Your Details, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.");
            }
        }

        const init = async () => {
            try {
                const user = await getUser();
                let chatsPromise: any[] = [];
                for (let chat of user.activeChats) {
                    chatsPromise.push(getChat(chat));
                }
                setChats(await Promise.all(chatsPromise));
            } catch (ignore) {}  // already handled
        }

        init().then(() => { setLoading(false); });
    }, []);

    if (loading) {
        return <Loading />;
    }

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
                        onSelectChat={onSelect}
                        newChat={newChat}
                    />
                </div>
            </div>

            <div className="flex-1 bg-gray-50">
                { activeChat ?
                    <ChatWindow chat={activeChat} />
                    :
                    loadingChat ?
                        <Loading /> :
                        <div className="h-full flex items-center justify-center text-gray-500">
                            Select a conversation to start chatting
                        </div>
                }
            </div>
        </div>
    );
};

export default ChatPage;