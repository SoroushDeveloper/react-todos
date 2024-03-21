import {useEffect, useState} from "react";
import TodoList from "./TodoList";
import {v4 as uuidv4} from 'uuid';

export default function Todos() {

    const [todos, setTodos] = useState([]);

    const addNewTodoHandler = async (event) => {
        if (event.key === 'Enter' && event.target.value !== "") {
            let newTodo = {
                title: event.target.value,
                status: false,
            }
            event.target.value = '';
            try {
                let res = await fetch('https://65fbe65214650eb2100af627.mockapi.io/todos', {
                    method: 'post',
                    headers: {'content-type': 'application/json'},
                    body: JSON.stringify(newTodo),
                });
                let todoData = await res.json();
                setTodos([
                    ...todos,
                    todoData,
                ]);
            } catch (error) {
                console.log(error);
            }
        }
    }

    const deleteTodoHandler = async (todo) => {
        let res = await fetch('https://65fbe65214650eb2100af627.mockapi.io/todos/' + todo?.id, {
            method: 'delete',
        });
        if (res.ok) {
            let newTodos = todos.filter((todoItem) => {
                return todo.id != todoItem.id;
            });
            setTodos(newTodos);
        }
    }

    const toggleTodoStatusHandler = async (todo) => {
        let res = await fetch('https://65fbe65214650eb2100af627.mockapi.io/todos' + todo?.id, {
            method: 'put',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                status: !todo?.status,
            }),
        });
        if (res.ok) {
            let newTodos = todos.map((todoItem) => {
                if (todo.id == todoItem.id) {
                    todoItem.status = !todoItem.status;
                    return todoItem;
                }
                return todoItem;
            });
            setTodos(newTodos);
        }
    }

    const editTodoTitleHandler = async (todo, newTitle) => {
        let res = await fetch('https://65fbe65214650eb2100af627.mockapi.io/todos' + todo?.id, {
            method: 'put',
            headers: {'content-type': 'application/json'},
            body: JSON.stringify({
                title: newTitle,
            }),
        });
        if (res.ok) {
            let newTodos = todos.map((todoItem) => {
                if (todo.id == todoItem.id) {
                    todoItem.title = newTitle;
                    return todoItem;
                }
                return todoItem;
            });
            setTodos(newTodos);
        }
    }

    const getTodos = async () => {
        try {
            let res = await fetch('https://65fbe65214650eb2100af627.mockapi.io/todos');
            let todos = await res.json();
            if (res.ok) {
                setTodos(todos);
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getTodos();
    }, [todos]);

    return (
        <div className="flex items-center justify-center h-screen">
            <div className="w-full px-4 py-8 mx-auto shadow lg:w-1/3  bg-white">
                <div className="flex items-center mb-6">
                    <h1 className="mr-6 text-4xl font-bold text-purple-600">TO DO APP</h1>
                </div>
                <div className="relative">
                    <input type="text" placeholder="What needs to be done today?"
                           className="w-full px-2 py-3 border rounded outline-none border-grey-600"
                           onKeyDown={addNewTodoHandler}/>
                </div>
                <TodoList todos={todos} deleteTodo={deleteTodoHandler} toggleTodoStatus={toggleTodoStatusHandler}
                          editTodoTitle={editTodoTitleHandler}/>
            </div>
        </div>
    )
}