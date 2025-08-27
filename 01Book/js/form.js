// 전역변수(사진 조건): API 베이스 경로
const API_BASE_URL = "http://localhost:8080";

// DOM 참조
const $form = document.getElementById("bookForm");
const $msg = document.getElementById("formMessage");
const $tbody = document.getElementById("bookTableBody");

// 유틸: FormData → 평범한 객체
function formDataToObject(fd) {
  const obj = {};
  for (const [k, v] of fd.entries()) obj[k] = v?.toString().trim();
  return obj;
}

/**
 * 입력 데이터 검증 (사진 조건 1-5.1: validateBook 함수 작성)
 * - 제목/저자/ISBN/가격/출판일 필수
 * - 가격: 0 이상의 정수
 * - ISBN: 10자리 또는 13자리 숫자(간단 검증)
 */
function validateBook(book) {
  if (!book.title) return "제목을 입력하세요.";
  if (!book.author) return "저자를 입력하세요.";

  const isbn = (book.isbn || "").replace(/[-\s]/g, "");
  if (!isbn) return "ISBN을 입력하세요.";
  if (!/^\d{10}(\d{3})?$/.test(isbn)) return "ISBN은 10자리 또는 13자리 숫자여야 합니다.";
  book.isbn = isbn; // 정규화

  if (book.price === "" || book.price == null) return "가격을 입력하세요.";
  if (!/^\d+$/.test(String(book.price)) || Number(book.price) < 0) return "가격은 0 이상의 정수입니다.";

  if (!book.publishDate) return "출판일을 선택하세요.";
  return null; // OK
}

/**
 * 서버 통신 (사진 조건 1-5.2)
 * - 목록 조회: GET /api/books
 * - 등록: POST /api/books
 * 서버 스펙에 맞춰 경로 필요시 수정
 */
async function loadBooks() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/books`, { method: "GET" });
    if (!res.ok) throw new Error(`서버 오류: ${res.status}`);
    const books = await res.json();
    renderBookTable(books);
  } catch (err) {
    console.error(err);
    $msg.textContent = "도서 목록을 불러오지 못했습니다.";
  }
}

function renderBookTable(books = []) {
  $tbody.innerHTML = "";
  books.forEach((b) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(b.title)}</td>
      <td>${escapeHtml(b.author)}</td>
      <td>${escapeHtml(b.isbn)}</td>
      <td>${Number(b.price).toLocaleString("ko-KR")}</td>
      <td>${formatDate(b.publishDate)}</td>
    `;
    $tbody.appendChild(tr);
  });
}

// 등록 처리: FormData 사용(사진 조건 1-4)
$form.addEventListener("submit", async (e) => {
  e.preventDefault();
  $msg.textContent = "";

  const fd = new FormData($form);
  const book = formDataToObject(fd);

  // 검증
  const errMsg = validateBook(book);
  if (errMsg) {
    $msg.textContent = errMsg;
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/books`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(book),
    });
    if (!res.ok) throw new Error(`등록 실패: ${res.status}`);

    // 성공 처리
    $form.reset();
    $msg.textContent = "도서가 등록되었습니다.";
    await loadBooks();
  } catch (err) {
    console.error(err);
    $msg.textContent = "도서 등록에 실패했습니다.";
  }
});

// 초기 로딩 시 목록 호출
document.addEventListener("DOMContentLoaded", loadBooks);


function escapeHtml(s) {
  return String(s ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
function formatDate(d) {
  // 서버가 '2025-08-27' 또는 ISO 문자열을 줄 수 있으므로 처리
  if (!d) return "";
  const iso = typeof d === "string" ? d : String(d);
  const onlyDate = iso.slice(0, 10);
  return onlyDate;
}
