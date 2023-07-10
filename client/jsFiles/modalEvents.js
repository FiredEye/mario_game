import { init, animate } from "./canvasLogics.js";
import { sharedData, keys } from "./shared.js";
import { CreateNewDate } from "./utils.js";
// Get the modal-content div
var modalContent = document.querySelector(".modal-content");
var modalContent1 = document.querySelector(".modal-content1");
var modalContent2 = document.querySelector(".modal-content2");
var modalContent3 = document.querySelector(".modal-content3");
var modalContent4 = document.querySelector(".modal-content4");

// Selecting the input element
var inputName = document.querySelector(".input_name");
var inputCode = document.querySelector(".input_code");
var inputCode1 = document.querySelector(".input_code1");
// Select the Show button
var showButton = document.querySelector(".show");

// Select the Start button
var startButton = document.querySelector(".start");

//Create the Resume button
var resumeButton = document.querySelector(".resume");
// Create the Resume Game button
var resumeGameButton = document.querySelector(".resumeGame");

//Create Return home button
var returnHomeButton = document.querySelector(".returnHome");

// Create the Restart button
var restartButton = document.querySelector(".restart");

// Create the Back button
var backButton = document.querySelector(".back");
var backButton1 = document.querySelector(".back1");

// Create the Start code button
var startCodeButton = document.querySelector(".start_code");

// Create the Cancel code button
var cancelCodeButton = document.querySelector(".cancel_code");

function checkInputValidity() {
  // Check the length of the input values
  var isInputValid = inputName.value.length > 4 && inputCode.value.length > 4;

  // Enable or disable the button based on input validity
  startButton.disabled = !isInputValid;
}

// Attach event listener to both input fields
inputName.addEventListener("input", checkInputValidity);
inputCode.addEventListener("input", checkInputValidity);

//Start the game when the start button is clicked
startButton.addEventListener("click", async () => {
  modalContent.style.display = "none";
  const userData = {
    name: inputName.value,
    score: 140,
    code: inputCode.value,
    created_at: CreateNewDate(),
    updated_at: CreateNewDate(),
  };

  try {
    const user = await fetch("http://localhost:5000/api/userData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    const result = await user.json();

    if (result.data) {
      const { code, ...restData } = result.data;
      sessionStorage.setItem("userData", JSON.stringify(restData));
      sharedData.canvas.style.display = "block";
      sharedData.keysAccess = true;
      init();

      animate();
    }
    if (!user.ok) {
      throw new Error("Failed to post data");
    }
  } catch (error) {
    console.error("Error:", error);
  }
});

//resume the game when the resumeBtn is  pressed
resumeButton.addEventListener("click", () => {
  modalContent1.style.display = "none";
  sharedData.isPaused = false;
  animate();
});

//return to the start page when presse
returnHomeButton.addEventListener("click", () => {
  const userData = JSON.parse(sessionStorage.getItem("userData"));
  const { id } = userData;
  fetch(`http://localhost:5000/api/userData/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ updated_at: CreateNewDate() }),
  })
    .then((response) => response.json())
    .then((result) => {
      if (result.message) {
        sessionStorage.clear();
        sharedData.canvas.style.display = "none";
        modalContent1.style.display = "none";
        inputName.value = "";
        inputCode.value = "";
        startButton.setAttribute("disabled", true);
        modalContent.style.display = "flex";
        modalContent.style.flex = "none";
        modalContent1.style.flex = "none";
        modalContent2.style.flex = "none";
        modalContent3.style.flex = "none";
        sharedData.isPaused = false;
        sharedData.scoreBoard = 140;
        keys.left.pressed = false;
        keys.right.pressed = false;
        sharedData.playerPowerUp = false;
        sharedData.lastKey = "right";
        sharedData.keysAccess = false;
        inputName.focus();
      }
    })
    .catch((error) => console.error(error));
});
//restart the game when the restartBtn is  pressed
restartButton.addEventListener("click", () => {
  modalContent1.style.display = "none";
  sharedData.isPaused = false;
  sharedData.scoreBoard = 140;
  keys.left.pressed = false;
  keys.right.pressed = false;
  sharedData.playerPowerUp = false;
  sharedData.lastKey = "right";
  fetch("http://localhost:5000/api/highScore")
    .then((response) => response.json())
    .then((data) => {
      if (data.largestScore) hi_score = data.largestScore;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  init();
  animate();
});

const prevButton = document.getElementById("prev-button");
const nextButton = document.getElementById("next-button");
const prevButton1 = document.getElementById("prev-button1");
const nextButton1 = document.getElementById("next-button1");

let currentPage = 1;
let totalPages = 1;
//Creating SelectPlayer Table
const tableBody = document.getElementById("data-body");
const tableBody1 = document.getElementById("data-body1");

//showing scores in modal-content2
showButton.addEventListener("click", () => {
  modalContent.style.display = "none";
  modalContent1.style.display = "none";
  modalContent2.style.display = "flex";
  // Display loading state
  tableBody.innerHTML =
    '<tr><td colspan="4" style="text-align:center">Loading...</td></tr>';

  currentPage = 1;
  fetchRecords("tableShow");
});

//showing players in modal-content3
resumeGameButton.addEventListener("click", () => {
  modalContent.style.display = "none";
  modalContent1.style.display = "none";
  modalContent3.style.display = "flex";
  // Display loading state
  tableBody1.innerHTML =
    '<tr><td colspan="3" style="text-align:center">Loading...</td></tr>';

  currentPage = 1;
  fetchRecords("tablePlayer");
});
//display wrong code indication
const wrongCode = document.querySelector(".wrong_code");
// Attach event listener to the parent element for event delegation
var Pid, Pcode, Pname, Pscore;
tableBody1.addEventListener("click", (event) => {
  inputCode1.value = "";
  startCodeButton.disabled = true;
  const selectedPlayer = event.target.closest(".selectPlayer");
  const playerId = selectedPlayer.id;
  const [id, name, score, code] = playerId.split("_");
  Pid = id;
  Pcode = code;
  Pname = name;
  Pscore = score;
  var codeH1 = document.querySelector(".codeH1");
  codeH1.innerHTML = `Enter Player Code:(${name})`;
  wrongCode.style.display = "none";
  modalContent4.style.display = "flex";
  modalContent3.style.pointerEvents = "none";
  modalContent4.style.pointerEvents = "auto";
  inputCode1.focus();
  inputCode1.addEventListener("input", () => {
    wrongCode.style.display = "none";
    if (inputCode1.value.length > 4) {
      startCodeButton.disabled = false;
    } else {
      startCodeButton.disabled = true;
    }
  });
});
cancelCodeButton.addEventListener("click", () => {
  modalContent4.style.display = "none";
  modalContent3.style.display = "flex";
  modalContent3.style.pointerEvents = "auto";
  inputCode1.value = "";
});
startCodeButton.addEventListener("click", () => {
  if (inputCode1.value === Pcode) {
    sessionStorage.setItem(
      "userData",
      JSON.stringify({ id: Pid, name: Pname, score: Pscore })
    );
    if (sessionStorage.getItem("userData")) {
      modalContent3.style.display = "none";
      modalContent4.style.display = "none";
      modalContent3.style.pointerEvents = "auto";
      sharedData.canvas.style.display = "block";
      sharedData.keysAccess = true;
      init();
      animate();
    }
  } else {
    wrongCode.style.display = "block";
    startCodeButton.disabled = true;
    inputCode1.value = "";
    inputCode1.focus();
  }
});

function handleButtonClick(table, increment) {
  currentPage += increment;
  fetchRecords(table);
}

prevButton.addEventListener("click", () => handleButtonClick("tableShow", -1));
prevButton1.addEventListener("click", () =>
  handleButtonClick("tablePlayer", -1)
);
nextButton.addEventListener("click", () => handleButtonClick("tableShow", 1));
nextButton1.addEventListener("click", () =>
  handleButtonClick("tablePlayer", 1)
);

async function fetchRecords(table) {
  const response = await fetch(
    `http://localhost:5000/api/records?page=${currentPage}&limit=10`
  );

  const result = await response.json();
  const data = result.data;
  totalPages = result.totalPages || 1; // Use provided totalPages, default to 1 if not available
  const tableBodyElement = table === "tableShow" ? tableBody : tableBody1;

  tableBodyElement.innerHTML = "";
  if (data.length > 0) {
    data.forEach((record) => {
      const tr = document.createElement("tr");
      if (table === "tableShow") {
        const idCell = createTableCell(record.id);
        const nameCell = createTableCell(record.name);
        const scoreCell = createTableCell(record.score);
        const lPlayedCell = createTableCell(record.updated_at);

        tr.appendChild(idCell);
        tr.appendChild(nameCell);
        tr.appendChild(scoreCell);
        tr.appendChild(lPlayedCell);
      } else if (table === "tablePlayer") {
        const idCell = createTableCell(record.id);
        const nameCell = createTableCell(record.name);
        tr.classList.add("selectPlayer");
        tr.id =
          record.id +
          "_" +
          record.name +
          "_" +
          record.score +
          "_" +
          record.code;
        tr.appendChild(idCell);
        tr.appendChild(nameCell);
      }

      tableBodyElement.appendChild(tr);
    });
  }

  updatePaginationControls(table);
}
function createTableCell(value) {
  const cell = document.createElement("td");
  cell.textContent = value;
  cell.classList.add("bordered-cell");
  return cell;
}

function updatePaginationControls(table) {
  const prevButtonElement = table === "tableShow" ? prevButton : prevButton1;
  const nextButtonElement = table === "tableShow" ? nextButton : nextButton1;

  prevButtonElement.disabled = currentPage === 1;
  nextButtonElement.disabled = currentPage === totalPages;
}

// back to the main modal
backButton.addEventListener("click", () => {
  modalContent2.style.display = "none";
  modalContent.style.display = "flex";
  inputName.focus();
});
backButton1.addEventListener("click", () => {
  modalContent3.style.display = "none";
  modalContent.style.display = "flex";
  inputName.focus();
});
document.addEventListener("keydown", ({ code }) => {
  if (sharedData.keysAccess) {
    switch (code) {
      case "KeyP":
        sharedData.isPaused = !sharedData.isPaused;
        if (!sharedData.isPaused) {
          modalContent1.style.display = "none";
          animate();
        } else {
          modalContent1.style.display = "flex";
        }
        break;
    }
  }
});
