// app.js (ES module)
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc, updateDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";

// Paste your firebaseConfig here or import from firebase-config.js
const firebaseConfig = {
  apiKey: "AIzaSyAPa4tg141ENplEBPWvoeX-GDx56mE3Ct4",
  authDomain: "book-management-b48bc.firebaseapp.com",
  projectId: "book-management-b48bc"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const booksCol = collection(db, 'books');

const addForm = document.getElementById('addForm');
const booksGrid = document.getElementById('booksGrid');

// Add book
addForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value.trim();
  const author = document.getElementById('author').value.trim();
  const price = parseFloat(document.getElementById('price').value);
  const image = document.getElementById('image').value.trim();
  if (!title || !author || isNaN(price)) return alert('Fill required fields');
  await addDoc(booksCol, { title, author, price, coverImageURL: image, createdAt: serverTimestamp() });
  addForm.reset();
});

// Real-time listener - re-render on any change
onSnapshot(booksCol, (snapshot) => {
  booksGrid.innerHTML = '';
  snapshot.forEach(docSnap => {
    const book = { id: docSnap.id, ...docSnap.data() };
    booksGrid.appendChild(createCard(book));
  });
});

// createCard DOM
function createCard(book) {
  const card = document.createElement('div');
  card.className = 'bg-white rounded shadow p-3 flex flex-col';
  card.innerHTML = `
    <img src="${book.coverImageURL || 'https://via.placeholder.com/150'}" class="h-40 object-cover rounded mb-2" alt="${escapeHtml(book.title)}"/>
    <h3 class="font-medium">${escapeHtml(book.title)}</h3>
    <p class="text-sm text-gray-600">by ${escapeHtml(book.author)}</p>
    <p class="mt-2 font-semibold">₹ ${book.price}</p>
    <div class="mt-auto flex gap-2 pt-3">
      <button data-id="${book.id}" data-action="update" class="px-2 py-1 border rounded">Update Author</button>
      <button data-id="${book.id}" data-action="delete" class="px-2 py-1 border rounded">Delete</button>
      <button data-id="${book.id}" data-action="view" class="px-2 py-1 border rounded">View</button>
    </div>
  `;
  card.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.id, action = btn.dataset.action;
      if (action === 'delete') await deleteDoc(doc(db, 'books', id));
      if (action === 'update') {
        const newAuthor = prompt('New author name', book.author);
        if (newAuthor) await updateDoc(doc(db, 'books', id), { author: newAuthor, updatedAt: serverTimestamp() });
      }
      if (action === 'view') showModal(book);
    });
  });
  return card;
}

function showModal(book) {
  const modal = document.getElementById('modal');
  const content = document.getElementById('modalContent');
  content.innerHTML = `
    <h2 class="text-lg font-medium mb-2">${escapeHtml(book.title)}</h2>
    <p class="text-sm text-gray-600 mb-2">Author: ${escapeHtml(book.author)}</p>
    <p class="mb-2">Price: ₹ ${book.price}</p>
    <img src="${book.coverImageURL || 'https://via.placeholder.com/200'}" class="w-full h-60 object-cover rounded" alt="${escapeHtml(book.title)}"/>
    <div class="mt-3 text-right"><button id="closeModal" class="px-3 py-1 border rounded">Close</button></div>
  `;
  modal.classList.remove('hidden');
  modal.style.display = 'flex';
  document.getElementById('closeModal').onclick = () => { modal.style.display = 'none'; };
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]);
}
