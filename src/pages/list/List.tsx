import "./list.css";
import Header from "../../components/header/Header";
import Navbar from "../../components/navbar/Navbar";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-date-range";
import SearchItem from "../../components/searchItem/SearchItem";
import useFetch from "../../hooks/useFetch";

const List = () => {
  const location = useLocation();
  const [destination, setDestination] = useState(
    (location.state as any).destination
  );
  const [openDate, setOpenDate] = useState(false);
  const [dates, setDates] = useState((location.state as any).dates);
  const [options, setOptions] = useState((location.state as any).options);
  const [minPrice, setMinPrice] = useState<any>(undefined);
  const [maxPrice, setMaxPrice] = useState<any>(undefined);

	const {data,loading,reFetch} = useFetch(`/hotels?city=${destination}&min=${minPrice || 0}&max=${maxPrice || 999}`);
	const handleClick = () => {
		reFetch();
	}
	const handleChange = (e:any) => {
		setOptions((prev:any) => ({
			...prev,
			[e.target.id]: [e.target.value]
		}))
	}
  return (
    <div>
      <Navbar />
      <Header type="list" />
      <div className="listContainer">
        <div className="listWrapper">
          <div className="listSearch">
            <h1 className="lsTitle">Search</h1>
            <div className="lsItem">
              <label htmlFor="">Destination</label>
              <input type="text" placeholder={destination} onChange={(e) => setDestination(e.target.value)}/>
            </div>
            <div className="lsItem">
              <label htmlFor="">Check-in Date</label>
              <span onClick={() => setOpenDate(!openDate)}>{`${format(
                dates[0].startDate,
                "MM/dd/yyyy"
              )} to ${format(dates[0].endDate, "MM/dd/yyyy")}`}</span>
              {openDate && (
                <DateRange
                  onChange={(item) => setDates([item.selection])}
                  minDate={new Date()}
                  ranges={dates}
                />
              )}
            </div>
            <div className="lsItem">
              <label htmlFor="">Options</label>
							<div className="lsOptions">
              <div className="lsOptionItem">
                <span className="lsOptionText">
                  Min place <small>per night</small>
                </span>
                <input type="number" onChange={e=>setMinPrice(e.target.value)} className="lsOptionInput" />
              </div>
              <div className="lsOptionItem">
                <span className="lsOptionText">
                  Max place <small>per night</small>
                </span>
                <input type="number" onChange={e=>setMaxPrice(e.target.value)} className="lsOptionInput" />
              </div>
              <div className="lsOptionItem">
                <span className="lsOptionText">Adult</span>
                <input
                  type="number"
                  className="lsOptionInput"
                  placeholder={options.adult}
                  min={1}
									id="adult"
									onChange={handleChange}
                />
              </div>
              <div className="lsOptionItem">
                <span className="lsOptionText">Children</span>
                <input
                  type="number"
                  className="lsOptionInput"
                  placeholder={options.children}
                  min={0}
									id="children"
									onChange={handleChange}
                />
              </div>
              <div className="lsOptionItem">
                <span className="lsOptionText">Room</span>
                <input
                  type="number"
                  className="lsOptionInput"
                  placeholder={options.room}
                  min={1}
									id="room"
									onChange={handleChange}
                />
              </div>
							</div>
            </div>
						<button onClick={handleClick}>Search</button>
          </div>
          <div className="listResult">
						{loading ? "loading" : <>
						{data.map((item:any)=>(
							<SearchItem item={item} key={item._id}/>
						))}
						</>}
					</div>
        </div>
      </div>
    </div>
  );
};

export default List;
