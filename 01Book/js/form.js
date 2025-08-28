
const API_BASE_URL = "http://localhost:8080";


const bookForm = document.querySelector("#bookForm");
const bookTableBody = document.querySelector("#bookTableBody");
const formMessage = document.querySelector("#formMessage");
const submitButton = document.querySelector("#submitButton");
const cancelButton = document.querySelector("#cancelButton");
const formTitle = document.querySelector("#formTitle");


let editingBookId = null; 

document.addEventListener("DOMContentLoaded", () => {
  setFormMode("create");
  loadBooks();
});


function showError(msg) {
  formMessage.style.color = "#c0392b";
  formMessage.textContent = msg;
}
function showInfo(msg) {
  formMessage.style.color = "#2d6a4f";
  formMessage.textContent = msg;
}
function esc(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
function formatDate(d) {
  if (!d) return "";
  return String(d).slice(0, 10);
}


function setFormMode(mode) {
  if (mode === "create") {
    editingBookId = null;
    formTitle.textContent = "도서 등록";
    submitButton.textContent = "도서 등록";
    cancelButton.style.display = "none";
    bookForm.reset();
  } else {
    formTitle.textContent = "도서 수정";
    submitButton.textContent = "수정 저장";
    cancelButton.style.display = "inline-block";
  }
}

// ===== 검증 =====
function validateBook(b) {
  if (!b.title) return "제목을 입력하세요.";
  if (!b.author) return "저자를 입력하세요.";
  if (!b.isbn) return "ISBN을 입력하세요.";
  if (!/^\d{10}(\d{3})?$/.test(b.isbn)) return "ISBN은 10자리 또는 13자리 숫자여야 합니다.";
  if (b.price === "" || b.price == null) return "가격을 입력하세요.";
  if (!/^\d+$/.test(String(b.price))) return "가격은 0 이상의 정수입니다.";
  if (!b.publishDate) return "출판일을 선택하세요.";
  return null;
}

// ===== 목록 조회 =====
async function loadBooks() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/books`, { method: "GET" });
    if (!res.ok) throw new Error(`목록 조회 실패: ${res.status}`);
    const books = await res.json();
    renderBookTable(books);
  } catch (e) {
    console.error(e);
    showError("도서 목록을 불러오지 못했습니다.");
    renderBookTable([]);
  }
}

function renderBookTable(books = []) {
  bookTableBody.innerHTML = "";
  books.forEach((b) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${esc(b.title)}</td>
      <td>${esc(b.author)}</td>
      <td>${esc(b.isbn)}</td>
      <td>${Number(b.price).toLocaleString("ko-KR")}</td>
      <td>${esc(formatDate(b.publishDate))}</td>
      <td>
        <button type="button" onclick="editBook(${b.id})">수정</button>
        <button type="button" class="btn-secondary" onclick="deleteBook(${b.id})">삭제</button>
      </td>
    `;
    bookTableBody.appendChild(tr);
  });
}


bookForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  formMessage.textContent = "";

  const fd = new FormData(bookForm);
  const book = {
    title: (fd.get("title") || "").trim(),
    author: (fd.get("author") || "").trim(),
    isbn: (fd.get("isbn") || "").replace(/[-\s]/g, "").trim(),
    price: (fd.get("price") || "").trim(),
    publishDate: fd.get("publishDate") || ""
  };

  const err = validateBook(book);
  if (err) return showError(err);

  try {
    if (editingBookId == null) {
      await createBook(book);
      setFormMode("create");
      showInfo("도서가 등록되었습니다.");
    } else {
      await updateBook(editingBookId, book);
      setFormMode("create");
      showInfo("도서가 수정되었습니다.");
    }
    await loadBooks();
  } catch (e) {
    console.error(e);
    showError(e.message || "요청 처리 중 오류가 발생했습니다.");
  }
});


cancelButton.addEventListener("click", () => {
  setFormMode("create");
  showInfo("수정을 취소했습니다.");
});


async function createBook(bookData) {
  const res = await fetch(`${API_BASE_URL}/api/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookData),
  });
  if (!res.ok) {
    const msg = await safeErrorMessage(res);
    throw new Error(`등록 실패: ${msg}`);
  }
  return res.json();
}


async function deleteBook(bookId) {
  if (!confirm("이 도서를 삭제하시겠습니까?")) return;
  try {
    const res = await fetch(`${API_BASE_URL}/api/books/${bookId}`, {
      method: "DELETE",
    });
    if (!res.ok) {
      const msg = await safeErrorMessage(res);
      throw new Error(`삭제 실패: ${msg}`);
    }
    showInfo("도서가 삭제되었습니다.");

    await loadBooks();

    if (editingBookId === bookId) setFormMode("create");
  } catch (e) {
    console.error(e);
    showError(e.message || "삭제 중 오류가 발생했습니다.");
  }
}


async function editBook(bookId) {
  try {
    const res = await fetch(`${API_BASE_URL}/api/books/${bookId}`, {
      method: "GET",
    });
    if (!res.ok) {
      const msg = await safeErrorMessage(res);
      throw new Error(`조회 실패: ${msg}`);
    }
    const b = await res.json();

    document.getElementById("title").value = b.title ?? "";
    document.getElementById("author").value = b.author ?? "";
    document.getElementById("isbn").value = b.isbn ?? "";
    document.getElementById("price").value = b.price ?? "";
    document.getElementById("publishDate").value = formatDate(b.publishDate);

    editingBookId = b.id;
    setFormMode("update");
    showInfo("수정 모드로 전환되었습니다.");
  } catch (e) {
    console.error(e);
    showError(e.message || "도서 정보를 불러오지 못했습니다.");
  }
}


async function updateBook(bookId, bookData) {
  const res = await fetch(`${API_BASE_URL}/api/books/${bookId}`, {
    method: "PUT", 
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookData),
  });
  if (!res.ok) {
    const msg = await safeErrorMessage(res);
    throw new Error(`수정 실패: ${msg}`);
  }
  return res.json();
}


async function safeErrorMessage(res) {
  try {
    const data = await res.json();
    return data?.message || `${res.status}`;
  } catch {
    return `${res.status}`;
  }
}
