import {createContext, useReducer} from "react";

interface AppContextInterface{
	city: undefined|string;
	dates: null[]|Date[];
	options: {
		adult: undefined | number;
		children: undefined | number;
		room: undefined | number;
	},
	dispatch?: any
}

const InitialState:AppContextInterface = {
	city:undefined,
	dates:[],
	options:{
		adult: undefined,
		children: undefined,
		room: undefined,
	}
}

export const SearchContext = createContext<AppContextInterface>(InitialState);

const SearchReducer = (state:any,action:any) => {
	switch(action.type){
		case "New_Search":
			return action.payload;
		case "Reset_Search":
			return InitialState;
		default:
			return state;
	}
}

export const SearchContextProvider = (props:{children:any}) => {
	const {children} = props;
	const [state, dispatch] = useReducer(SearchReducer, InitialState);
	return(
		<SearchContext.Provider value={{city:state.city, dates:state.dates, options:state.options, dispatch}}>
			{children}
		</SearchContext.Provider>
	)
}