import {Link, useNavigate, useParams} from 'react-router-dom';
import {Edit, Follow, Following, Users} from '../asserts/icons';
import PostCard from '../components/post/PostCard';
import {useEffect, useState} from "react";
import {server} from "../utils/address.ts";
import {readCookies} from "../utils/cookies.ts";
import {popup} from "../utils/popup.ts";
import {Loading} from "../asserts/loading.tsx";
import {follow} from "../hooks/Interaction.ts";

const ProfilePage = () => {
    const cookies = readCookies();
    const loginUserId = cookies.id;
    let profileUserId = parseInt(useParams().id || loginUserId);
    const navigate = useNavigate();
    const [user, setUser] = useState<any>();
    const [userPosts, setPost] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [following, setFollowing] = useState<boolean>(false);

    useEffect(() => {
        const getArticle = async (articleId: number, profileUser: any, loginUser: any) => {
            try {
                let post: any = {};
                // const response = await fetch(`${server}/v1/article/${articleId}`, {
                //     method: 'GET'
                // });
                const response = await fetch(`${server}/v2/article/get/${articleId}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        requestFields: {},
                        responseFields: ["title", "content", "publishTime", "likes", "isSeries", "readTime", "cover"],
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    post.id = articleId;
                    post.title = result.title;
                    post.content = result.content;
                    post.author = profileUser;
                    post.publishTime = result.publishTime;
                    post.likes = result.likes.length;
                    post.isSeries = result.isSeries;
                    post.readTime = result.readTime;
                    post.cover = result.cover;

                    post.bookmarkState = loginUser.library.indexOf(post.id) > -1;
                    post.likedState = result.likes.indexOf(loginUserId) > -1;
                    return post;
                } else {
                    navigate("/");
                    popup(result.error);
                }
            } catch (error) {
                console.error(error);
                navigate("/");
                popup("Unable to Fetch Article Details, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.");
            }
        }

        const getProfileUser = async () => {
            let user: any = {};
            try {
                // const response = await fetch(`${server}/v1/user/${profileUserId}`, {
                //     method: 'GET'
                // });
                const response = await fetch(`${server}/v2/user/get/${profileUserId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        requestFields: {},
                        responseFields: ["username", "followers", "following", "avatar", "bio", "publications"],
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    user.id = profileUserId;
                    user.username = result.username;
                    user.followers = result.followers.length;
                    user.following = result.following.length;
                    user.avatar = result.avatar;
                    user.bio = result.bio;
                    user.publications = result.publications;

                    if (profileUserId !== loginUserId && result.followers.indexOf(loginUserId) !== -1) {
                        setFollowing(true);
                    }

                    setUser(user);
                    return user;
                } else {
                    navigate("/login");
                    popup(result.error);
                }
            } catch (error) {
                console.error(error);
                navigate("/login");
                popup("Unable to Fetch the User's Details, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.");
            }
        }

        const getLoginUser = async () => {
            let user: any = {};
            try {
                const response = await fetch(`${server}/v2/user/get/${loginUserId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        requestFields: {},
                        responseFields: ["library"],
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    user.library = result.library;
                    return user;
                } else {
                    navigate("/login");
                    popup(result.error);
                }
            } catch (error) {
                console.error(error);
                navigate("/login");
                popup("Unable to Fetch Your Details, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.");
            }
        }

        const init = async () => {
            document.title = 'Profile';
            try {
                const [profileUser, loginUser] = await Promise.all([getProfileUser(), getLoginUser()]);
                document.title = profileUserId === loginUserId? "Your Profile" : `${profileUser.username}'${profileUser.username[profileUser.username.length-1] === 's'? '' : 's'} Profile`;
                let postsPromise: any[] = [];
                for (let post of profileUser.publications) {
                    postsPromise.push(getArticle(post, profileUser, loginUser));
                }
                setPost(await Promise.all(postsPromise));
            } catch (ignore) {}  // already handled
        }

        init().then(() => { setLoading(false); });
    }, []);

    if (loading) {
        return <Loading/>;
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 mb-8">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-6">
                        <img
                            src={user.avatar}
                            alt={user.username}
                            className="w-24 h-24 rounded-full object-cover"
                        />
                        <div>
                            <h1 className="text-3xl font-bold mb-2">{user.username}</h1>
                            <p className="text-gray-600 mb-4">{user.bio}</p>
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <Users className="w-5 h-5 text-gray-500"/>
                                    <span className="text-sm text-gray-600">
                    <strong>{user.followers}</strong> followers
                        </span>
                                    <span className="text-sm text-gray-600">·</span>
                                    <span className="text-sm text-gray-600">
                        <strong>{user.following}</strong> following
                        </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        profileUserId === loginUserId ?
                            <Link
                                to="/settings"
                                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                <Edit className="w-5 h-5"/>
                                <span>Edit Profile</span>
                            </Link>
                            :
                            <button
                                onClick={async () => await follow(following, setFollowing, user, loginUserId)}
                                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                                {
                                    following
                                        ? <Following className="w-5 h-5"/>
                                        : <Follow className="w-5 h-5"/>
                                }
                                <span>{following ? "Following" : "Follow"}</span>
                            </button>
                    }
                </div>
            </div>

            <div className="space-y-8">
                <h2 className="text-2xl font-bold">Published Stories</h2>
                {userPosts.map(post => (
                    <PostCard key={post.id} post={post} userId={loginUserId} bookmarkState={post.bookmarkState}
                              likedState={post.likedState}/>
                ))}
            </div>
        </div>
    );
};

export default ProfilePage;