// 주문 처리
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const quantityInputs = form.querySelectorAll('input[type="text"][size="2"]');
    const totalInputs = form.querySelectorAll('input[type="text"][size="6"]');
    const calculateButton = form.querySelector('input[value="합계계산"]');
    const resetButton = form.querySelector('input[type="reset"]');
    const submitButton = form.querySelector('input[type="submit"]');
    
    // 책 가격 정보
    const bookPrices = [25000, 24000, 28000];
    
    // 수량 변경 시 자동 계산
    quantityInputs.forEach((input, index) => {
        if (index < bookPrices.length) {
            input.addEventListener('input', function() {
                const quantity = parseInt(this.value) || 0;
                const total = quantity * bookPrices[index];
                totalInputs[index].value = total.toLocaleString();
                calculateTotal();
            });
        }
    });
    
    // 전체 합계 계산
    function calculateTotal() {
        let totalQuantity = 0;
        let totalAmount = 0;
        
        quantityInputs.forEach((input, index) => {
            if (index < bookPrices.length) {
                const quantity = parseInt(input.value) || 0;
                totalQuantity += quantity;
                totalAmount += quantity * bookPrices[index];
            }
        });
        
        // 마지막 행에 합계 표시
        if (quantityInputs.length > bookPrices.length) {
            quantityInputs[quantityInputs.length - 1].value = totalQuantity;
            totalInputs[totalInputs.length - 1].value = totalAmount.toLocaleString();
        }
        
        // 주문 버튼 활성화 (총 수량이 0보다 클 때)
        submitButton.disabled = totalQuantity === 0;
    }
    
    // 합계계산 버튼
    calculateButton.addEventListener('click', function() {
        calculateTotal();
        calculateButton.disabled = true;
    });
    
    // 초기화 버튼
    resetButton.addEventListener('click', function() {
        quantityInputs.forEach(input => input.value = '0');
        totalInputs.forEach(input => input.value = '0');
        submitButton.disabled = true;
        calculateButton.disabled = false;
    });
    
    // 폼 제출 처리
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const orderData = {
            items: [],
            totalQuantity: 0,
            totalAmount: 0
        };
        
        const bookTitles = [
            '멀티미디어 배움터2.0',
            '(알기 쉬운) 알고리즘',
            '비즈니스 정보 시스템'
        ];
        
        quantityInputs.forEach((input, index) => {
            if (index < bookPrices.length) {
                const quantity = parseInt(input.value) || 0;
                if (quantity > 0) {
                    orderData.items.push({
                        title: bookTitles[index],
                        price: bookPrices[index],
                        quantity: quantity,
                        total: quantity * bookPrices[index]
                    });
                    orderData.totalQuantity += quantity;
                    orderData.totalAmount += quantity * bookPrices[index];
                }
            }
        });
        
        console.log('주문 데이터:', orderData);
        
        // 주문 확인
        if (orderData.items.length > 0) {
            const orderSummary = orderData.items.map(item => 
                `${item.title}: ${item.quantity}권 - ${item.total.toLocaleString()}원`
            ).join('\n');
            
            const confirmed = confirm(
                `다음 내용으로 주문하시겠습니까?\n\n${orderSummary}\n\n총 ${orderData.totalQuantity}권 - ${orderData.totalAmount.toLocaleString()}원`
            );
            
            if (confirmed) {
                alert('주문이 완료되었습니다!');
                // 실제로는 서버로 주문 데이터를 전송
                form.reset();
                calculateTotal();
            }
        }
    });
    
    // 초기 상태 설정
    submitButton.disabled = true;
    calculateButton.disabled = false;
});