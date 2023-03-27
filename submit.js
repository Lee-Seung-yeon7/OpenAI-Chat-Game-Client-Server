// Select DOM elements
const terminal = document.querySelector(".terminal");
const terminalText = document.querySelector(".terminal-text");
const form = document.querySelector("form");
const userInput = document.querySelector("#user-input");
const buttons = document.querySelectorAll(".button-container button");
let gameType = "mystery";

const games = {
  rpg: {
    message:
      "<p>Knight's Mentor: Hark ye! Be ready for a wondrous RPG quest in The Kingdom of Aranthia. Discover vast world with thrilling quests and curious folk. Your choices will shape thy fate. So go forth and embrace thy destiny!</p>",
    prefix: "Knight: ",
  },
  mystery: {
    message:
      "<p>Patron: Mr. Stevens has been murdered! I saw someone running, but I couldn't see them very well. The only people who were around Mr. Stevens were his butler, his housekeeper, his gardener, and his friend. Please, you must help find out who did the crime.</p>",
    prefix: "Investigator: ",
  },
  escape: {
    message:
      "<p>Guide: Welcome and congratulations on making it this far. I am the escape room game, and I hold the key to your freedom. Ask me anything you'd like about the room and its mysteries, and I'll do my best to guide you towards the exit. Are you ready to begin?</p>",
    prefix: "You: ",
  },
};

function selectGame(game) {
  terminalText.innerHTML = games[game].message;
  gameType = game;
  userInput.focus();
  scrollToBottom();
}

buttons.forEach((button, index) => {
  button.addEventListener("click", () => {
    selectGame(["mystery", "rpg", "escape"][index]);
  });
});

userInput.focus();

// Scroll the terminal to the bottom
function scrollToBottom() {
  terminal.scrollTop = terminal.scrollHeight;
}

// Print a text reply letter by letter
function printTextReply(reply) {
  const speaker =
    gameType === "mystery"
      ? "Patron"
      : gameType === "rpg"
      ? "Knight's Mentor"
      : "Guide";
  terminalText.insertAdjacentHTML("beforeend", `${speaker}: `);
  let i = 0;
  const intervalId = setInterval(() => {
    // Print each letter of the reply
    terminalText.insertAdjacentHTML("beforeend", reply[i]);
    scrollToBottom();
    i++;
    // Stop the interval when the whole reply has been printed
    if (i === reply.length) {
      clearInterval(intervalId);
    }
  }, 40);
}

// Handle the form submission
form.addEventListener("submit", (event) => {
  const previousChat = terminalText.innerHTML;
  event.preventDefault();
  const input = userInput.value;
  // Do not do anything if the input is empty
  if (input === "") return;

  // Add user's input to the terminal
  const prefix =
    games[gameType ? "mystery" : gameType ? "rpg" : "escape"].prefix;
  const userMessage = `<p>${prefix}${input}</p>`;
  terminalText.insertAdjacentHTML("beforeend", userMessage);
  scrollToBottom();
  // Clear user input
  userInput.value = "";

  // Send user's input to the server and get response from ChatGPT
  const data = {
    userInput: input,
    previousChat: previousChat,
    gameType: gameType,
  };
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };
  fetch("http://localhost:8000/chat", {
    method: "POST",
    headers: headers,
    body: new URLSearchParams(data),
  })
    .then((response) => response.text())
    .then((data) => {
      // Add ChatGPT's response to the terminal
      const chatGPTMessage = `${JSON.parse(data).choices[0].message.content}`;
      printTextReply(chatGPTMessage);
      scrollToBottom();
    })
    .catch((error) => console.error(error));
});
