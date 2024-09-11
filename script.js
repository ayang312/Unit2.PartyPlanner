const COHORT = "2407-FTB-ET-WEB-PT";
const API_URL = `https://fsa-crud-2aa9294fe819.herokuapp.com/api/${COHORT}/events`;

const state = {
    events: [],
};

const eventList = document.querySelector("#events");

const addEventForm = document.querySelector("#addParty");
addEventForm.addEventListener("submit", addEvent);

/**
 * Sync state with the API and rerender
 */
async function render() {
    await getEvents();
    renderEvents();
}
render();

/**
 * Update state with events from API
 */
async function getEvents() {
    // TODO
    try {
        const response = await fetch(API_URL);
        const json = await response.json();
        state.events = json.data;
    } catch (error) {
        console.error(error);
    }
}

/**
 * Delete an event based on its ID
 * @param {number} eventId
 */
async function deleteEvent(eventId) {
    try {
        const response = await fetch(`${API_URL}/${eventId}`, {
            method: "DELETE",
        });

        if (!response.ok) {
            throw new Error("Failed to delete event");
        }

        // Re-fetch and render the updated events list after deleting the event
        await render();
    } catch (error) {
        console.error(error);
    }
}

/**
 * Render events from state
 */
function renderEvents() {
    // TODO
    if (!state.events.length) {
        eventList.innerHTML = "<li>No events.</li>";
        return;
    }

    const eventCards = state.events.map((event) => {
        const li = document.createElement("li");
        li.innerHTML = `
      <h2 style='color:red'>${event.name}</h2>
        <p>Date: ${event.date}</p>
        <p>Location: ${event.location}</p>
      <p>Description: ${event.description}</p>
    `;

        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete Event";
        li.append(deleteButton);

        // Access the correct event id
        deleteButton.addEventListener("click", () => deleteEvent(event.id));

        return li;
    });

    eventList.replaceChildren(...eventCards);
}

/**
 * Ask the API to create a new event based on form data
 * @param {Event} event
 */
async function addEvent(e) {
    e.preventDefault();

    const name = document.querySelector('#name').value;
    const date = new Date(document.querySelector('#date').value);
    const location = document.querySelector('#location').value;
    const description = document.querySelector('#description').value;

    // TODO
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: name,
                date: date,
                location: location,
                description: description,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to create event");
        }

        // Re-fetch and render the updated events list after successfully adding the event
        await render();
    } catch (error) {
        console.error(error);
    }
}
