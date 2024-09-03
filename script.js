"use strict";

const form = document.querySelector(".form");

const inputName = document.querySelector(".form__input--name");
const inputType = document.querySelector(".form__input--type");
const inputDescription = document.querySelector(".form__input--description");
const inputDate = document.querySelector(".form__input--date");

let map, mapEvent;

navigator.geolocation.getCurrentPosition(
  function (position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    map = L.map("map").setView([latitude, longitude], 13);

    L.tileLayer("https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    // Event for when you click on the map

    map.on("click", function (mapE) {
      mapEvent = mapE;
      form.classList.remove("hidden");
      inputName.focus(); // Focuses on input Name while loading the page
    });
  },

  function () {
    alert("Could not get your position");
  }
);

// Event for when you submit the form

form.addEventListener("submit", function (e) {
  e.preventDefault();

  // Clear input fields
  inputName.value = inputDescription.value = inputDate.value = "";

  const { lat, lng } = mapEvent.latlng;
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: "visited-popup",
      })
    )
    .setPopupContent("Visited")
    .openPopup();
});
