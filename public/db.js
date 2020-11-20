// STANDARDIZE indexedDB OBJECT NAMES FOR DIFFERENT BROWSERS 
const indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;

let db;

// ENABLE indexedDB TO ACCESS WHATEVER DATABASE BROWSER NEEDS
const request = indexedDB.open("Transaction Action App", 1);

// SET UP OBJECT STORE
request.onupgradeneeded = ({ target }) => {
  let db = target.result;
  db.createObjectStore("Transaction Action Store", { autoIncrement: true });
};

// COMPLETE REQUEST
request.onsuccess = ({ target }) => {
  db = target.result;
  // check if app is online before reading from db
  if (navigator.onLine) {
    checkDatabase();
  }
};

// HANDLE ERRORS
request.onerror = function(event) {
  console.log("Woops! " + event.target.errorCode);
};

// SAVE DATA TO indexedDb
function saveRecord(record) {
  const transaction = db.transaction(["<object store name here>"], "readwrite");
  const store = transaction.objectStore("<object store name here>");
  store.add(record);
}

// WHEN INTERNET CONNECTION DETECTED, SENDS POST REQUEST TO SERVER AND WIPES EXISTING DATABASES
function checkDatabase() {
  const transaction = db.transaction(["<object store name here>"], "readwrite");
  const store = transaction.objectStore("<object store name here>");
  const getAll = store.getAll();

  getAll.onsuccess = function() {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
      .then(response => {        
        return response.json();
      })
      .then(() => {
        // DELETE RECORD IF UNSUCCESSFUL
        const transaction = db.transaction(["<object store name here>"], "readwrite");
        const store = transaction.objectStore("<object store name here>");
        store.clear();
      });
    }
  };
}

// LISTEN FOR ONLINE CONNECTION
window.addEventListener("online", checkDatabase);