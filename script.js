"use strict";

navigator.geolocation.getCurrentPosition(
  function (position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
  },
  function () {
    alert("Could not get your position");
  }
);
