import {NavLink} from 'react-router-dom';
import {Home, Library, PenSquare, MessageCircle, User, Settings, OAText, Logout} from "../../asserts/icons"
import {clearCookies, readCookies} from "../../utils/cookies.ts";
import {server} from "../../utils/address.ts";

const Sidebar = () => {
    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Library, label: 'Library', path: '/library' },
        { icon: PenSquare, label: 'Write', path: '/write' },
        { icon: MessageCircle, label: 'Chat', path: '/chat' },
        { icon: User, label: 'Profile', path: '/profile' },
        { icon: Settings, label: 'Settings', path: '/settings' },
    ];

    async function logout() {
        const cookies = readCookies();
        const id = cookies.id;
        try {
            clearCookies();
            const res = await fetch(`${server}/v2/auth/logout/${id}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    requestFields: {
                        session: 0, // STUB!!
                    },
                    responseFields: [],
                })
            });

            if (res.ok) {
                console.log("Logout successful");
            } else {
                console.error((await res.json()).error);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="fixed left-0 h-screen w-64 bg-white border-r border-gray-200 p-4">
            <div className="flex flex-col space-y-6">
                <div className="flex flex-row items-center space-x-2 pl-4 pt-4">
                    <OAText className="w-8 h-8"/>
                    <h1 className="text-2xl font-bold text-gray-800">OAText</h1>
                </div>
                <nav className="flex flex-col space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({isActive}) =>
                                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive
                                        ? 'bg-gray-100 text-gray-900'
                                        : 'text-gray-600 hover:bg-gray-50'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5"/>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <nav
                    onClick={async () => logout()}
                    className="flex flex-col space-y-2 absolute bottom-4"
                >
                    <NavLink
                        key="login"
                        to="login"
                        className={({isActive}) =>
                            `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                                isActive
                                    ? 'bg-gray-100 text-gray-900'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`
                        }
                    >
                        <Logout className="w-5 h-5 text-red-500"/>
                        <span className="text-red-500">Logout</span>
                    </NavLink>
                </nav>
            </div>
        </div>
    );
};

export default Sidebar;