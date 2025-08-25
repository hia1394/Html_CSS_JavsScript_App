// form_app.js - 다양한 HTML 폼 입력 처리 스크립트

// DOM이 완전히 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    // 스타일 적용
    applyStyles();
    
    // URL 파라미터 또는 POST 데이터 가져오기
    const formData = getFormData();
    
    // 데이터 존재 여부 확인 및 표시
    if (hasData(formData)) {
      displayFormData(formData);
    } else {
      showNoDataMessage();
    }
  });
  
  // 데이터 존재 여부 확인
  function hasData(formData) {
    if (!formData || Object.keys(formData).length === 0) return false;
    
    // 값이 있는 속성이 하나라도 있는지 확인
    return Object.values(formData).some(value => {
      if (Array.isArray(value)) return value.length > 0;
      return value !== null && value !== undefined && value !== '';
    });
  }
  
  // URL 파라미터에서 데이터를 추출하는 함수
  function getFormData() {
    // URL에서 쿼리 문자열 부분 가져오기
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    // 폼 데이터 객체 생성
    const formData = {};
    
    // 모든 파라미터를 formData 객체에 추가
    for (const [key, value] of urlParams.entries()) {
      // 이미 값이 있고 배열이 아니면 배열로 변환
      if (formData[key] && !Array.isArray(formData[key])) {
        formData[key] = [formData[key]];
        formData[key].push(value);
      } 
      // 이미 배열이면 값을 추가
      else if (Array.isArray(formData[key])) {
        formData[key].push(value);
      } 
      // 처음 나오는 키면 값을 직접 할당
      else {
        // 체크박스 같은 다중 값이 가능한 필드 처리
        if (key === 'hobby' || key === 'books' || key === 'd_type') {
          formData[key] = [value];
        } else {
          formData[key] = value;
        }
      }
    }
    
    return formData;
  }
  
  // 폼 데이터를 화면에 표시
  function displayFormData(data) {
    // 결과를 표시할 컨테이너 생성
    const container = document.createElement('div');
    container.classList.add('form-results');
    
    // 제목 추가
    const title = document.createElement('h2');
    title.textContent = '제출된 폼 데이터';
    container.appendChild(title);
    
    // 사용된 폼 종류 파악 (파일명 추출)
    const path = window.location.pathname;
    const filename = path.substring(path.lastIndexOf('/') + 1);
    const formSource = document.createElement('p');
    formSource.classList.add('form-source');
    formSource.textContent = `폼 출처: ${filename.replace('.js', '.html')}`;
    container.appendChild(formSource);
    
    // 데이터 표시 섹션
    const dataContainer = document.createElement('div');
    dataContainer.classList.add('data-container');
    
    // 폼 데이터를 표로 표시
    const table = document.createElement('table');
    table.classList.add('data-table');
    
    // 테이블 헤더
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const keyHeader = document.createElement('th');
    keyHeader.textContent = '필드 이름';
    const valueHeader = document.createElement('th');
    valueHeader.textContent = '입력 값';
    headerRow.appendChild(keyHeader);
    headerRow.appendChild(valueHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);
    
    // 테이블 바디
    const tbody = document.createElement('tbody');
    
    // 데이터를 테이블에 추가
    for (const [key, value] of Object.entries(data)) {
      const row = document.createElement('tr');
      
      // 키 셀
      const keyCell = document.createElement('td');
      keyCell.classList.add('key-cell');
      keyCell.textContent = formatFieldName(key);
      row.appendChild(keyCell);
      
      // 값 셀
      const valueCell = document.createElement('td');
      valueCell.classList.add('value-cell');
      
      // 값의 유형에 따라 적절히 표시
      if (Array.isArray(value)) {
        if (value.length === 0) {
          valueCell.textContent = '(선택 없음)';
        } else {
          const list = document.createElement('ul');
          value.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = formatValue(key, item);
            list.appendChild(listItem);
          });
          valueCell.appendChild(list);
        }
      } else if (key === 'password' || key === 'pw' || key === 'confirm_password') {
        valueCell.textContent = '********'; // 비밀번호는 가려서 표시
      } else if (value === null || value === undefined || value === '') {
        valueCell.textContent = '(입력 없음)';
      } else {
        // 특정 필드 값 형식 변환
        valueCell.textContent = formatValue(key, value);
      }
      
      row.appendChild(valueCell);
      tbody.appendChild(row);
    }
    
    table.appendChild(tbody);
    dataContainer.appendChild(table);
    container.appendChild(dataContainer);
    
    // 이미지 타입 입력이 있는 경우 가상의 이미지 표시
    if (data.myfile || data.profile_pic) {
      const imageSection = document.createElement('div');
      imageSection.classList.add('image-preview');
      
      const imageTitle = document.createElement('h3');
      imageTitle.textContent = '업로드된 파일 미리보기';
      imageSection.appendChild(imageTitle);
      
      const imagePlaceholder = document.createElement('div');
      imagePlaceholder.classList.add('image-placeholder');
      imagePlaceholder.textContent = data.myfile || data.profile_pic || '파일명.jpg';
      imageSection.appendChild(imagePlaceholder);
      
      const disclaimer = document.createElement('p');
      disclaimer.classList.add('disclaimer');
      disclaimer.textContent = '참고: 실제 파일 업로드는 서버 측 처리가 필요합니다.';
      imageSection.appendChild(disclaimer);
      
      container.appendChild(imageSection);
    }
    
    // 버튼 섹션
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button-container');
    
    // 뒤로 버튼
    const backButton = document.createElement('button');
    backButton.textContent = '폼으로 돌아가기';
    backButton.classList.add('back-button');
    backButton.addEventListener('click', function() {
      window.history.back();
    });
    buttonContainer.appendChild(backButton);
    
    container.appendChild(buttonContainer);
    
    // 페이지에 결과 표시
    document.body.innerHTML = '';
    document.body.appendChild(container);
  }
  
  // 필드 이름 포맷팅
  function formatFieldName(fieldName) {
    // 필드 이름을 사람이 읽기 쉬운 형태로 변환
    const fieldMappings = {
      // 인적 정보
      'person': '이름',
      'id': '아이디',
      'username': '사용자 이름',
      'password': '비밀번호',
      'pw': '비밀번호',
      'email': '이메일',
      'p_mail': '이메일',
      'p_name': '성명',
      'p_tel': '전화번호',
      'tel': '전화번호',
      'phone': '전화번호',
      
      // 성별 및 기타 인적 정보
      'sex': '성별',
      'gender': '성별',
      'member': '회원여부',
      'job': '직업',
      'job1': '직업 (단일선택)',
      
      // 취미 및 관심사
      'hobby': '취미',
      'books': '구입희망분야',
      'interests': '관심분야',
      
      // 도서 관련
      'book_title': '도서명',
      'book': '도서명',
      'book_name': '도서명',
      'book_search': '검색 도서명',
      
      // 검색 관련
      's_type': '검색유형',
      'd_type': '자료유형',
      
      // 파일 및 기타
      'myfile': '업로드 파일',
      'profile_pic': '프로필 사진',
      'comments': '비고',
      'comment': '요청사항',
      'userIP': '사용자 IP',
      
      // 날짜 및 시간
      'last_date': '예약 희망일',
      'time_from': '시작 시간',
      'time_until': '종료 시간',
      'attendance_date': '참석일',
      'arrival_time': '도착 시간',
      
      // 가격 및 수량
      'price': '가격',
      'num': '수량',
      
      // 색상 및 기타
      'badge_color': '색상',
      'color': '색상',
      
      // 기타
      'country': '국가',
      'website': '웹사이트',
      'url': 'URL',
      'search': '검색어'
    };
    
    return fieldMappings[fieldName] || fieldName;
  }
  
  // 값 포맷팅
  function formatValue(key, value) {
    // 특정 필드 값을 사람이 읽기 쉬운 형태로 변환
    if (key === 'sex' || key === 'gender') {
      if (value === 'male') return '남성';
      if (value === 'female') return '여성';
      if (value === 'other') return '기타';
    }
    
    if (key === 'member') {
      if (value === 'yes') return '회원';
      if (value === 'no') return '비회원';
    }
    
    if (key === 'hobby') {
      if (value === 'read') return '독서';
      if (value === 'movie') return '영화';
      if (value === 'music') return '음악';
      if (value === 'sports') return '스포츠';
    }
    
    if (key === 'books') {
      if (value === 'computer') return '컴퓨터';
      if (value === 'economy') return '경제';
      if (value === 'common') return '상식';
    }
    
    if (key === 's_type') {
      if (value === 'keyword') return '키워드';
      if (value === 'content') return '본문내용';
    }
    
    if (key === 'd_type') {
      if (value === 'all') return '전체';
      if (value === 'book') return '단행본';
      if (value === 'paper') return '학술지';
      if (value === 'non_book') return '비도서';
    }
    
    if (key === 'job' || key === 'job1') {
      if (value === 'student') return '학생';
      if (value === 'company') return '회사원';
      if (value === 'teacher') return '교사';
      if (value === 'sales') return '자영업';
      if (value === 'others') return '기타';
    }
    
    // 다른 필드는 그대로 반환
    return value;
  }
  
  // 데이터가 없을 때 메시지 표시
  function showNoDataMessage() {
    document.body.innerHTML = `
      <div class="error-message">
        <h2>제출된 데이터가 없습니다</h2>
        <p>이 페이지는 폼 데이터를 받아서 처리하는 스크립트입니다.</p>
        <p>폼을 먼저 제출해주세요.</p>
        <button onclick="window.history.back()" class="back-button">폼으로 돌아가기</button>
      </div>
    `;
  }
  
  // 스타일 적용
  function applyStyles() {
    const style = document.createElement('style');
    style.textContent = `
      body {
        font-family: 'Malgun Gothic', 'Segoe UI', sans-serif;
        line-height: 1.6;
        max-width: 900px;
        margin: 0 auto;
        padding: 20px;
        background-color: #f8f9fa;
        color: #333;
      }
      
      h2 {
        color: #2c3e50;
        border-bottom: 2px solid #eee;
        padding-bottom: 10px;
        margin-bottom: 20px;
      }
      
      h3 {
        color: #3498db;
        margin-top: 20px;
      }
      
      .form-results {
        background-color: white;
        border-radius: 8px;
        padding: 25px;
        box-shadow: 0 2px 15px rgba(0,0,0,0.1);
      }
      
      .form-source {
        color: #7f8c8d;
        font-style: italic;
        margin-bottom: 20px;
      }
      
      .data-container {
        margin-bottom: 30px;
      }
      
      .data-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
      }
      
      .data-table th {
        background-color: #3498db;
        color: white;
        padding: 12px;
        text-align: left;
      }
      
      .data-table td {
        padding: 10px 12px;
        border-bottom: 1px solid #eee;
      }
      
      .key-cell {
        font-weight: bold;
        width: 30%;
        background-color: #f1f8ff;
      }
      
      .value-cell {
        width: 70%;
      }
      
      .value-cell ul {
        margin: 0;
        padding-left: 20px;
      }
      
      .button-container {
        margin-top: 25px;
        text-align: center;
      }
      
      .back-button {
        background-color: #3498db;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        transition: background-color 0.3s;
      }
      
      .back-button:hover {
        background-color: #2980b9;
      }
      
      .error-message {
        text-align: center;
        margin: 100px auto;
        max-width: 500px;
        padding: 30px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 2px 15px rgba(0,0,0,0.1);
      }
      
      .image-preview {
        margin-top: 20px;
        padding: 15px;
        background-color: #f1f8ff;
        border-radius: 4px;
      }
      
      .image-placeholder {
        background-color: #e9ecef;
        border: 1px dashed #adb5bd;
        border-radius: 4px;
        padding: 40px;
        margin: 15px 0;
        text-align: center;
        color: #6c757d;
      }
      
      .disclaimer {
        font-size: 12px;
        color: #6c757d;
        font-style: italic;
      }
      
      @media (max-width: 768px) {
        body {
          padding: 10px;
        }
        
        .form-results {
          padding: 15px;
        }
        
        .data-table th, .data-table td {
          padding: 8px;
        }
        
        .key-cell, .value-cell {
          display: block;
          width: 100%;
        }
        
        .key-cell {
          border-bottom: none;
          padding-bottom: 0;
        }
      }
    `;
    document.head.appendChild(style);
    
    // 타이틀 설정
    document.title = '폼 제출 결과';
    
    // 메타 태그 추가
    const metaCharset = document.createElement('meta');
    metaCharset.setAttribute('charset', 'UTF-8');
    document.head.appendChild(metaCharset);
    
    const metaViewport = document.createElement('meta');
    metaViewport.setAttribute('name', 'viewport');
    metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
    document.head.appendChild(metaViewport);
  }