import useFetch from "../../hooks/useFetch";
import "./featuredProperties.css";

type Featured = {
	_id:number;
	photos:string[];
	name:string;
	city:string;
	cheapestPrice:string;
	rating:any;
}

const FeaturedProperties = () => {
	const {data,loading} = useFetch("/hotels?featured=true&limit=4");
  return (
    <div className="fp">
      {loading ? "loading" : <>
			{data.map((item:Featured)=>
				<div className="fpItem" key={item._id}>
					<img
						src={item.photos[0]}
						className="fpImg"
						alt=""
					/>
					<span className="fpName">{item.name}</span>
					<span className="fpCity">{item.city}</span>
					<span className="fpPrice">Starting from ${item.cheapestPrice}</span>
					{item.rating && <div className="fpRating">
						<button>{item.rating}</button>
						<span>Excellent</span>
					</div>}
				</div>
			)}
			</>}
    </div>
  );
};

export default FeaturedProperties;
