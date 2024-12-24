/*
Cover image should be optional;
Consider use <input type="file".../> instead of "text" and ask for url.
 */

import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {Image, Save} from '../asserts/icons';
import {server} from "../utils/address.ts";
import {readCookies} from "../utils/cookies.ts";

const postSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100),
    content: z.string().min(1, 'Content is required'),
    coverImage: z.string().url('Please enter a valid image URL'),
    isSeries: z.boolean(),
    seriesName: z.string().optional(),
});

type PostFormData = z.infer<typeof postSchema>;

const WritingPage = () => {
    const {register, handleSubmit, formState: {errors}} = useForm<PostFormData>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            isSeries: false,
        },
    });

    const cookies = readCookies();
    const userId = cookies.id;

    const onSubmit = async (data: PostFormData) => {
        try {
            const response = await fetch(`${server}/v1/article/upload`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',  // Set the correct content type
                },
                body: JSON.stringify({
                    session: userId,  // use userId as session for now; when replacing with the actual session, remember to update getAuthorName method in article.js in backend.
                    title: data.title,
                    summary: data.title,
                    content: data.content,
                    long: data.isSeries,
                    price: null,  // some further info about the article; to be used in the future.
                    tags: null,
                    preId: null,
                })
            });

            const result = await response.json();

            if (response.ok) {
                alert("Upload Successfully");
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert("Server Unreachable, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.")
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Write your story</h1>
                <button
                    onClick={handleSubmit(onSubmit)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
                >
                    <Save className="w-5 h-5"/>
                    <span>Publish</span>
                </button>
            </div>

            <form className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cover Image
                    </label>
                    <div className="flex items-center space-x-4">
                        <input
                            {...register('coverImage')}
                            type="text"
                            placeholder="Enter image URL"
                            className="flex-1 rounded-lg border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                        />
                        <button
                            type="button"
                            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            <Image className="w-5 h-5"/>
                            <span>Browse</span>
                        </button>
                    </div>
                    {errors.coverImage && (
                        <p className="mt-1 text-sm text-red-600">{errors.coverImage.message}</p>
                    )}
                </div>

                <div>
                    <input
                        {...register('title')}
                        type="text"
                        placeholder="Title"
                        className="w-full text-4xl font-bold border-0 focus:ring-0 placeholder-gray-400"
                    />
                    {errors.title && (
                        <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
                    )}
                </div>

                <div>
          <textarea
              {...register('content')}
              rows={12}
              placeholder="Tell your story..."
              className="w-full border-0 focus:ring-0 placeholder-gray-400 resize-none"
          />
                    {errors.content && (
                        <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                    )}
                </div>

                <div className="flex items-center space-x-4">
                    <input
                        {...register('isSeries')}
                        type="checkbox"
                        id="isSeries"
                        className="rounded border-gray-300 text-gray-900 focus:ring-gray-500"
                    />
                    <label htmlFor="isSeries" className="text-sm font-medium text-gray-700">
                        This is part of a series
                    </label>
                </div>
            </form>
        </div>
    );
};

export default WritingPage;