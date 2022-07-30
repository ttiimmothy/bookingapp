import {faCircleXmark} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import axios from "axios";
import {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {SearchContext} from "../../context/SearchContext";
import useFetch from "../../hooks/useFetch";
import "./reserve.css";

const Reserve = (props:{setOpen:React.Dispatch<React.SetStateAction<boolean>>, hotelId:string}) => {
	const {setOpen, hotelId} = props;
	const [selectedRooms, setSelectedRooms] = useState<any>([]);
	const {data} = useFetch(`/hotels/room/${hotelId}`);
	const {dates} = useContext(SearchContext);
	const getDatesInRange = (start:Date, end:Date) => {
		const date = new Date(start);
		let list = [];
		while(date <= end){
			list.push(new Date(date).getTime());
			date.setDate(date.getDate() + 1);
		}
		return list;
	}
	const navigate = useNavigate();

	const allDates = getDatesInRange((dates[0] as any).startDate, (dates[0] as any).endDate);
	const isAvailable = (roomNumber:any) => {
		const isFound = roomNumber.unavailableDates.some((date:any)=>allDates.includes(new Date(date).getTime()));
		return !isFound;
	}

	const handleSelect = (e:any) => {
		const checked = e.target.checked;
		const value = e.target.value;
		setSelectedRooms(checked ? [...selectedRooms, value] : selectedRooms.filter((item:any) => item !== value));
	}
	
	const handleClick = async () => {
		try{
			await Promise.all(selectedRooms.map((roomId: any) => {
				const res = axios.put(`/rooms/availability/${roomId}`,{dates: allDates});
				return (res as any).data;
			}))
			setOpen(false);
			navigate("/");
		}catch(err){
			console.error(err);
		}
	}

	return (
		<div className="reserve">
			<div className="rContainer">
				<FontAwesomeIcon icon={faCircleXmark} className="rClose" onClick={() => setOpen(false)}/>
				<span>Select your rooms:</span>
				{data.map((item:any) => (
					<div className="rItem">
						<div className="rItemInfo">
							<div className="rTitle">{item.title}</div>
							<div className="rDesc">{item.desc}</div>
							<div className="rMax">
								Max people: <b>{item.maxPeople}</b>
							</div>
							<div className="rPrice">{item.price}</div>
						</div>
						<div className="rSelectRooms">
							{item.roomNumbers.map((roomNumber:any) => (
								<div className="room">
									<label htmlFor="">{roomNumber.number}</label>
									<input type="checkbox" value={roomNumber._id} onChange={handleSelect} disabled={!isAvailable(roomNumber)}/>
								</div>
							))}
						</div>
					</div>
				))}
				<button onClick={handleClick} className="rButton">Reserve Now!</button>
			</div>
		</div>
	)
}

export default Reserve;