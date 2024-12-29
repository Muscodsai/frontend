import { getSession } from "../sessions";

const WritingPage = () => {
  function submit(e: { preventDefault: () => void; target: any; }) {
    e.preventDefault();

    const form = e.target;
    const url = "127.0.0.1:8800/v1/article/upload";
    fetch(url, {
        method: "POST",
        body: JSON.stringify({
            session: getSession(),
            title: form.title,
            summary: null,
            content: form.content,
            long: form.content.length,
            price: 0,
            tags: 0,
            preId: 0
        })
    })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Write your story</h1>
      </div>

      <form className="space-y-6" method="post" onSubmit={submit}>
        <div>
          <input
            name="title"
            type="text"
            placeholder="Title"
            className="w-full text-4xl font-bold border-0 focus:ring-0 placeholder-gray-400"
          />
        </div>

        <div>
          <textarea
            name="content"
            rows={12}
            placeholder="Tell your story..."
            className="w-full border-0 focus:ring-0 placeholder-gray-400 resize-none"
          />
        </div>
        <button type="submit">Publish</button>
      </form>
    </div>
  );
};

export default WritingPage;