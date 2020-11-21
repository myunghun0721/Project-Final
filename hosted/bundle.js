"use strict";

var handleDomo = function handleDomo(e) {
  e.preventDefault(0);
  $("#eMessage").animate({
    width: 'hide'
  }, 350);

  if ($("#Name").val() == '' || $("#xPos").val() == '' || $("#zPos") == '') {
    handleError("All fields are required");
    return false;
  }

  sendAjax('POST', $("#locForm").attr("action"), $("#locForm").serialize(), function () {
    loadDomosFromServer();
  });
  return false;
};

var LocForm = function LocForm(props) {
  return /*#__PURE__*/React.createElement("form", {
    id: "locForm",
    onSubmit: handleDomo,
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
      className: "xPos"
    }, " X-Coordinate: ", location.x), /*#__PURE__*/React.createElement("h4", {
      className: "zPos"
    }, " Z-Coordinate: ", location.z), /*#__PURE__*/React.createElement("p", null, "this is my house location"));
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "locList"
  }, locNodes);
};

var loadDomosFromServer = function loadDomosFromServer() {
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
  loadDomosFromServer();
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
