"use strict";

const form = document.querySelector(".form");

const inputName = document.querySelector(".form__input--name");
const inputType = document.querySelector(".form__input--type");
const inputDescription = document.querySelector(".form__input--description");
const inputDate = document.querySelector(".form__input--date");

let map, mapEvent;

class Journal {
  id = (Date.now() + "").slice(-10); // making a unique id
  constructor(coords, description, date) {
    this.coords = coords; // [lat, lang]
    this.description = description;
    this.date = date;
  }
}

class Visited extends Journal {
  type = "Visited";
  constructor(coords, description, date) {
    super(coords, description, date);
  }
}
class Traveling extends Journal {
  type = "Traveling";
  constructor(coords, description, date) {
    super(coords, description, date);
  }
}

class App {
  // Private Properties
  #map;
  #mapEvent;
  #journals = [];

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

    // Get data from form
    const type = inputType.value;
    const name = inputName.value;
    const description = inputDescription.value;
    const date = inputDate.value;
    const { lat, lng } = this.#mapEvent.latlng;
    let journal;

    // Create new object

    // If Visited place, create visited object
    if (type === "visited") {
      journal = new Visited([lat, lng], description, date);
    }

    // If traveling, create travelling object
    if (type === "traveling") {
      journal = new Traveling([lat, lng], description, date);
    }

    // Add new object to Journal Array
    this.#journals.push(journal);
    console.log(journal);

    //Render Journal on a map as a marker
    this.renderJournalMarker(journal);

    // Clear input fields
    inputName.value = inputDescription.value = inputDate.value = "";
  }

  renderJournalMarker(journal) {
    L.marker(journal.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${journal.type}--popup`,
        })
      )
      .setPopupContent(`${journal.type}`)
      .openPopup();
  }
}

const app = new App();
