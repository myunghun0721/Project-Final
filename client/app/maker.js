const handleLocation = (e) => {
	e.preventDefault(0);
	
	$("#eMessage").animate({width:'hide'},350);
	
	if($("#Name").val() == '' || $("#xPos").val() =='' || $("#zPos") == ''){
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

// copy x z coordinate
const copyText = (e) => {
	e.preventDefault(); 


	let xPos = `${e.target.getAttribute("data-location-z")}`;
	let zPos = `${e.target.getAttribute("data-location-x")}`;
	// tp 1058 71 -827
	let coordinate = `tp`;
	coordinate += ` ${zPos}`;
	coordinate += ``;
	coordinate += ` ${xPos}`;

	const el = document.createElement('textarea');
	el.value = coordinate;
	document.body.appendChild(el);
	el.select();
	document.execCommand('copy');
	document.body.removeChild(el);

	alert("Copied! " + el.value);
}



const LocForm = (props) => {
	return(
	<form id="locForm"
		onSubmit={handleLocation}
		name="locForm"
		action="/maker"
		method="POST"
		className="locForm"
	>
	  <label htmlFor="name">Name: </label>
	  <input id="Name" type="text" name="name" placeholder="Name"/>
	  <label htmlFor="x">xPos:</label>
	  <input id="xPos" type="text" name="x" placeholder="x-coordinate"/>
	  <label htmlFor="z">zPos:</label>
	  <input id="zPos" type="text" name="z" placeholder="z-coordinate"/>
	  <input id ="_csrfID" type="hidden" name="_csrf" value={props.csrf}/>
	  <input className="LocationSubmit" type="submit" value="Save Coordinate"/>
	</form>
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
				<h4 id="xCoord"className="xPos" value={location.x}> X-Coordinate: {location.x}</h4>
				<h4 id="zCoord" className="zPos" value={location.z}> Z-Coordinate: {location.z}</h4>
				<p></p>
				<button className="deleteLocation" onClick={deleteLocation} type="button" data-location-id={location._id}>Delete Location</button> 
				<button className="deleteLocation" onClick={copyText} type="button" data-location-x={location.x} data-location-z={location.z}>Copy</button> 
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