//API Calls

const apiUrl = "http://localhost:3000";

async function fetchBooks() {
  const response = await (await fetch(`${apiUrl}/api/books`)).json();
  console.log(response)
  response.forEach(function (book) {
    book.image = "rptgtpxd.jpg";
  });
  return response;
}

async function createCustomer(payload) {
  const response = await (
    await fetch(`${apiUrl}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
  ).text();
  alert(response);
}

// Main logic
document.addEventListener("DOMContentLoaded", async function () {
  const featuredBooks = await fetchBooks();

  featuredBooks.forEach(function (bookSet) {
    var section = createFeaturedSection([bookSet]);
    mainElement.appendChild(section);
  });

  // Get the modal
  var signupModal = document.getElementById("signup-modal");
  var signinModal = document.getElementById("signin-modal");

  // Get the buttons that open the modals
  var signupBtn = document.getElementById("signup-btn");
  var signinBtn = document.getElementById("signin-btn");
  var signupSubmitBtn = document.getElementById("signup-submit-btn");

  // Get the <span> elements that close the modals
  var closeBtns = document.querySelectorAll(".close");

  // When the user clicks the buttons, open the corresponding modal
  signupBtn.addEventListener("click", function () {
    signupModal.style.display = "block";
  });

  signinBtn.addEventListener("click", function () {
    signinModal.style.display = "block";
  });

  signupSubmitBtn.addEventListener("click", function () {
    createCustomer({
      username: document.querySelector("#username").value,
      firstname: document.querySelector("#name").value,
      lastname: document.querySelector("#surname").value,
      password: document.querySelector("#password").value,
      email: document.querySelector("#email").value,
      address: document.querySelector("#address").value,
      phone: document.querySelector("#phone").value,
    });
  });

  // When the user clicks on <span> (x), close the modals
  closeBtns.forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (btn.parentElement.parentElement === signupModal) {
        signupModal.style.display = "none";
      } else if (btn.parentElement.parentElement === signinModal) {
        signinModal.style.display = "none";
      }
    });
  });

  // When the user clicks anywhere outside of the modal, close it
  window.addEventListener("click", function (event) {
    if (event.target == signupModal) {
      signupModal.style.display = "none";
    } else if (event.target == signinModal) {
      signinModal.style.display = "none";
    }
  });

  var showMoreButtons = document.querySelectorAll(".showmore-button");
  showMoreButtons.forEach(function (button, index) {
    // Generate the modal for each book
    button.addEventListener("click", function () {
      var showModal = document.createElement("div");
      showModal.classList.add("modal");
      showModal.innerHTML = `
          <div class="modal-content">
            <span class="close">&times;</span>
            <h2>${button.parentElement.querySelector("h3").textContent}</h2>
            <p>Price: $${featuredBooks[index].price}</p>
            <p>Quantity: ${featuredBooks[index].stockquantity}</p>
            <p>Publish date: ${featuredBooks[index].publisheddate}</p>

            <button href="www.google.com" target="_blank" class="buy-button">Buy</button>
          </div>
        `;
      document.body.appendChild(showModal);
      showModal.style.display = "block";

      // Close the modal when the close button is clicked
      var closeButton = showModal.querySelector(".close");
      closeButton.addEventListener("click", function () {
        showModal.remove();
      });

      // Add event listener to the "Show" button
      var showButton = showModal.querySelector(".buy-button");
      const buyBookUrl = `${apiUrl}/buy/${featuredBooks[index].bookid}`;
      showButton.addEventListener("click", async function () {
        // Open BUY BOOK in new tab
        const html = await (await fetch(buyBookUrl)).text();
        var newTab = window.open(buyBookUrl);
        // newTab.document.location.href = buyBookUrl;
        newTab.history.replaceState({}, "", buyBookUrl);
        newTab.document.write(html);
      });
    });
  });
});

function createBookElement(book) {
  var bookElement = document.createElement("div");
  bookElement.classList.add("book");

  var imgContainer = document.createElement("div");
  imgContainer.classList.add("book-image");
  var img = document.createElement("img");
  img.src = book.image;
  img.alt = book.title;
  imgContainer.appendChild(img);

  var bookInfo = document.createElement("div");
  bookInfo.classList.add("book-info");
  var h3 = document.createElement("h3");
  h3.textContent = book.title;
  bookInfo.appendChild(h3);

  var showMoreButton = document.createElement("button");
  showMoreButton.textContent = "Show More";
  showMoreButton.classList.add("showmore-button");
  bookInfo.appendChild(showMoreButton);

  bookElement.appendChild(imgContainer);
  bookElement.appendChild(bookInfo);

  return bookElement;
}

function createFeaturedSection(books) {
  var section = document.createElement("section");
  section.classList.add("featured-section");

  var featuredBooksDiv = document.createElement("div");
  featuredBooksDiv.classList.add("featured-books");

  books.forEach(function (book) {
    var bookElement = createBookElement(book);
    featuredBooksDiv.appendChild(bookElement);
  });

  section.appendChild(featuredBooksDiv);

  return section;
}

var mainElement = document.querySelector("main");
