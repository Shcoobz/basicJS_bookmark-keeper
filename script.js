/**
 * Manages the state and interactions of the bookmarking application.
 * Provides functionalities to display a modal for adding new bookmarks,
 * store bookmarks in the local storage, validate bookmark URLs,
 * and dynamically update the UI with stored bookmarks.
 */

/**
 * @type {Object.<string, HTMLElement>} Elements - Stores references to key DOM elements for easy access.
 */
const elements = {
  modal: document.getElementById('modal'),
  showModalBtn: document.getElementById('show-modal'),
  closeModalBtn: document.getElementById('close-modal'),
  bookmarkForm: document.getElementById('bookmark-form'),
  websiteNameEl: document.getElementById('website-name'),
  websiteUrlEl: document.getElementById('website-url'),
  bookmarksContainer: document.getElementById('bookmarks-container'),
};

/**
 * @type {Object} bookmarks - Stores the current bookmarks as a collection of objects.
 */
let bookmarks = {};

/**
 * Displays the bookmark modal and focuses on the website name input field.
 */
function showModal() {
  elements.modal.classList.add('show-modal');
  elements.websiteNameEl.focus();
}

/**
 * Hides the bookmark modal.
 */
function closeModal() {
  elements.modal.classList.remove('show-modal');
}

/**
 * Validates the provided website name and URL.
 * @param {string} nameValue - The name of the website to be bookmarked.
 * @param {string} urlValue - The URL of the website to be bookmarked.
 * @returns {boolean} - True if both values are valid, otherwise false.
 */
function validateForm(nameValue, urlValue) {
  const regex = /^(https?):\/\/[^\s$.?#].[^\s]*$/;
  if (!nameValue || !urlValue) {
    alert('Please submit values for both fields.');
    return false;
  }
  if (!regex.test(urlValue)) {
    alert('Please provide a valid web address.');
    return false;
  }
  return true;
}

/**
 * Builds and displays bookmarks by dynamically creating and appending elements.
 */
function buildBookmarks() {
  // Clears the bookmarks container
  elements.bookmarksContainer.textContent = '';

  // Iterates over bookmarks to create and append elements
  Object.keys(bookmarks).forEach((id) => {
    const { name, url } = bookmarks[id];
    const item = createElement('div', 'item');
    const closeIcon = createCloseIcon(id);
    const linkInfo = createElement('div', 'name');
    const favicon = createFavicon(url);
    const link = createLink(name, url);

    // Constructs the bookmark item structure
    linkInfo.append(favicon, link);
    item.append(closeIcon, linkInfo);
    elements.bookmarksContainer.appendChild(item);
  });
}

/**
 * Creates a DOM element with the specified tag and classes.
 * @param {string} tag - The tag name of the element to create.
 * @param {string} classes - The class(es) to add to the element.
 * @returns {HTMLElement} The created element.
 */
function createElement(tag, classes) {
  const element = document.createElement(tag);
  element.className = classes; // This assumes 'classes' is a string; adjust if multiple classes are needed.
  return element;
}

/**
 * Creates the close icon for a bookmark.
 * @param {string} id - The identifier for the bookmark.
 * @returns {HTMLElement} The close icon element.
 */
function createCloseIcon(id) {
  const icon = createElement('i', 'fas fa-times');
  icon.setAttribute('title', 'Delete Bookmark');
  icon.setAttribute('onclick', `deleteBookmark('${id}')`);
  return icon;
}

/**
 * Creates a favicon image element for a bookmark.
 * @param {string} url - The URL of the bookmark to get the favicon for.
 * @returns {HTMLElement} The favicon image element.
 */
function createFavicon(url) {
  const favicon = createElement('img', '');
  favicon.setAttribute(
    'src',
    `https://s2.googleusercontent.com/s2/favicons?domain=${url}`
  );
  favicon.setAttribute('alt', 'Favicon');
  return favicon;
}

/**
 * Creates a link element for a bookmark.
 * @param {string} name - The name of the bookmark.
 * @param {string} url - The URL of the bookmark.
 * @returns {HTMLElement} The link element.
 */
function createLink(name, url) {
  const link = createElement('a', '');
  link.setAttribute('href', url);
  link.setAttribute('target', '_blank');
  link.textContent = name;
  return link;
}

/**
 * Fetches bookmarks from local storage and updates the UI accordingly.
 */
function fetchBookmarks() {
  bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || {};
  if (Object.keys(bookmarks).length === 0) {
    bookmarks['https://shcoobz.github.io/'] = {
      name: 'Shcoobz Portfolio',
      url: 'https://shcoobz.github.io/',
    };
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }
  buildBookmarks();
}

/**
 * Handles the bookmark form submission, storing a new bookmark.
 * @param {Event} event - The form submission event.
 */
function storeBookmark(event) {
  event.preventDefault();
  const nameValue = elements.websiteNameEl.value;
  let urlValue = elements.websiteUrlEl.value;

  if (!/^https?:\/\//i.test(urlValue)) {
    urlValue = `https://${urlValue}`;
  }

  if (!validateForm(nameValue, urlValue)) return;

  bookmarks[urlValue] = { name: nameValue, url: urlValue };
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  fetchBookmarks();
  elements.bookmarkForm.reset();
  elements.websiteNameEl.focus();
}

/**
 * Deletes a bookmark from the local storage and updates the UI.
 * @param {string} id - The ID (URL) of the bookmark to delete.
 */
function deleteBookmark(id) {
  if (bookmarks[id]) {
    delete bookmarks[id];
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
  }
}

/**
 * Adds event listeners to the DOM elements for handling UI interactions.
 */
function addEventListeners() {
  elements.showModalBtn.addEventListener('click', showModal);
  elements.closeModalBtn.addEventListener('click', closeModal);
  window.addEventListener('click', (event) => {
    if (event.target === elements.modal) closeModal();
  });
  elements.bookmarkForm.addEventListener('submit', storeBookmark);
}

/**
 * Initializes the bookmarking application.
 */
function init() {
  fetchBookmarks();
  addEventListeners();
}

init();
