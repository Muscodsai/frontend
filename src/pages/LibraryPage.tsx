import {useEffect, useState} from 'react';
import PostCard from '../components/post/PostCard';
import {BookOpen, Layers} from '../asserts/icons';
import {readCookies} from "../utils/cookies.ts";
import {server} from "../utils/address.ts";
import {popup} from "../utils/popup.ts";
import {Loading} from "../asserts/loading.tsx";
import {useNavigate} from "react-router-dom";

const LibraryPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'series' | 'single'>('single');
    const cookies = readCookies();
    const id = cookies.id;
    const [loading, setLoading] = useState<boolean>(true);
    const [articles, setArticles] = useState<any[]>([]);
    const [series, setSeries] = useState<any[]>([]);
    let library: any[];

    function classify() {
        let articles: any[] = [];
        let series: any[] = [];
        for (let post of library) {
            post.isSeries ? series.push(post) : articles.push(post);
        }
        setArticles(articles);
        setSeries(series);
    }

    useEffect(() => {
        const getAuthor = async (userId: number) => {
            let author: any = {id: userId};
            try {
                // const response = await fetch(`${server}/v1/user/${userId}`, {
                //     method: 'GET'
                // });
                const response = await fetch(`${server}/v2/user/get/${userId}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',  // Set the correct content type
                    },
                    body: JSON.stringify({
                        requestFields: {},
                        responseFields: ["username", "avatar"],
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    author.username = result.username;
                    author.avatar = result.avatar;
                } else {
                    navigate("/");
                    popup(result.error);
                }
            } catch (error) {
                console.error(error);
                navigate("/");
                popup("Unable to Fetch Author's Details, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.");
            }
            return author;
        }

        const getArticle = async (indexInLibrary: number, articleId: number) => {
            try {
                let post: any = {};
                // const response = await fetch(`${server}/v1/article/${articleId}`, {
                //     method: 'GET'
                // });
                const response = await fetch(`${server}/v2/article/get/${articleId}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',  // Set the correct content type
                    },
                    body: JSON.stringify({
                        requestFields: {},
                        responseFields: ["title", "content", "author", "publishTime", "likes", "isSeries", "readTime", "cover"],
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    post.id = articleId;
                    post.title = result.title;
                    post.content = result.content;
                    post.author = await getAuthor(result.author);
                    post.publishedTime = result.publishTime;
                    post.likes = result.likes;
                    post.isSeries = result.isSeries;
                    post.readTime = result.readTime;
                    post.cover = result.cover;

                    library[indexInLibrary] = post;
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

        const getUser = async () => {
            try {
                // const response = await fetch(`${server}/v1/user/${id}`, {
                //     method: 'GET'
                // });
                const response = await fetch(`${server}/v2/user/get/${id}`, {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',  // Set the correct content type
                    },
                    body: JSON.stringify({
                        requestFields: {},
                        responseFields: ["library"],
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    let postsPromise: any[] = [];
                    library = new Array<any>(result.library.length);
                    for (let i = 0; i < result.library.length; i++) {
                        postsPromise.push(getArticle(i, result.library[i]));
                    }
                    await Promise.all(postsPromise);
                    classify();
                    setLoading(false);
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
        getUser().then(() => {});
    }, []);

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Your Library</h1>

            <div className="flex space-x-4 mb-8">
                <button
                    onClick={() => setActiveTab('single')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                        activeTab === 'single'
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    <BookOpen className="w-5 h-5"/>
                    <span>Single Posts</span>
                </button>
                <button
                    onClick={() => setActiveTab('series')}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                        activeTab === 'series'
                            ? 'bg-gray-900 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                    <Layers className="w-5 h-5"/>
                    <span>Series</span>
                </button>
            </div>

            <div className="grid gap-8">
                {
                    activeTab === 'single'
                    ? articles.map(post => <PostCard key={post.id} post={post} userId={id} state={true}/>)
                    : series.map(series => <PostCard key={series.id} post={series} userId={id} state={true}/>)
                }
            </div>
        </div>
    );
};

export default LibraryPage;