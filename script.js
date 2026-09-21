
// ===============================
// EMERGENCY SOS
// ===============================

// Show SOS panel
function activateSOS() {
    document.getElementById("sosPanel").style.display = "block";
}


// Close SOS panel
function closeSOS() {
    document.getElementById("sosPanel").style.display = "none";
}


// Call Emergency Service
function callEmergency() {
    window.location.href = "tel:112";
}


// ===============================
// LOCATION
// ===============================

// Show current location
function getLocation() {

    const locationText = document.getElementById("location");
    const map = document.getElementById("map");

    if (!navigator.geolocation) {
        locationText.innerText =
            "Geolocation is not supported by your browser.";
        return;
    }

    locationText.innerText = "Getting your location...";

    navigator.geolocation.getCurrentPosition(

        function(position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            locationText.innerHTML =
                "📍 Latitude: " + latitude +
                "<br>📍 Longitude: " + longitude;

            // Show location on Google Maps
            map.src =
                "https://www.google.com/maps?q=" +
                latitude + "," + longitude +
                "&output=embed";
        },

        function() {

            locationText.innerText =
                "Unable to get your location. Please allow location permission.";
        }
    );
}


// ===============================
// EMERGENCY CONTACTS
// ===============================

function addContact() {

    const name =
        document.getElementById("contactName").value.trim();

    const number =
        document.getElementById("contactNumber").value.trim();

    if (name === "" || number === "") {
        alert("Please enter contact name and phone number.");
        return;
    }

    fetch("/add-contact", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            name: name,
            number: number
        })
    })
    .then(response => response.text())
    .then(message => {

        alert(message);

        // Show contact on page
        const contactList =
            document.getElementById("contactList");

        const contact =
            document.createElement("div");

        contact.className = "contact-item";

        contact.innerHTML =
            "<strong>" + name + "</strong><br>" +
            "📞 " + number +
            '<br><a href="tel:' + number + '">📞 Call Contact</a>';

        contactList.appendChild(contact);

        // Clear inputs
        document.getElementById("contactName").value = "";
        document.getElementById("contactNumber").value = "";

    })
    .catch(error => {

        console.error("Contact error:", error);

        alert("Contact could not be saved.");

    });
}


// ===============================
// REPORT INCIDENT
// ===============================

function submitIncident() {

    const incidentType =
        document.getElementById("incidentType").value;

    const incidentLocation =
        document.getElementById("incidentLocation").value.trim();

    const incidentDescription =
        document.getElementById("incidentDescription").value.trim();

    if (
        incidentType === "" ||
        incidentLocation === "" ||
        incidentDescription === ""
    ) {
        alert("Please fill all incident details.");
        return;
    }

    fetch("/report-incident", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            incidentType: incidentType,
            incidentLocation: incidentLocation,
            incidentDescription: incidentDescription
        })
    })
    .then(response => response.text())
    .then(message => {

        alert(message);

        document.getElementById("incidentType").value = "";
        document.getElementById("incidentLocation").value = "";
        document.getElementById("incidentDescription").value = "";

    })
    .catch(error => {

        console.error("Incident error:", error);

        alert("Incident could not be submitted.");

    });
}

// ===============================
// FEEDBACK
// ===============================

function submitFeedback() {

    const feedback =
        document.getElementById("feedback").value.trim();

    const rating =
        document.getElementById("rating").value;

    if (feedback === "") {
        alert("Please enter your feedback.");
        return;
    }

    if (rating === "0") {
        alert("Please select a star rating.");
        return;
    }

    fetch("/feedback", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            feedback: feedback,
            rating: rating
        })
    })
    .then(response => response.text())
    .then(message => {

        alert(message);

        document.getElementById("feedback").value = "";

        document.getElementById("rating").value = "0";

        selectedRating = 0;

        document.querySelectorAll("#starRating span").forEach(star => {
            star.style.color = "gray";
        });

        loadFeedback();
    })
    .catch(error => {

        console.error("Feedback error:", error);

        alert("Feedback could not be submitted.");

    });
}
    function loadContacts() {

    fetch("/contacts")
        .then(response => response.json())
        .then(contacts => {

            const contactList = document.getElementById("contactList");

            contactList.innerHTML = "";

            if (contacts.length === 0) {
                contactList.innerHTML = "<p>No emergency contacts saved.</p>";
                return;
            }

            contacts.forEach(contact => {

                const div = document.createElement("div");

                div.innerHTML = `
                    <p>
                        <strong>${contact.contact_name}</strong>
                        - ${contact.contact_number}
                    </p>
                `;

                contactList.appendChild(div);
            });
        })
        .catch(error => {
            console.error("Error loading contacts:", error);
        });
    
}
loadContacts();
let selectedRating = 0;

function setRating(rating) {
    selectedRating = rating;

    document.getElementById("rating").value = rating;

    const stars = document.querySelectorAll("#starRating span");

    stars.forEach((star, index) => {
        if (index < rating) {
            star.style.color = "gold";
        } else {
            star.style.color = "gray";
        }
    });
}
function loadFeedback() {
    fetch("/feedback")
        .then(response => response.json())
        .then(feedbacks => {

            const feedbackList = document.getElementById("feedbackList");

            feedbackList.innerHTML = "";

            if (feedbacks.length === 0) {
                feedbackList.innerHTML = "<p>No feedback yet.</p>";
                return;
            }

            feedbacks.forEach(item => {

                const div = document.createElement("div");
                div.className = "feedback-item";

                const p = document.createElement("p");
                p.textContent = "💬 " + item.feedback;

                div.appendChild(p);
                feedbackList.appendChild(div);
            });
        })
        .catch(error => {
            console.error("Error loading feedback:", error);
        });
}

loadFeedback();
