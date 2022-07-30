import axios from "axios";
import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext";
import "./login.css";

const Login = () => {
	const  [credentials, setCredentials] = useState({
		username:undefined,
		password:undefined,
	})
	const {loading, error, dispatch} = useContext(AuthContext);
	const navigate = useNavigate();
	const handleChange = (e:any) => {
		setCredentials((prev)=>({
			...prev,
			[e.target.id]: e.target.value,
		}))
	}

	const handleClick = async (e: any) => {
		e.preventDefault();
		dispatch({type:"Login_Start"});
		try{
			const res = await axios.post("/auth/login", credentials);
			dispatch({type:"Login_Success", payload: res.data});
			navigate("/");
		}catch(err){
			dispatch({type:"Login_Failure", payload: (err as any).response.data})
		}
	}
	
	return (
		<div className="login">
			<div className="lContainer">
				<input type="text" placeholder="username" id="username" onChange={handleChange} className="lInput" />
				<input type="password" placeholder="password" id="password" onChange={handleChange} className="lInput" />
				<button disabled={loading} onClick={handleClick} className="lButton">Login</button>
				{error && <span>{error.message}</span>}
			</div>
		</div>
	)
}

export default Login