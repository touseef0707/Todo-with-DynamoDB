"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTodos } from "@/app/context/TodosContext";
import { Trash2 } from "lucide-react"; 

export default function TodosPage() {
    const { todos, setTodos, addTodo, setSelectedTodo, deleteTodo } = useTodos(); // Access the todos context
    const [content, setContent] = useState("");
    const router = useRouter();

    useEffect(() => {
        fetch("/api/todos")
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch todos");
                }
                return res.json();
            })
            .then((data) => {
                if (Array.isArray(data)) {
                    setTodos(data);
                } else {
                    console.warn("Unexpected data format", data);
                    setTodos([]);
                }
            })
            .catch((error) => {
                setTodos([]);
            });
    }, [setTodos]);

    const handleAddTodo = async () => {
        if (!content) return;

        const res = await fetch("/api/todos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
        });

        const newTodoData = await res.json();

        if (res.ok && newTodoData.todoId) {
            const newTodo = { todoId: newTodoData.todoId, content };
            setContent("");
            addTodo(newTodo);
        } else {
            alert("Failed to add todo.");
        }
    };

    const handleDeleteTodo = async (todoId: string) => {
        const confirmDelete = confirm("Are you sure you want to delete this todo?");
        if (!confirmDelete) return;

        deleteTodo(todoId); // Delete the todo from context

        const res = await fetch("/api/todos", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ todoId }), // Send the todoId in the body
        });

        if (res.ok) {
            alert("Todo deleted successfully!");
            router.push("/"); // Redirect back to todos list
        } else {
            alert("Failed to delete todo.");
        }
    };


    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-yellow-500 to-blue-500 text-center mb-6">
                My Todo List
            </h1>

            <div className="flex space-x-4 mb-6">
                <input
                    value={content}
                    className="flex-1 p-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Add a new task..."
                />
                <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors duration-300"
                    onClick={handleAddTodo}
                >
                    Add Todo
                </button>
            </div>

            {todos.length > 0 ? (
                <ul className="space-y-3">
                    {todos.map((todo) => (
                        <li
                            key={todo.todoId}
                            className="flex justify-between items-center cursor-pointer text-cyan-400 hover:text-xl text-lg"
                            onClick={() => {
                                setSelectedTodo(todo);
                                router.push(`/todos/${todo.todoId}`);
                            }}
                        >
                            {todo.content}

                            {/* Delete button */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Prevent the click from triggering the todo click handler
                                    handleDeleteTodo(todo.todoId);
                                }}
                                className="text-red-500 hover:text-red-600 focus:outline-none ml-4"
                            >
                                <Trash2 size={20} />
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-600 text-center">No todos yet. Add a new task!</p>
            )}
        </div>
    );
}
