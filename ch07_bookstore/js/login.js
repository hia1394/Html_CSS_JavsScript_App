// 로그인 처리
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const loginButton = document.getElementById('login_button');
    const resetButton = document.getElementById('reset');
    
    // 입력 필드 검증
    function validateLogin() {
        const username = usernameInput.value.trim();
        const password = passwordInput.value;
        
        loginButton.disabled = !(username.length >= 3 && password.length >= 3);
        resetButton.disabled = false;
    }
    
    // 입력 필드 변경 시 검증
    [usernameInput, passwordInput].forEach(input => {
        input.addEventListener('input', validateLogin);
    });
    
    // 폼 제출 처리
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (!loginButton.disabled) {
            const username = usernameInput.value.trim();
            const password = passwordInput.value;
            
            // 로그인 검증
            if (username === 'admin' && password === 'admin123') {
                // 로그인 성공 처리
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                
                // 부모 창에 로그인 성공 메시지 전송
                if (window.parent !== window) {
                    window.parent.postMessage({
                        type: 'login-success', 
                        username: username
                    }, '*');
                }
                
                // 로그인 후 표시할 화면 로드
                window.parent.document.getElementsByName('display_area')[0].src = 'admin_dashboard.html';
            } else {
                alert('아이디 또는 비밀번호가 올바르지 않습니다.');
                passwordInput.value = '';
                passwordInput.focus();
            }
        }
    });
    
    // 취소 버튼 처리
    resetButton.addEventListener('click', function() {
        form.reset();
        validateLogin();
    });
    
    // 초기 검증
    validateLogin();
});