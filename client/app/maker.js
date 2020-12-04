const handleLocation = (e) => {
	e.preventDefault(0);
	
	$("#eMessage").animate({width:'hide'},350);
	
	if($("#Name").val() == '' || $("#xPos").val() =='' || $("#yPos").val() =='' || $("#zPos") == ''){
		handleError("All fields are required");
		return false;
	}
	sendAjax('POST', $("#locForm").attr("action"), $("#locForm").serialize(),function(){
		loadLocationsFromServer();
	});
	
	return false;
};

// delete locations
const deleteLocation = (e) => { 
    e.preventDefault(); 

	sendAjax('POST', '/deleteLocation',
			 `_csrf=${document.querySelector("#_csrfID").value}&location_id=${e.target.getAttribute("data-location-id")}`,
			 function() { 
        loadLocationsFromServer(); 
    });
    return false; 
}; 


// copy x y z coordinate
const copyText = (e) => {
	e.preventDefault(); 

	let xPos = `${e.target.getAttribute("data-location-z")}`;
	let yPos = `${e.target.getAttribute("data-location-y")}`;
	let zPos = `${e.target.getAttribute("data-location-x")}`;

	let coordinate = `tp`;
	coordinate += ` ${zPos}`;
	coordinate += ` ${yPos}`;
	coordinate += ` ${xPos}`;

	const el = document.createElement('textarea');
	el.value = coordinate;
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);

	alert("Copied Location: " + el.value);
}

// show / hide pop-up
const popUp = () => {
	document.querySelector("#popup-1").classList.toggle("active");
};

// Add Location button
const MyButton = (props) => {
	return (
	<button onClick={popUp}> {props.label} </button>
	);
};

// location form (hidden untill Add Location button pressed)
const LocForm = (props) => {
	return(
	<div className="popup" id="popup-1">
		<div className="overlay"></div>
			<div className="content">
			<div className="close-btn" onClick={popUp}>&times;</div>
				<form id="locForm"
				onSubmit={handleLocation}
				name="locForm"
				action="/maker"
				method="POST"
				className="locForm"
				>
				<h3 htmlFor="name">Name: </h3>
				<input id="Name" type="text" name="name" placeholder="Name"/>
				<h3 htmlFor="x">xPos:</h3>
				<input id="xPos" type="text" name="x" placeholder="x-coordinate"/>
				<h3 htmlFor="y">yPos:</h3>
				<input id="yPos" type="text" name="y" placeholder="y-coordinate"/>
				<h3 htmlFor="z">zPos:</h3>
				<input id="zPos" type="text" name="z" placeholder="z-coordinate"/>
				<input id ="_csrfID" type="hidden" name="_csrf" value={props.csrf}/>
				<input className="LocationSubmit" type="submit" value="Save Coordinate"/>
				</form>
		</div>
	  </div>


	);
};

const LocList = function(props) {
	if(props.locs.length === 0){
		return(
			<div className="locList">
				<h3 className="emptyLocation">No locations yet</h3>
			</div>
		);
	}
	
	const locNodes = props.locs.map(function(location){
		return(
			<div key={location._id} className="location">
				<img src="/assets/img/map.png" alt="map" className="locationIcon"/>
				<h3 className="Name"> Name: {location.name} </h3>
				<h4 id="Coord"className="xPos" value={location.x}> X-Coordinate: {location.x}</h4>
				<h4 id="Coord" className="yPos" value={location.y}> Y-Coordinate: {location.y}</h4>
				<h4 id="Coord" className="zPos" value={location.z}> Z-Coordinate: {location.z}</h4>
				<p></p>
				<button className="deleteLocation" onClick={deleteLocation} type="button" data-location-id={location._id}>Delete Location</button> 
				<button className="deleteLocation" onClick={copyText} type="button" data-location-x={location.x} data-location-y={location.y} data-location-z={location.z}>Copy</button> 
			</div>
		);
	});
	return(
		<div className = "locList">
			{locNodes}
		</div>
	);
};

const loadLocationsFromServer = () =>{
	sendAjax('GET', '/getLocations',null,(data)=>{
		ReactDOM.render(
			<LocList locs={data.locs}/>,document.querySelector("#locations")
		);
	});
};

const setup = function(csrf) {
	ReactDOM.render(
		<LocForm csrf ={csrf}/>,document.querySelector("#newDoc")
	);
	
	ReactDOM.render(
		<LocForm locs={[]}/>, document.querySelector("#locations")
	);

	ReactDOM.render(
		<MyButton label={"Add Location"}/>, document.querySelector("#buttonSpan")
	);

	
	loadLocationsFromServer();
};

const getToken = () => {
	sendAjax('GET','/getToken',null,(result)=>{
		setup(result.csrfToken);
	});
};

$(document).ready(function(){
	getToken();
});