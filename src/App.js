import { useState, useEffect } from "react";
import axios from "axios";

function App() {
    const [num1, setNum1] = useState("");
    const [num2, setNum2] = useState("");
    const [sum, setSum] = useState(null);
    const [history, setHistory] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isRegistered, setIsRegistered] = useState(false);

    useEffect(() => {
        if (token) {
            axios.get("http://localhost:5000/history", { headers: { Authorization: token } })
                .then(res => setHistory(res.data))
                .catch(err => console.log(err));
        }
    }, [sum, token]);

    const handleAdd = async () => {
        const response = await axios.post("http://localhost:5000/add",
            { num1: Number(num1), num2: Number(num2) },
            { headers: { Authorization: token } }
        );
        setSum(response.data.result);
    };

    const handleRegister = async () => {
        await axios.post("http://localhost:5000/register", { email, password });
        setIsRegistered(true);
    };

    const handleLogin = async () => {
        const response = await axios.post("http://localhost:5000/login", { email, password });
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
    };

    return (
        <div>
            {!token ? (
                <div>
                    <h2>{isRegistered ? "Login" : "Register"}</h2>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {isRegistered ? (
                        <button onClick={handleLogin}>Login</button>
                    ) : (
                        <button onClick={handleRegister}>Register</button>
                    )}
                    <button onClick={() => setIsRegistered(!isRegistered)}>
                        {isRegistered ? "Go to Register" : "Go to Login"}
                    </button>
                </div>
            ) : (
                <div>
                    <h1>Sum Calculator</h1>
                    <input type="number" placeholder="Enter first number" value={num1} onChange={(e) => setNum1(e.target.value)} />
                    <input type="number" placeholder="Enter second number" value={num2} onChange={(e) => setNum2(e.target.value)} />
                    <button onClick={handleAdd}>Add</button>
                    {sum !== null && <h2>Sum: {sum}</h2>}
                    <h2>History</h2>
                    <ul>
                        {history.map((entry, index) => (
                            <li key={index}>{entry.num1} + {entry.num2} = {entry.result}</li>
                        ))}
                    </ul>
                    <button onClick={() => { localStorage.removeItem("token"); setToken(null); }}>Logout</button>
                </div>
            )}
        </div>
    );
}

export default App;
