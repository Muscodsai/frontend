import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import {Image, Save} from '../asserts/icons';
import {server} from "../utils/address.ts";
import {readCookies} from "../utils/cookies.ts";
import {popup} from "../utils/popup.ts";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import {Loading} from "../asserts/loading.tsx";

const postSchema = z.object({
    title: z.string().min(1, 'Title is required').max(100, 'Your title is too long'),
    summary: z.string().min(1, 'Summary is required').max(100, 'Your summary is too long'),
    content: z.string().min(1, 'Content is required'),
    cover: z.string().url('Please enter a valid image URL'),
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
    const navigate = useNavigate();
    const [publishing, setPublishing] = useState<boolean>(false);

    const onSubmit = async (data: PostFormData) => {
        setPublishing(true);
        try {
            // const response = await fetch(`${server}/v1/article/upload`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',  // Set the correct content type
            //     },
            //     body: JSON.stringify({
            //         session: userId,  // use userId as session for now; when replacing with the actual session, remember to update getAuthorName method in article.js in backend.
            //         title: data.title,
            //         summary: data.summary,
            //         content: data.content,
            //         long: data.isSeries,
            //         price: null,  // some further info about the article; to be used in the future.
            //         tags: null,
            //         preId: -1,
            //     })
            // });

            const response = await fetch(`${server}/v2/article/upload/-1`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',  // Set the correct content type
                },
                body: JSON.stringify({
                    requestFields: {
                        session: userId,  // use userId as session for now; when replacing with the actual session, remember to update getAuthorName method in article.js in backend.
                        title: data.title,
                        summary: data.summary,
                        content: data.content,
                        long: data.isSeries,
                        price: null,  // some further info about the article; to be used in the future.
                        tags: null,
                        preId: -1,},
                    responseFields: [],
                })
            });
            const result = await response.json();

            if (response.ok) {
                navigate("/profile");
                popup("Upload Successfully");
            } else {
                popup(result.error);
            }
        } catch (error) {
            console.error(error);
            popup("Unable to Post Your Article, Please Try Again Later.\n\nIf the Error Persists, Please Contact Support.")
        }
        setPublishing(false);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Write your story</h1>
                <button
                    disabled={publishing}
                    onClick={handleSubmit(onSubmit)}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {
                        publishing ?
                            <div className="flex flex-row items-center space-x-2">
                                <Loading message="" scale={0.2} color="#fff"/>
                                <p className="text-nowrap">Publishing</p>
                            </div>
                            :
                            <div className="flex flex-row items-center space-x-2">
                                <Save className="w-5 h-5"/>
                                <p className="text-nowrap">Publish</p>
                            </div>
                    }
                </button>
            </div>

            <form className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cover Image
                    </label>
                    <div className="flex items-center space-x-4">
                        <input
                            {...register('cover')}
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
                    {errors.cover && (
                        <p className="mt-1 text-sm text-red-600">{errors.cover.message}</p>
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
                    <input
                        {...register('summary')}
                        type="text"
                        placeholder="Summary"
                        className="w-full text-2xl font-bold border-0 focus:ring-0 placeholder-gray-400"
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