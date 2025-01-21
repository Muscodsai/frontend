import {Bookmark, BookOpen, Like} from '../asserts/icons';

const HomePage = () => {
    document.title = 'Discover Stories';
    const featuredPosts = [
        {
            id: '1',
            title: 'The Future of Web Development',
            excerpt: 'Exploring the latest trends and technologies shaping the web...',
            author: 'Sarah Johnson',
            cover: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97',
            readTime: 5,
            likes: 234,
        },
        // Add more sample posts as needed
    ];

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Discover Stories</h1>

            <div className="grid gap-8">
                {featuredPosts.map((post) => (
                    <article
                        key={post.id}
                        className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                    >
                        <img
                            src={post.cover}
                            alt={post.title}
                            className="w-full h-64 object-cover"
                        />
                        <div className="p-6">
                            <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                            <p className="text-gray-600 mb-4">{post.excerpt}</p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <span className="flex items-center text-gray-500">
                                        <BookOpen className="w-4 h-4 mr-1"/>
                                        {post.readTime} min read
                                    </span>
                                    <span className="flex items-center text-gray-500">
                                        <Like className="w-4 h-4 mr-1"/>
                                        {post.likes}
                                    </span>
                                </div>
                                <button className="text-gray-500 hover:text-gray-700">
                                    <Bookmark className="w-5 h-5"/>
                                </button>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </div>
    );
};

export default HomePage;