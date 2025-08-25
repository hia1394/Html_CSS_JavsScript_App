// order_process.js

// 폼 제출을 처리하는 함수
function processOrder(event) {
    // 기본 제출 동작 방지
    event.preventDefault();
    
    // 폼 데이터 가져오기
    const formData = new FormData(event.target);
    const orderData = {};
    
    // FormData를 일반 객체로 변환
    for (const [key, value] of formData.entries()) {
      orderData[key] = value;
    }
    
    // 주문 번호 생성 (현재 날짜/시간 기반)
    const orderNumber = 'ORD-' + Date.now().toString().slice(-8);
    
    // 결제 처리 시뮬레이션 (실제 환경에서는 서버단에서 처리)
    const isPaymentSuccessful = Math.random() > 0.1; // 90% 확률로 성공
    
    if (isPaymentSuccessful) {
      // 주문 처리 성공 시 결과 화면 표시
      displayOrderConfirmation(orderData, orderNumber);
    } else {
      // 주문 처리 실패 시 에러 메시지 표시
      displayErrorMessage();
    }
  }
  
  // 주문 확인 화면 표시
  function displayOrderConfirmation(orderData, orderNumber) {
    // 원래 폼 숨기기
    const formContainer = document.querySelector('.form-container');
    formContainer.style.display = 'none';
    
    // 배송 방법 텍스트 결정
    let shippingMethod = '일반 배송 (무료)';
    if (orderData.shipping === '3000') {
      shippingMethod = '빠른 배송';
    } else if (orderData.shipping === '5000') {
      shippingMethod = '당일 배송';
    }
    
    // 상품 가격과 배송비 계산
    const price = parseFloat(orderData.price);
    const quantity = parseInt(orderData.quantity);
    const shipping = parseFloat(orderData.shipping);
    const subtotal = price * quantity;
    const total = subtotal + shipping;
    
    // 주문 확인 컨테이너 생성
    const confirmationContainer = document.createElement('div');
    confirmationContainer.className = 'confirmation-container';
    confirmationContainer.innerHTML = `
      <div class="confirmation-header">
        <h2>주문이 완료되었습니다!</h2>
        <p class="order-number">주문번호: <strong>${orderNumber}</strong></p>
      </div>
      
      <div class="order-summary">
        <h3>주문 정보</h3>
        <table class="order-details">
          <tr>
            <td>고객명:</td>
            <td>${orderData.customer}</td>
          </tr>
          <tr>
            <td>제품명:</td>
            <td>${orderData.product}</td>
          </tr>
          <tr>
            <td>가격:</td>
            <td>${parseInt(price).toLocaleString()}원</td>
          </tr>
          <tr>
            <td>수량:</td>
            <td>${quantity}개</td>
          </tr>
          <tr>
            <td>배송 방법:</td>
            <td>${shippingMethod}</td>
          </tr>
          <tr class="subtotal">
            <td>상품 금액:</td>
            <td>${subtotal.toLocaleString()}원</td>
          </tr>
          <tr class="shipping">
            <td>배송비:</td>
            <td>${shipping.toLocaleString()}원</td>
          </tr>
          <tr class="total">
            <td>총 결제금액:</td>
            <td><strong>${total.toLocaleString()}원</strong></td>
          </tr>
        </table>
      </div>
      
      <div class="confirmation-footer">
        <p>이메일로 주문 확인서가 발송되었습니다.</p>
        <button id="newOrderBtn" class="btn-primary">새 주문하기</button>
      </div>
    `;
    
    // 스타일 적용
    applyConfirmationStyles();
    
    // 문서에 추가
    document.body.appendChild(confirmationContainer);
    
    // 새 주문 버튼에 이벤트 리스너 추가
    document.getElementById('newOrderBtn').addEventListener('click', () => {
      // 확인 화면 제거
      confirmationContainer.remove();
      // 폼 초기화 및 다시 표시
      document.getElementById('orderForm').reset();
      calculateTotal(); // 총액 재계산
      formContainer.style.display = 'block';
    });
  }
  
  // 에러 메시지 표시
  function displayErrorMessage() {
    const formContainer = document.querySelector('.form-container');
    
    // 에러 메시지 요소 생성
    const errorMessage = document.createElement('div');
    errorMessage.className = 'error-message';
    errorMessage.innerHTML = `
      <h3>주문 처리 중 오류가 발생했습니다</h3>
      <p>잠시 후 다시 시도해주세요.</p>
      <button id="retryBtn" class="btn-retry">다시 시도</button>
    `;
    
    // 폼 아래에 에러 메시지 추가
    formContainer.appendChild(errorMessage);
    
    // 재시도 버튼 이벤트 처리
    document.getElementById('retryBtn').addEventListener('click', () => {
      errorMessage.remove();
    });
  }
  
  // 확인 화면용 스타일 적용
  function applyConfirmationStyles() {
    const style = document.createElement('style');
    style.textContent = `
      .confirmation-container {
        max-width: 600px;
        margin: 30px auto;
        background-color: #f8f9fa;
        border-radius: 8px;
        padding: 25px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        animation: fadeIn 0.5s ease-out;
      }
      
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      .confirmation-header {
        text-align: center;
        margin-bottom: 25px;
        padding-bottom: 15px;
        border-bottom: 1px solid #e9ecef;
      }
      
      .confirmation-header h2 {
        color: #28a745;
        margin-bottom: 10px;
      }
      
      .order-number {
        font-size: 1.1em;
        color: #495057;
      }
      
      .order-summary h3 {
        color: #343a40;
        margin-bottom: 15px;
      }
      
      .order-details {
        width: 100%;
        border-collapse: collapse;
      }
      
      .order-details tr {
        border-bottom: 1px solid #e9ecef;
      }
      
      .order-details td {
        padding: 12px 5px;
      }
      
      .order-details td:first-child {
        width: 40%;
        font-weight: 500;
        color: #495057;
      }
      
      .subtotal, .shipping {
        background-color: #f1f3f5;
      }
      
      .total {
        font-size: 1.1em;
        background-color: #e9ecef;
      }
      
      .confirmation-footer {
        margin-top: 25px;
        text-align: center;
      }
      
      .btn-primary {
        background-color: #4CAF50;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 12px 20px;
        font-size: 16px;
        cursor: pointer;
        margin-top: 10px;
        transition: background-color 0.3s;
      }
      
      .btn-primary:hover {
        background-color: #45a049;
      }
      
      .error-message {
        margin-top: 20px;
        padding: 15px;
        background-color: #f8d7da;
        border: 1px solid #f5c6cb;
        border-radius: 4px;
        color: #721c24;
        text-align: center;
      }
      
      .btn-retry {
        background-color: #dc3545;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 8px 15px;
        font-size: 14px;
        cursor: pointer;
        margin-top: 10px;
      }
      
      .btn-retry:hover {
        background-color: #c82333;
      }
    `;
    
    document.head.appendChild(style);
  }
  
  // HTML 문서에 필요한 수정사항
  
  // 1. HTML의 form 태그 수정 (PHP 대신 JavaScript 이벤트 핸들러 사용)
  // <form id="orderForm" onsubmit="processOrder(event)">
  
  // 2. 이 스크립트를 HTML 문서에 포함
  // <script src="order_process.js"></script>