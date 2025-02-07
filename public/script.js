function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Login successful") {
        sessionStorage.setItem("role", data.role);
        sessionStorage.setItem("username", data.username);
        window.location.href = "dashboard.html";
      } else {
        alert(data.message);
      }
    })
    .catch((error) => console.error("Error:", error));
}

function signup() {
  const username = document.getElementById("signup-username").value;
  const password = document.getElementById("signup-password").value;
  const role = document.getElementById("signup-role").value;

  fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role }),
  })
    .then((response) => response.json())
    .then((data) => alert(data.message))
    .catch((error) => console.error("Error:", error));
}

function fetchBooks() {
  fetch("/api/books")
    .then((response) => response.json())
    .then((data) => {
      const bookList = document.getElementById("book-list");
      if (!bookList) {
        console.error("Error: book-list element not found");
        return;
      }
      bookList.innerHTML = "";
      data.forEach((book) => {
        const bookItem = document.createElement("li");
        bookItem.textContent = `${book.title} by ${book.author} - ${book.category} [${book.status}]`;
        bookItem.className = "p-2 border-b";
        bookList.appendChild(bookItem);
      });
    })
    .catch((error) => console.error("Error fetching books:", error));
}

// Ensure books are fetched when the page loads
document.addEventListener("DOMContentLoaded", fetchBooks);
