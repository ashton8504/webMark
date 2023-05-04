// Toggle Dark/Light mode
const button = document.getElementById("mode-toggle");
button.addEventListener("click", function () {
  document.body.classList.toggle("dark-mode");
  document.body.classList.toggle("light-mode");

  // Update the text of the button based on the current mode
  if (document.body.classList.contains("dark-mode")) {
    button.textContent = "Light Mode";
  } else {
    button.textContent = "Dark Mode";
  }

  // Store the selected mode in local storage
  if (typeof Storage !== "undefined") {
    localStorage.setItem(
      "mode",
      document.body.classList.contains("dark-mode") ? "dark" : "light"
    );
  }
});

// Retrieve the stored mode from local storage and apply it on page load
if (typeof Storage !== "undefined") {
  const storedMode = localStorage.getItem("mode");
  if (storedMode === "dark") {
    document.body.classList.add("dark-mode");
    button.textContent = "Light Mode";
  } else if (storedMode === "light") {
    document.body.classList.add("light-mode");
    button.textContent = "Dark Mode";
  }
}

// Adding URL's to list
// Adding URL's to list
let notificationShown = false;

function addFavorite() {
  let urlInput = document.getElementById("typeURL").value;

  //if user doesnt input a valid website a message will appear
  const websiteInput = document.getElementById("typeURL");
  const websiteUrl = websiteInput.value.trim();

  if (websiteUrl === "") {
    if (!notificationShown) {
      const notification = document.createElement("div");
      notification.classList.add("alert", "alert-primary");
      notification.textContent = "Please enter a website URL";

      const container = document.getElementById("notification-container");
      container.appendChild(notification);

      // Remove the notification after 3 seconds
      setTimeout(() => {
        container.removeChild(notification);
        notificationDisplayed = false;
      }, 1000);
      notificationDisplayed = true;
    }
    return;
  }

  // Add protocol if not provided
  if (!/^https?:\/\//i.test(urlInput)) {
    urlInput = "https://" + urlInput;
  }

  let li = document.createElement("li");
  let a = document.createElement("a");
  let deleteButton = document.createElement("button");
  let img = document.createElement("img");

  a.href = urlInput;
  a.target = "_blank";
  let faviconUrl =
    "https://www.google.com/s2/favicons?sz=64&domain=" + urlInput;
  img.src = faviconUrl;
  img.onerror = function () {
    this.onerror = null;
    this.src = "https://via.placeholder.com/64x64?text=No+Icon";
  };

  img.style.width = "66px";
  img.style.height = "66px";
  a.appendChild(img);
  li.classList.add(
    "list-group-item",
    "list-group-item-action",
    "d-flex",
    "flex-column",
    "align-items-center"
  );
  li.style.padding = "0.75rem 1.25rem";
  li.appendChild(a);

  deleteButton.classList.add(
    "btn",
    "btn-danger",
    "btn-sm",
    "delete-button",
    "mt-2"
  );
  deleteButton.innerHTML = "Delete";
  deleteButton.addEventListener("click", function () {
    li.remove();
    const favorites = getFavorites();
    const filteredFavorites = favorites.filter(
      favorite => favorite.url !== urlInput
    );
    saveFavorites(filteredFavorites);
  });
  li.appendChild(deleteButton);

  document.getElementById("favoriteList").appendChild(li);
  const favorites = getFavorites();
  const newFavorite = { url: urlInput };
  favorites.push(newFavorite);
  saveFavorites(favorites);

  document.getElementById("typeURL").value = "";
}

// This allows users to press enter to submit website
document
  .getElementById("typeURL")
  .addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
      // 13 is the code for the "Enter" key
      event.preventDefault(); // prevent the default behavior of the "Enter" key
      addFavorite(); // call the function to save the website
    }
  });

// Allows user to change order of list
$(function () {
  $("#favoriteList").sortable({
    stop: function () {
      const favorites = [];
      const lis = document.querySelectorAll("#favoriteList li");
      lis.forEach(li => {
        const url = li.querySelector("a").href;
        favorites.push({ url });
      });
      saveFavorites(favorites);
    },
  });

  // load the order of the list items from local storage
  const order = JSON.parse(localStorage.getItem("favoriteOrder"));
  if (order) {
    for (const itemId of order) {
      const item = $(`#${itemId}`);
      if (item.length) {
        item.appendTo($("#favoriteList"));
      }
    }
  }
});

document.addEventListener("DOMContentLoaded", function () {
  const favorites = getFavorites();
  const favoriteList = document.getElementById("favoriteList");

  for (const favorite of favorites) {
    const url = favorite.url;
    const li = document.createElement("li");
    const a = document.createElement("a");
    const deleteButton = document.createElement("button");
    const img = document.createElement("img");

    // Create the anchor tag with the favicon image
    a.href = url;
    a.target = "_blank";
    let faviconUrl = "https://www.google.com/s2/favicons?sz=64&domain=" + url;
    img.src = faviconUrl;
    img.onerror = function () {
      this.onerror = null;
      this.src = "https://via.placeholder.com/64x64?text=No+Icon";
    };
    img.style.borderRadius = "35%";
    img.style.width = "64px";
    img.style.height = "64px";
    a.appendChild(img);
    li.classList.add(
      "list-group-item",
      "list-group-item-action",
      "d-flex",
      "flex-column",
      "align-items-center"
    );
    li.style.padding = "0.75rem 1.25rem";
    li.appendChild(a);

    deleteButton.classList.add(
      "btn",
      "btn-danger",
      "btn-sm",
      "delete-button",
      "mt-2"
    );
    deleteButton.innerHTML = "Delete";
    deleteButton.addEventListener("click", function () {
      li.remove();
      const favorites = getFavorites();
      const filteredFavorites = favorites.filter(
        favorite => favorite.url !== url
      );
      saveFavorites(filteredFavorites);
    });
    li.appendChild(deleteButton);

    favoriteList.appendChild(li);
  }
});

// Function to save favorite websites to localStorage
function saveFavorites(favorites) {
  localStorage.setItem("favorites", JSON.stringify(favorites));
}

// Function to retrieve favorite websites from localStorage
function getFavorites() {
  let favorites = [];
  const savedFavorites = localStorage.getItem("favorites");
  if (savedFavorites) {
    favorites = JSON.parse(savedFavorites);
  }
  return favorites;
}

// !!! GOAL SECTION !!! //
document
  .getElementById("goalInput")
  .addEventListener("keydown", function (event) {
    if (event.keyCode === 13) {
      addGoal();
    }
  });

$(function () {
  $("#goalList").sortable();
  $("#goalList").disableSelection();
});

document.addEventListener("DOMContentLoaded", function () {
  loadGoals();
});

let notificationDisplayed = false;

function addGoal() {
  const goalInput = document.getElementById("goalInput").value;
  document.getElementById("goalInput").value = "";

  if (goalInput.trim() !== "") {
    const goal = {
      id: Date.now(),
      text: goalInput,
    };

    addGoalToUI(goal);
    saveGoal(goal);
  } else {
    if (!notificationDisplayed) {
      const notification = document.createElement("div");
      notification.classList.add("alert", "alert-primary");
      notification.textContent = "Please enter a goal";

      const container = document.getElementById("notification-containerTwo");
      container.appendChild(notification);

      // Remove the notification after 3 seconds
      setTimeout(() => {
        container.removeChild(notification);
        notificationDisplayed = false; // reset notificationDisplayed after removing the notification
      }, 1000);

      notificationDisplayed = true; // set notificationDisplayed to true after displaying the notification
    }
  }
}

function addGoalToUI(goal) {
  const listItem = document.createElement("li");
  listItem.className =
    "list-group-item list-group-item-action d-flex flex-column align-items-center";
  listItem.setAttribute("data-id", goal.id);

  const textElement = document.createElement("span");
  textElement.className = "goal-text";
  textElement.textContent = goal.text;
  listItem.appendChild(textElement);

  const deleteButton = document.createElement("button");
  deleteButton.className = "btn btn-danger btn-sm delete-button";
  deleteButton.innerHTML = "Delete";
  deleteButton.addEventListener("click", function () {
    deleteGoal(goal.id);
    listItem.remove();
  });
  listItem.appendChild(deleteButton);

  document.getElementById("goalList").appendChild(listItem);
}

function saveGoal(goal) {
  let goals = JSON.parse(localStorage.getItem("goals")) || [];
  goals.push(goal);
  localStorage.setItem("goals", JSON.stringify(goals));
}

function loadGoals() {
  let goals = JSON.parse(localStorage.getItem("goals")) || [];
  const goalList = document.getElementById("goalList");
  for (let i = 0; i < goals.length; i++) {
    const goalId = goals[i].id;
    // Check if goal already exists in the UI
    if (!goalList.querySelector(`[data-id='${goalId}']`)) {
      addGoalToUI(goals[i]);
    }
  }
}

function deleteGoal(id) {
  let goals = JSON.parse(localStorage.getItem("goals")) || [];
  goals = goals.filter(goal => goal.id !== id);
  localStorage.setItem("goals", JSON.stringify(goals));
}
