function Chat() {
  return (
    <div className=" bg-blue-900 flex-grow flex">

    <div className="w-full max-w-md m-auto">
        <h2 className="text-3xl bold mb-3 text-purple-200 text-center font-bold">What's on your mind today ?</h2>
        <form>
            <input
            type="text"
            className="w-full placeholder-purple-200 bg-purple-600 text-white py-3 px-3 rounded-3xl font-semibold hover:bg-purple-700 transition disabled:opacity-50"
            placeholder="Ask anything?"
            />
        </form>
    </div>
    </div>
  )
}

export default Chat