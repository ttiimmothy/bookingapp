import {createContext, useEffect, useReducer} from "react";

interface AppContextInterface{
	user: null|{username: string};
	loading: boolean;
	error: null|{message: string};
	dispatch?: any;
}

const InitialState:AppContextInterface = {
	user: JSON.parse(localStorage.getItem("user") as string),
	loading: false,
	error: null,
}

export const AuthContext = createContext<AppContextInterface>(InitialState);

const AuthReducer = (state:any,action:any) => {
	switch(action.type){
		case "Login_Start":
			return {
				user: null,
				loading: true,
				error: null,
			};
		case "Login_Success":
			return {
				user: action.payload,
				loading: false,
				error: null,
			};
		case "Login_Failure":
			return {
				user: null,
				loading: false,
				error: action.payload,
			};
		case "Logout":
			return {
				user: null,
				loading: false,
				error: null,
			};
		default:
			return state;
	}
}

export const AuthContextProvider = (props:{children:any}) => {
	const {children} = props;
	const [state, dispatch] = useReducer(AuthReducer, InitialState);

	useEffect(() => {
		localStorage.setItem("user", JSON.stringify(state.user));
	},[state.user])

	return(
		<AuthContext.Provider value={{user:state.user, loading:state.loading, error:state.error, dispatch}}>
			{children}
		</AuthContext.Provider>
	)
}