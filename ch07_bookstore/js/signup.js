// 폼 검증 및 제출 처리
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const usernameInput = document.getElementById('username2');
    const password1Input = document.getElementById('pass1');
    const password2Input = document.getElementById('pass2');
    const signupButton = document.getElementById('signup_button');
    const resetButton = document.getElementById('reset2');
    const dupCheckButton = document.getElementById('dup_check');
    
    let isUsernameChecked = false;
    
    // 입력 필드 검증
    function validateForm() {
        const username = usernameInput.value.trim();
        const password1 = password1Input.value;
        const password2 = password2Input.value;
        
        // 사용자 아이디 최소 길이 체크
        if (username.length >= 4) {
            dupCheckButton.disabled = false;
        } else {
            dupCheckButton.disabled = true;
            isUsernameChecked = false;
        }
        
        // 비밀번호 일치 체크
        const passwordsMatch = password1 === password2 && password1.length >= 4;
        
        // 모든 필수 입력 체크
        const allFieldsFilled = checkAllRequiredFields();
        
        // 폼 제출 버튼 활성화 조건
        signupButton.disabled = !(isUsernameChecked && passwordsMatch && allFieldsFilled);
        resetButton.disabled = false;
    }
    
    // 필수 입력 사항 체크
    function checkAllRequiredFields() {
        const requiredFields = form.querySelectorAll('input[required], select[required], textarea[required]');
        return Array.from(requiredFields).every(field => field.value.trim() !== '');
    }
    
    // 중복 체크 기능
    dupCheckButton.addEventListener('click', function() {
        const username = usernameInput.value.trim();
        
        // 실제로는 서버에 요청을 보내야 하지만, 여기서는 임시로 처리
        setTimeout(() => {
            if (username === 'admin' || username === 'test') {
                alert('이미 사용 중인 아이디입니다.');
                isUsernameChecked = false;
            } else {
                alert('사용 가능한 아이디입니다.');
                isUsernameChecked = true;
            }
            validateForm();
        }, 500);
    });
    
    // 입력 필드 변경 시 검증
    [usernameInput, password1Input, password2Input].forEach(input => {
        input.addEventListener('input', function() {
            if (this === usernameInput) {
                isUsernameChecked = false;
            }
            validateForm();
        });
    });
    
    // 폼 제출 처리
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!signupButton.disabled) {
            const formData = new FormData(form);
            
            // 폼 데이터 수집
            const userData = {
                username: usernameInput.value,
                password: password1Input.value,
                name: form.querySelector('input[name="name"]').value,
                phone: form.querySelector('input[name="phone"]').value,
                email: form.querySelector('input[name="email"]').value,
                birthday: form.querySelector('input[name="birthday"]').value,
                age: form.querySelector('select[name="age"]').value,
                interests: Array.from(form.querySelectorAll('input[name="interest"]:checked')).map(cb => cb.value),
                color: form.querySelector('input[name="color"]').value,
                introduction: form.querySelector('textarea[name="introduction"]').value
            };
            
            console.log('회원가입 데이터:', userData);
            
            // 실제로는 여기서 서버로 데이터를 전송
            alert('회원가입이 완료되었습니다!');
            
            // 회원가입 성공 후 처리
            if (window.parent !== window) {
                // iframe에서 열린 경우 부모 창에 메시지 전송
                window.parent.postMessage({
                    type: 'signup-complete',
                    username: userData.username
                }, '*');
                
                // 회원가입 완료 후 로그인 페이지로 이동
                window.parent.document.getElementsByName('display_area')[0].src = 'login.html';
            }
        }
    });
    
    // 취소 버튼 처리
    resetButton.addEventListener('click', function() {
        if (confirm('작성중인 내용을 모두 취소하시겠습니까?')) {
            form.reset();
            isUsernameChecked = false;
            validateForm();
            
            // iframe에서 열린 경우 메인 화면으로 돌아가기
            if (window.parent !== window) {
                window.parent.document.getElementsByName('display_area')[0].src = 'images/books.jpg';
            }
        }
    });
    
    // 초기 검증
    validateForm();
});