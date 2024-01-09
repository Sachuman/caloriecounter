import { useEffect, useState } from 'react';

const api_base = 'https://calorie-counter-apisj27.onrender.com';

function App() {
    const [todos, setCalorie] = useState([]);
    const [popupActive, setPopupActive] = useState(false);
    const [newTodo, setNewCalorie] = useState("");
    const [numbers, setNumbers] = useState([]);
    const [newNumber, setNewNumber] = useState(0);

    useEffect(() => {
        GetCalorie();
        GetNumbers();
    }, []);

    const GetCalorie = () => {
        fetch(api_base + '/todos')
            .then(res => res.json())
            .then(data => setCalorie(data))
            .catch((err) => console.error("Error fetching todos: ", err));
    }

    const GetNumbers = () => {
        fetch(api_base + '/numbers')
            .then(res => res.json())
            .then(data => setNumbers(data))
            .catch((err) => console.error("Error fetching numbers: ", err));
    }

    const completeCalorie = async (id) => {
        const data = await fetch(api_base + '/todo/complete/' + id).then(res => res.json());

        setCalorie(todos => todos.map(todo => {
            if (todo._id === data._id) {
                todo.complete = data.complete;
            }

            return todo;
        }));
    }

    const completeNumbers = async (id) => {
        const data = await fetch(api_base + '/numbers/complete/' + id).then(res => res.json());

        setNumbers(numbers => numbers.map(number => {
            if (number._id === data._id) {
                number.complete = data.complete;
            }

            return number;
        }));
    }

    const addCalsandNumbs = async () => {
		if (!newTodo.trim()) {
			alert("Task text cannot be empty");
			return;
		}
	
		const todoData = await fetch(api_base + "/todo/new", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				text: newTodo,
			}),
		})
			.then((res) => res.json())
			.catch((error) => {
				console.error("Error adding todo:", error);
				alert("Error adding task. Please try again.");
			});
	
		if (todoData && todoData.text) {
			setCalorie([...todos, todoData]);
		} else {
			alert("Error adding task. Please try again.");
		}
	
		if (newNumber > 0) {
			try {
				const numberData = await fetch(api_base + "/numbers/new", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						value: parseInt(newNumber, 10),
					}),
				})
					.then((res) => res.json())
					.catch((error) => {
						console.error("Error adding number:", error);
						alert("Error adding number. Please try again.");
					});
	
				if (numberData && numberData.value) {
					setNumbers([...numbers, numberData]);
					setNewNumber(0);
				} else {
					alert("Error adding number. Please try again.");
				}
			} catch (error) {
				console.error("Error adding number:", error);
			}
		}
	
		setPopupActive(false);
		setNewCalorie("");
	};
	
	
    const deleteCalorie = async (id) => {
        const data = await fetch(api_base + '/todo/delete/' + id, { method: "DELETE" }).then(res => res.json());

        setCalorie(todos => todos.filter(todo => todo._id !== data.result._id));
    }

    const deleteNumber = async (id) => {
        const data = await fetch(api_base + '/numbers/delete/' + id, { method: 'DELETE' }).then((res) => res.json());

        setNumbers((numbers) => numbers.filter((number) => number._id !== data.result._id));
    };

    return (
        <div className="App">
            <h1>Welcome, Sachin To The Calorie Counter</h1>
            <h4>Your Calorie Count</h4>

            <div className="todos">
                {todos.length > 0 ? todos.map(todo => (
                    <div
                        className={"todo" + (todo.complete ? " is-complete" : "")}
                        key={todo._id}
                        onClick={() => completeCalorie(todo._id)}
                    >
                        <div className="checkbox"></div>
                        <div className="text">{todo.text}</div>
                        <div className="delete-todo" onClick={() => deleteCalorie(todo._id)}>x</div>
                    </div>
                )) : (
                    <p>You have no counts</p>
                )}
            </div>

            <div className="addPopup" onClick={() => setPopupActive(true)}>+</div>

            {popupActive ? (
                <div className="popup">
                    <div className="closePopup" onClick={() => setPopupActive(false)}>X</div>
                    <div className="content">
                        <h3>Add Item</h3>
                        <input
                            type="text"
                            className="add-todo-input"
                            onChange={e => setNewCalorie(e.target.value)}
                            value={newTodo}
                        />

                        <div>
                            <h3>Add Numbers</h3>
                            <input
                                type="number"
                                onChange={e => setNewNumber(e.target.value)}
                                value={newNumber}
                            />
                        </div>

                        <button className="tuntun" onClick={addCalsandNumbs}>Add Item and Calories</button>
                    </div>
                </div>
            ) : ''}

            <div className="sum-section">
                {numbers.length > 0 && (
                    <>
                        <p className="todo-please">Entered Calories: {numbers.map((number) => number.value).join(', ')}</p>
                        <p className="todo-please2">Total Calories:<br></br>{numbers.reduce((acc, num) => acc + num.value, 0)}</p>
                        <div className="complete-numbers">
                            {numbers.map((number) => (
                                <div
                                    key={number._id}
                                    className={'number' + (number.complete ? ' is-complete' : '')}
                                    onClick={() => completeNumbers(number._id)}
                                >
                                    {number.value}
                                    <div className="delete-number" onClick={() => deleteNumber(number._id)}>
                                        x
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default App;
