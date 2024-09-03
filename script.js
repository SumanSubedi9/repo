"use strict";

const form = document.querySelector(".form");

const inputName = document.querySelector(".form__input--name");
const inputType = document.querySelector(".form__input--type");
const inputDescription = document.querySelector(".form__input--description");
const inputDate = document.querySelector(".form__input--date");

let map, mapEvent;

class App {
  // Private Properties
  #map;
  #mapEvent;

  // Constructor function gets executed first when the page loads
  constructor() {
    this._getPosition();
    // Event listener for when the submit button is clicked
    form.addEventListener("submit", this._newJournal.bind(this));
  }
  // Gets the current Position and calls the _loadMap method
  _getPosition() {
    navigator.geolocation.getCurrentPosition(
      this._loadMap.bind(this),
      function () {
        alert("Could not get your position");
      }
    );
  }

  // Load the map with the current position

  _loadMap(position) {
    const { latitude } = position.coords;
    const { longitude } = position.coords;
    this.#map = L.map("map").setView([latitude, longitude], 13);

    L.tileLayer("https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    // Calls the _showForm method when user clicks on the map

    this.#map.on("click", this._showForm.bind(this));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputName.focus();
  }

  _newJournal(e) {
    // Event for when you submit the form
    e.preventDefault();

    // Clear input fields
    inputName.value = inputDescription.value = inputDate.value = "";

    const { lat, lng } = this.#mapEvent.latlng;
    L.marker([lat, lng])
      .addTo(this.#map)
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
  }
}

const app = new App();
