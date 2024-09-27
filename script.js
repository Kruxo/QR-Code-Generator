import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    databaseURL: "https://leads-tracker-app-9fed8-default-rtdb.europe-west1.firebasedatabase.app/"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const referenceInDB = ref(database, "qrCodeDatabase");

const saveBtn = document.getElementById("save-btn");
const qrList = document.getElementById("qr-list");
const deleteBtn = document.getElementById("delete-btn");

const qrImage = document.getElementById("qr-img");
const qrText = document.getElementById("qr-text");
const qrGenerate = document.getElementById("generate-btn");

// Event listener to generate QR code image from input text
qrGenerate.addEventListener("click", () => {
    qrImage.src =
        "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=" +
        qrText.value;
});

// Function to display the list of QR codes from Firebase
function displayList(qrCodes) {
    let listItems = ""; // Initialize an empty string to build the list items
    for (let i = 0; i < qrCodes.length; i++) {
        // Construct each list item as a clickable link
        listItems += `
            <li>
                <a target='_blank' href='https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrCodes[i]}'>
                    ${qrCodes[i]}
                </a>
            </li>
        `;
    }
    // Update the inner HTML of the list element
    qrList.innerHTML = listItems;
}

saveBtn.addEventListener("click", function() {
    if (qrText.value) {
        push(referenceInDB, qrText.value);
        qrText.value = ""; // Clear the input field after saving
    }
});

deleteBtn.addEventListener("click", function() {
    remove(referenceInDB); 
    qrList.innerHTML = ""; 
});

// Auto-refresh the list when changes are made to Firebase
onValue(referenceInDB, function(snapshot){ 
    const snapshotDoesExist = snapshot.exists();  // Check if data exists in Firebase
    if (snapshotDoesExist) {
        const snapshotValues = snapshot.val();  // Get the data from Firebase
        const qrCodes = Object.values(snapshotValues);  // Convert the data into an array
        displayList(qrCodes);  // Call displayList to update the UI with the URLs
    } else {
        qrList.innerHTML = ""; // Clear the list if there are no entries
    }
});
