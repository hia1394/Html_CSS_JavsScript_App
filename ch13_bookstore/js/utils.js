// 공통 유틸리티 함수들
const Utils = {
    // 숫자 포맷팅
    formatNumber: function(num) {
        return num.toLocaleString();
    },
    
    // 날짜 포맷팅
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('ko-KR');
    },
    
    // 이메일 검증
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // 전화번호 검증
    validatePhone: function(phone) {
        const re = /^[0-9]{3}-[0-9]{4}-[0-9]{4}$/;
        return re.test(phone);
    },
    
    // 쿠키 설정
    setCookie: function(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    },
    
    // 쿠키 가져오기
    getCookie: function(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    
    // 로컬 스토리지 관리
    storage: {
        set: function(key, value) {
            localStorage.setItem(key, JSON.stringify(value));
        },
        get: function(key) {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        },
        remove: function(key) {
            localStorage.removeItem(key);
        },
        clear: function() {
            localStorage.clear();
        }
    }
};

// 전역 이벤트 리스너
document.addEventListener('DOMContentLoaded', function() {
    // 모든 입력 필드에 포커스 효과 추가
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // 자동 저장 기능 (폼 필드)
    const formFields = document.querySelectorAll('input[type="text"], input[type="email"], textarea');
    formFields.forEach(field => {
        field.addEventListener('blur', function() {
            if (this.value) {
                Utils.storage.set(`draft_${this.id}`, this.value);
            }
        });
        
        // 페이지 로드시 임시저장 내용 복원
        const draftValue = Utils.storage.get(`draft_${field.id}`);
        if (draftValue && !field.value) {
            field.value = draftValue;
        }
    });
});