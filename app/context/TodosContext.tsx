"use client"; // Add this line at the top of the file

import { createContext, useContext, useState, ReactNode } from "react";

// Define the shape of a Todo
interface Todo {
  todoId: string;
  content: string;
}

// Define the context state type
interface TodosContextType {
  todos: Todo[];
  selectedTodo: Todo | null;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setSelectedTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  addTodo: (Todo: Todo) => void;
  updateTodo: (todoId: string, content: string) => void;
  deleteTodo: (todoId: string) => void;
}

// Create the TodosContext
const TodosContext = createContext<TodosContextType | undefined>(undefined);

// TodosProvider component to wrap around your app
export const TodosProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTodo, setSelectedTodo] = useState<Todo | null>(null);

  // Function to add a new Todo
  const addTodo = (todo: Todo) => {
    setTodos((prevTodos) => [...prevTodos, todo]);
  };

  // Function to update a Todo
  const updateTodo = (todoId: string, content: string) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.todoId === todoId ? { ...todo, content } : todo
      )
    );
  };

  // Function to delete a todo
  const deleteTodo = (todoId: string) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.todoId !== todoId));
  };

  return (
    <TodosContext.Provider
      value={{
        todos,
        selectedTodo,
        setTodos,
        setSelectedTodo,
        addTodo,
        updateTodo,
        deleteTodo,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};

// Custom hook to use the todos context
export const useTodos = (): TodosContextType => {
  const context = useContext(TodosContext);
  if (!context) {
    throw new Error("useTodos must be used within a TodosProvider");
  }
  return context;
};
