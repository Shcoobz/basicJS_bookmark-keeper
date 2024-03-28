const elements = {
  modal: document.getElementById('modal'),
  showModalBtn: document.getElementById('show-modal'),
  closeModalBtn: document.getElementById('close-modal'),
  bookmarkForm: document.getElementById('bookmark-form'),
  websiteNameEl: document.getElementById('website-name'),
  websiteUrlEl: document.getElementById('website-url'),
  bookmarksContainer: document.getElementById('bookmarks-container'),
};

let bookmarks = {};

function showModal() {
  elements.modal.classList.add('show-modal');
  elements.websiteNameEl.focus();
}

function closeModal() {
  elements.modal.classList.remove('show-modal');
}

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

function buildBookmarkItem(id, { name, url }) {
  return `
    <div class="item">
      <i class="fas fa-times" title="Delete Bookmark" onclick="deleteBookmark('${id}')"></i>
      <div class="name">
        <img src="https://s2.googleusercontent.com/s2/favicons?domain=${url}" alt="Favicon">
        <a href="${url}" target="_blank">${name}</a>
      </div>
    </div>
  `;
}

function updateBookmarksUI() {
  elements.bookmarksContainer.innerHTML = Object.entries(bookmarks)
    .map(([id, bookmark]) => buildBookmarkItem(id, bookmark))
    .join('');
}

function fetchBookmarks() {
  bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || {};
  if (Object.keys(bookmarks).length === 0) {
    bookmarks['https://shcoobz.github.io/'] = {
      name: 'Shcoobz Portfolio',
      url: 'https://shcoobz.github.io/',
    };
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }
  updateBookmarksUI();
}

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

function deleteBookmark(id) {
  if (bookmarks[id]) {
    delete bookmarks[id];
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    fetchBookmarks();
  }
}

function addEventListeners() {
  elements.showModalBtn.addEventListener('click', showModal);
  elements.closeModalBtn.addEventListener('click', closeModal);
  window.addEventListener('click', (event) => {
    if (event.target === elements.modal) closeModal();
  });
  elements.bookmarkForm.addEventListener('submit', storeBookmark);
}

function init() {
  fetchBookmarks();
  addEventListeners();
}

init();
