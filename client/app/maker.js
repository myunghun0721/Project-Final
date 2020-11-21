const handleDomo = (e) => {
	e.preventDefault(0);
	
	$("#eMessage").animate({width:'hide'},350);
	
	if($("#Name").val() == '' || $("#xPos").val() =='' || $("#zPos") == ''){
		handleError("All fields are required");
		return false;
	}
	sendAjax('POST', $("#locForm").attr("action"), $("#locForm").serialize(),function(){
		loadDomosFromServer();
	});
	
	return false;
};

const LocForm = (props) => {
	return(
	<form id="locForm"
		onSubmit={handleDomo}
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
	  <input type="hidden" name="_csrf" value={props.csrf}/>
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
				<h4 className="xPos"> X-Coordinate: {location.x}</h4>
				<h4 className="zPos"> Z-Coordinate: {location.z}</h4>
				<p>this is my house location</p>
			</div>
		);
	});
	return(
		<div className = "locList">
			{locNodes}
		</div>
	);
};

const loadDomosFromServer = () =>{
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
	
	loadDomosFromServer();
};

const getToken = () => {
	sendAjax('GET','/getToken',null,(result)=>{
		setup(result.csrfToken);
	});
};

$(document).ready(function(){
	getToken();
});