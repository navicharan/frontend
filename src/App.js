import { useState, useEffect } from "react";

function App() {
    const [num1, setNum1] = useState("");
    const [num2, setNum2] = useState("");
    const [sum, setSum] = useState(null);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/history")
            .then(res => res.json())
            .then(data => setHistory(data));
    }, [sum]); // Refresh history when sum changes

    const handleAdd = async () => {
        const response = await fetch("http://localhost:5000/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ num1: Number(num1), num2: Number(num2) }),
        });

        const data = await response.json();
        setSum(data.result);
    };
    const handleClearHistory = async () => {
    await fetch("http://localhost:5000/clear-history", { method: "DELETE" });
    setHistory([]);
};

    return (
        <div>
            <h1>Sum Calculator App 2</h1>
            <input
                type="number"
                placeholder="Enter Number 1"
                value={num1}
                onChange={(e) => setNum1(e.target.value)}
            />
            <input
                type="number"
                placeholder="Enter Number 2"
                value={num2}
                onChange={(e) => setNum2(e.target.value)}
            />
            <button onClick={handleAdd}>Add</button>

            {sum !== null && <h2>Sum: {sum}</h2>}

            <h2>History</h2>
            <ul>
                {history.map((entry, index) => (
                    <li key={index}>{entry.num1} + {entry.num2} = {entry.result} (Added on: {new Date(entry.timestamp).toLocaleString()} )
                    </li>
                ))}
            </ul>
            <button onClick={handleClearHistory}>Clear History</button>
        </div>
    );

}

export default App;
