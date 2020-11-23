"use strict";

var handleLocation = function handleLocation(e) {
  e.preventDefault(0);
  $("#eMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#Name").val() == '' || $("#xPos").val() == '' || $("#zPos") == '') {
    handleError("All fields are required");
    return false;
  }

  sendAjax('POST', $("#locForm").attr("action"), $("#locForm").serialize(), function () {
    loadLocationsFromServer();
  });
  return false;
}; // delete locations


var deleteLocation = function deleteLocation(e) {
  e.preventDefault();
  sendAjax('POST', '/deleteLocation', "_csrf=".concat(document.querySelector("#_csrfID").value, "&location_id=").concat(e.target.getAttribute("data-location-id")), function () {
    loadLocationsFromServer();
  });
  return false;
}; // copy x z coordinate


var copyText = function copyText(e) {
  e.preventDefault();
  var xPos = "".concat(e.target.getAttribute("data-location-z"));
  var zPos = "".concat(e.target.getAttribute("data-location-x")); // tp 1058 71 -827

  var coordinate = "tp";
  coordinate += " ".concat(xPos);
  coordinate += "";
  coordinate += " ".concat(zPos);
  var el = document.createElement('textarea');
  el.value = coordinate;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
  alert("Copied!");
};

var LocForm = function LocForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "locForm",
    onSubmit: handleLocation,
    name: "locForm",
    action: "/maker",
    method: "POST",
    className: "locForm"
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: "name"
  }, "Name: "), /*#__PURE__*/React.createElement("input", {
    id: "Name",
    type: "text",
    name: "name",
    placeholder: "Name"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "x"
  }, "xPos:"), /*#__PURE__*/React.createElement("input", {
    id: "xPos",
    type: "text",
    name: "x",
    placeholder: "x-coordinate"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "z"
  }, "zPos:"), /*#__PURE__*/React.createElement("input", {
    id: "zPos",
    type: "text",
    name: "z",
    placeholder: "z-coordinate"
  }), /*#__PURE__*/React.createElement("input", {
    id: "_csrfID",
    type: "hidden",
    name: "_csrf",
    value: props.csrf
  }), /*#__PURE__*/React.createElement("input", {
    className: "LocationSubmit",
    type: "submit",
    value: "Save Coordinate"
  }));
};

var LocList = function LocList(props) {
  if (props.locs.length === 0) {
    return /*#__PURE__*/React.createElement("div", {
      className: "locList"
    }, /*#__PURE__*/React.createElement("h3", {
      className: "emptyLocation"
    }, "No locations yet"));
  }

  var locNodes = props.locs.map(function (location) {
    return /*#__PURE__*/React.createElement("div", {
      key: location._id,
      className: "location"
    }, /*#__PURE__*/React.createElement("img", {
      src: "/assets/img/map.png",
      alt: "map",
      className: "locationIcon"
    }), /*#__PURE__*/React.createElement("h3", {
      className: "Name"
    }, " Name: ", location.name, " "), /*#__PURE__*/React.createElement("h4", {
      id: "xCoord",
      className: "xPos",
      value: location.x
    }, " X-Coordinate: ", location.x), /*#__PURE__*/React.createElement("h4", {
      id: "zCoord",
      className: "zPos",
      value: location.z
    }, " Z-Coordinate: ", location.z), /*#__PURE__*/React.createElement("p", null, "this is my house location"), /*#__PURE__*/React.createElement("button", {
      className: "deleteLocation",
      onClick: deleteLocation,
      type: "button",
      "data-location-id": location._id
    }, "Delete Location"), /*#__PURE__*/React.createElement("button", {
      className: "deleteLocation",
      onClick: copyText,
      type: "button",
      "data-location-x": location.x,
      "data-location-z": location.z
    }, "Copy"));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "locList"
  }, locNodes);
};

var loadLocationsFromServer = function loadLocationsFromServer() {
  sendAjax('GET', '/getLocations', null, function (data) {
    ReactDOM.render( /*#__PURE__*/React.createElement(LocList, {
      locs: data.locs
    }), document.querySelector("#locations"));
  });
};

var setup = function setup(csrf) {
  ReactDOM.render( /*#__PURE__*/React.createElement(LocForm, {
    csrf: csrf
  }), document.querySelector("#newDoc"));
  ReactDOM.render( /*#__PURE__*/React.createElement(LocForm, {
    locs: []
  }), document.querySelector("#locations"));
  loadLocationsFromServer();
};

var getToken = function getToken() {
  sendAjax('GET', '/getToken', null, function (result) {
    setup(result.csrfToken);
  });
};

$(document).ready(function () {
  getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#eMessage").animate({
    width: 'toggle'
  }, 350);
};

var redirect = function redirect(response) {
  $("#eMessage").animate({
    width: 'hide'
  }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
