// 메인 페이지 기능
document.addEventListener('DOMContentLoaded', function() {
    const iframe = document.querySelector('iframe[name="display_area"]');
    const allButton = document.getElementById('all');
    const bestButton = document.getElementById('best');
    const recommendButton = document.getElementById('recommend');
    const memoButton = document.getElementById('memo');
    const locationButton = document.getElementById('location');
    const loginLink = document.getElementById('loginLink');
    const signupLink = document.getElementById('signupLink');
    
    // 버튼 활성화
    allButton.disabled = false;
    bestButton.disabled = false;
    recommendButton.disabled = false;
    memoButton.disabled = false;
    locationButton.disabled = false;
    
    // 로그인 상태 확인
    function checkLoginStatus() {
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        const username = localStorage.getItem('username');
        
        if (isLoggedIn && username) {
            updateLoginStatus(username);
        }
    }
    
    // 로그인 상태 업데이트
    function updateLoginStatus(username) {
        loginLink.textContent = `${username}님`;
        loginLink.href = '#';
        loginLink.onclick = function() {
            if (confirm('로그아웃 하시겠습니까?')) {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('username');
                loginLink.textContent = '로그인';
                loginLink.href = 'login.html';
                loginLink.onclick = null;
                iframe.src = 'images/books.jpg';
                location.reload();
            }
        };
    }
    
    // 메시지 수신 (로그인 완료 시)
    window.addEventListener('message', function(event) {
        if (event.data.type === 'login-success') {
            updateLoginStatus(event.data.username);
        }
    });
    
    // 전체 보기 버튼
    allButton.addEventListener('click', function() {
        iframe.src = 'all_books.html';
    });
    
    // 베스트셀러 버튼
    bestButton.addEventListener('click', function() {
        iframe.src = 'bestseller.html';
    });
    
    // 추천도서 버튼
    recommendButton.addEventListener('click', function() {
        iframe.src = 'recommended.html';
    });
    
    // 지오로케이션 기능
    locationButton.addEventListener('click', function() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function(position) {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    alert(`현재 위치:\n위도: ${latitude}\n경도: ${longitude}`);
                },
                function(error) {
                    alert('위치 정보를 가져올 수 없습니다.');
                }
            );
        } else {
            alert('이 브라우저는 위치 서비스를 지원하지 않습니다.');
        }
    });
    
    // 메모 기능
    memoButton.addEventListener('click', function() {
        const memo = prompt('메모 내용을 입력하세요:');
        if (memo) {
            let memos = JSON.parse(localStorage.getItem('memos') || '[]');
            memos.push({
                content: memo,
                date: new Date().toLocaleString()
            });
            localStorage.setItem('memos', JSON.stringify(memos));
            alert('메모가 저장되었습니다.');
        }
    });
    
    // 초기 로그인 상태 확인
    checkLoginStatus();
});