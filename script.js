"use strict";

const form = document.querySelector(".form");

const inputName = document.querySelector(".form__input--name");
const inputType = document.querySelector(".form__input--type");
const inputDescription = document.querySelector(".form__input--description");
const inputDate = document.querySelector(".form__input--date");
const containerJournals = document.querySelector(".journals");

let map, mapEvent;

class Journal {
  id = (Date.now() + "").slice(-10); // making a unique id
  constructor(coords, description, date, name) {
    this.coords = coords; // [lat, lang]
    this.name = name;
    this.description = description;
    this.date = date;
  }
}

class Visited extends Journal {
  type = "visited";
  constructor(coords, description, date, name) {
    super(coords, description, date, name);
  }
}
class Traveling extends Journal {
  type = "traveling";
  constructor(coords, description, date, name) {
    super(coords, description, date, name);
  }
}

class App {
  // Private Properties
  #map;
  #mapEvent;
  #journals = [];

  // Constructor function gets executed first when the page loads
  constructor() {
    // Get users position
    this._getPosition();

    // Get data from Local Storage
    this._getLocalStorage();

    // Event listener for when the submit button is clicked
    form.addEventListener("submit", this._newJournal.bind(this));
    containerJournals.addEventListener("click", this._moveToPopup.bind(this));
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
    this.#journals.forEach((j) => this._renderJournalMarker(j));
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove("hidden");
    inputName.focus();
  }

  _hideForm() {
    // Clears the input fields
    inputName.value = inputDescription.value = inputDate.value = "";
    // Hides the form
    form.style.display = "none";
    form.classList.add("hidden");
    setTimeout(() => {
      (form.style.display = "grid"), 1000;
    });
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

    // Form validation
    if (name === "" || description === "" || date === "") {
      alert("Please fill in all fields");
      return;
    }

    // If Visited place, create visited object
    if (type === "visited") {
      journal = new Visited([lat, lng], description, date, name);
    }

    // If traveling, create travelling object
    if (type === "traveling") {
      journal = new Traveling([lat, lng], description, date, name);
    }

    // Add new object to Journal Array
    this.#journals.push(journal);
    console.log(journal);

    //Render Journal on a map as a marker
    this._renderJournalMarker(journal);

    this._renderJournal(journal);

    // Hide form
    this._hideForm();

    // Clear input fields
    inputName.value = inputDescription.value = inputDate.value = "";

    // Set local storage to all journals
    this._setLocalStorage();
  }

  _renderJournalMarker(journal) {
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
      .setPopupContent(
        `${journal.type === "visited" ? "✅" : "🚗"} ${journal.name}`
      )
      .openPopup();
  }

  _renderJournal(journal) {
    const html = `
    <li class="journal journal--${journal.type}" data-id="${journal.id}">
      <h2 class="journal_title">${journal.name}</h2>
      <div class="journal_details">
      <span class="journal_icon">${
        journal.type === "visited" ? "✅" : "🚗"
      }</span>
      <span class="journal_type">${journal.type}</span>
      </div>
      <div class="journal_details">
      <span class="journal_icon">📖</span>
      <span class+"journal_description">${journal.description}</span>
      </div>
      <div class="journal_details">
      <span class="journal_icon">📅</span>
      <span class="journal_date">${journal.date}</span>
      </div>

    </li>
    `;

    form.insertAdjacentHTML("afterend", html);
  }

  _moveToPopup(e) {
    const journalEL = e.target.closest(".journal");
    console.log(journalEL);

    if (!journalEL) return;
    const journal = this.#journals.find(
      (journal) => journal.id === journalEL.dataset.id
    );
    console.log(journal);

    this.#map.setView(journal.coords, 13, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  _setLocalStorage() {
    localStorage.setItem("journals", JSON.stringify(this.#journals));
  }
  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem("journals"));

    if (!data) return;

    this.#journals = data;

    this.#journals.forEach((j) => this._renderJournal(j));
  }
}

const app = new App();
