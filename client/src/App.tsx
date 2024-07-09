import useSWR from 'swr';
import './App.css';
import { useState } from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());
type Item = {
    id: number;
    title: string;
    body: string;
    done: boolean;
};

function App() {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [currentTodo, setCurrentTodo] = useState<Item | null>(null);
    const { data, mutate } = useSWR('http://localhost:4000/api/todos', fetcher);
    const deleteTodo = async (id: number) => {
        try {
            const response = await fetch(
                `http://localhost:4000/api/todos/${id}`,
                {
                    method: 'DELETE',
                }
            );
            if (response.ok) {
                mutate();
            } else {
                console.error('Failed to delete the todo item');
            }
        } catch (error) {
            console.error(
                'An error occurred while deleting the todo item',
                error
            );
        }
    };

    return (
        <>
            <div className="mt-10  mx-10 p-8 shadow-md text-start">
                <h1 className="text-4xl mb-4">Guide to getting things done.</h1>
                {data?.length > 0 ? (
                    data.map((item: Item) => (
                        <div key={item.id} className="mb-8">
                            <h4 className="text-lg font-bold">{item.title}</h4>
                            <p> {item.body} </p>
                            <div className="flex gap-4">
                                <button
                                    className="py-2 px-4 bg-red-400 text-white rounded-lg mt-2"
                                    onClick={() => deleteTodo(item.id)}
                                >
                                    Delete
                                </button>
                                <button
                                    className="py-2 px-4 bg-blue-400 text-white rounded-lg mt-2"
                                    onClick={() => {
                                        // set the current todo state to this todo if clicked
                                        setCurrentTodo(item);
                                    }}
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p> No action items yet. </p>
                )}
                <p className="text-right text-sm"> 01. </p>
            </div>
            <div className="flex justify-between mx-10">
                <div className="w-[48%] my-10 p-8 shadow-md text-start">
                    <h2 className="text-3xl"> Add Todo </h2>
                    <p className="mb-8">Bad UI, for quick testing only.</p>
                    <form>
                        <div className="flex gap-2">
                            <input
                                className="py-2 px-4 border"
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Title"
                            />
                            <input
                                className="py-2 px-4 border"
                                type="text"
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                                placeholder="Body"
                            />
                        </div>
                        <button
                            className="py-2 px-4 bg-green-500 text-white rounded-lg mt-4"
                            onClick={() => {
                                fetch('http://localhost:4000/api/todos', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        title,
                                        body,
                                        done: false,
                                    }),
                                }).then(() => {
                                    setTitle('');
                                    setBody('');
                                    mutate();
                                });
                            }}
                        >
                            Submit
                        </button>
                    </form>
                    <p className="text-right text-sm"> 02. </p>
                </div>
                <div className="w-[48%] my-10 p-8 shadow-md text-start">
                    <h2 className="text-3xl"> Update Todo </h2>
                    <p className="mb-8">Bad UI, for quick testing only.</p>
                    <form>
                        <div className="flex gap-2">
                            <input
                                className="py-2 px-4 border"
                                type="text"
                                value={currentTodo?.title || ''}
                                onChange={(e) =>
                                    setCurrentTodo(
                                        currentTodo
                                            ? {
                                                  ...currentTodo,
                                                  title: e.target.value,
                                              }
                                            : null
                                    )
                                }
                                placeholder="Title"
                            />
                            <input
                                className="py-2 px-4 border"
                                type="text"
                                value={currentTodo?.body || ''}
                                onChange={(e) =>
                                    setCurrentTodo(
                                        currentTodo
                                            ? {
                                                  ...currentTodo,
                                                  body: e.target.value,
                                              }
                                            : null
                                    )
                                }
                                placeholder="Body"
                            />
                        </div>
                        <button
                            className={`py-2 px-4 ${
                                !currentTodo
                                    ? 'bg-gray-300 text-gray-500'
                                    : 'bg-green-500 text-white'
                            }  rounded-lg mt-4`}
                            disabled={!currentTodo}
                            onClick={() => {
                                // update todos using method put
                                console.log(currentTodo);
                                fetch(
                                    `http://localhost:4000/api/todos/${currentTodo?.id}`,
                                    {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(currentTodo),
                                    }
                                ).then(() => {
                                    setCurrentTodo(null);
                                    mutate();
                                });
                            }}
                        >
                            Update
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}

export default App;
