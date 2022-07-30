import {faCircleArrowLeft, faCircleArrowRight, faCircleXmark, faLocationDot} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useContext, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import MailList from "../../components/mailList/MailList";
import Navbar from "../../components/navbar/Navbar";
import Reserve from "../../components/reserve/Reserve";
import {AuthContext} from "../../context/AuthContext";
import {SearchContext} from "../../context/SearchContext";
import useFetch from "../../hooks/useFetch";
import "./hotel.css"

const Hotel = () => {
	const location = useLocation();
	const id = location.pathname.split("/")[2];
	const [slideNumber,setSlideNumber] = useState<any>(0);
	const [open,setOpen] = useState(false);
	const [openModal,setOpenModal] = useState(false);

	const {data,loading} = useFetch(`/hotels/find/${id}`);
	const { dates, options } = useContext(SearchContext);
	const {user} = useContext(AuthContext);
	const navigate = useNavigate();
	
	const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;
  function dayDifference(date1:Date, date2:Date) {
    const timeDiff = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(timeDiff / MILLISECONDS_PER_DAY);
    return diffDays;
  }
	const days = dayDifference((dates[0] as any)?.endDate, (dates[0] as any)?.startDate);
	
	const handleOpen = (i: number) => {
		setSlideNumber(i);
		setOpen(true);
	}

	const handleMove = (direction:string) => {
		let newSlideNumber;
		if(direction === "l"){
			newSlideNumber = slideNumber === 0 ? 5 : slideNumber - 1;
		}
		if(direction === "r"){
			newSlideNumber = slideNumber === 5 ? 0 : slideNumber + 1;
		}

		setSlideNumber(newSlideNumber);
	}
	const handleClick = () => {
		if(user){
			setOpenModal(true);
		}else{
			navigate("/");
		}
	}

	return (
		<div>
			<Navbar/>
			<Header type="list"/>
			{loading ? "loading" : <div className="hotelContainer">
				{open && <div className="slider">
					<FontAwesomeIcon icon={faCircleXmark} className="close" onClick={()=>setOpen(false)}/>
					<FontAwesomeIcon icon={faCircleArrowLeft} className="arrow"  onClick={()=>handleMove("l")}/>
					<div className="sliderWrapper">
						<img src={(data as any).photos[slideNumber]} alt="" className="sliderImg" />
					</div>
					<FontAwesomeIcon icon={faCircleArrowRight} className="arrow" onClick={()=>handleMove("r")}/>
				</div>}
				<div className="hotelWrapper">
					<button className="bookNow" onClick={handleClick}>Reserve or Book Now!</button>
					<h1 className="hotelTitle">{(data as any).name}</h1>
					<div className="hotelAddress">
						<FontAwesomeIcon icon={faLocationDot}/>
						<span>{(data as any).address}</span>
					</div>
					<span className="hotelDistance">
            Excellent location – {(data as any).distance}m from center
          </span>
          <span className="hotelPriceHighlight">
            Book a stay over ${(data as any).cheapestPrice} at this property and get a free airport taxi
          </span>
					<div className="hotelImages">
						{(data as any).photos?.map((photo:any,i:number) => (
							<div className="hotelImgWrapper" key={i}>
								<img onClick={()=>handleOpen(i)} src={photo} alt="" className="hotelImg" />
							</div>
						))}
					</div>
					<div className="hotelDetails">
						<div className="hotelDetailTexts">
						<h1 className="hotelTitle">{(data as any).title}</h1>
              <p className="hotelDesc">
								{(data as any).desc}
              </p>
						</div>
						<div className="hotelDetailPrice">
							<h1>Perfect for a {days}-night stay!</h1>
              <span>
                Located in the real heart of Krakow, this property has an
                excellent location score of 9.8!
              </span>
              <h2>
                <b>${days * (data as any).cheapestPrice * (options as any).room}</b> ({days} nights)
              </h2>
              <button onClick={handleClick}>Reserve or Book Now!</button>
						</div>
					</div>
				</div>
				<MailList/>
				<Footer/>
			</div>}
			{openModal && <Reserve setOpen={setOpenModal} hotelId={id}/>}
		</div>
	)
}

export default Hotel