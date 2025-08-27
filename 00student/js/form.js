
//전역변수
const API_BASE_URL = "http://localhost:8080";
//현재 Update 중인 학생의 ID
var editingStudentId = null;

//DOM 엘리먼트 가져오기
const studentForm = document.getElementById("studentForm");
const studentTableBody = document.getElementById("studentTableBody");
const submitButton = document.querySelector("button[type='submit']");
const cancelButton = document.querySelector(".cancel-btn");
const formErrorSpan = document.getElementById("formError");

//Document Load 이벤트 처리하기
document.addEventListener("DOMContentLoaded", function () {
    //resetForm();
    loadStudents();
});
//StudentForm 의 Submit 이벤트 처리하기
studentForm.addEventListener("submit", function (event) {
    //기본으로 설정된 Event가 동작하지 않도록 하기 위함
    event.preventDefault();
    console.log("Form 이 체출 되었음....")

    //FormData 객체생성 <form>엘리먼트를 객체로 변환
    const stuFormData = new FormData(studentForm);
    // stuFormData.forEach((value, key) => {
    //     console.log(key + ' = ' + value);
    // });

    //사용자 정의 Student Object Literal 객체생성 (공백 제거 trim())
    const studentData = {
        name: stuFormData.get("name").trim(),
        studentNumber: stuFormData.get("studentNumber").trim(),
        detailRequest: {
            address: stuFormData.get("address").trim(),
            phoneNumber: stuFormData.get("phoneNumber").trim(),
            email: stuFormData.get("email").trim(),
            dateOfBirth: stuFormData.get("dateOfBirth") || null,
        }
    }

    //유효성 체크하는 함수 호출하기
    if (!validateStudent(studentData)) {
        //검증체크 실패하면 리턴하기
        return;
    }

    //유효한 데이터 출력하기
    console.log(studentData);

    //현재 수정중인 학생Id가 있으면 수정처리
    if (editingStudentId) {
        //서버로 Student 수정 요청하기
        updateStudent(editingStudentId, studentData);
    } else {
        //서버로 Student 등록 요청하기
        createStudent(studentData);
    }

}); //submit 이벤트

//Student 등록 함수
function createStudent(studentData) {
    fetch(`${API_BASE_URL}/api/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData)  //Object => json
    })
        .then(async (response) => {
            if (!response.ok) {
                //응답 본문을 읽어서 에러 메시지 추출
                const errorData = await response.json();
                //status code와 message를 확인하기
                if (response.status === 409) {
                    //중복 오류 처리
                    throw new Error(errorData.message || '중복 되는 정보가 있습니다.');
                } else {
                    //기타 오류 처리
                    throw new Error(errorData.message || '학생 등록에 실패했습니다.')
                }
            }
            return response.json();
        })
        .then((result) => {
            showSuccess("학생이 성공적으로 등록되었습니다!");
            //입력 Form의 input의 값 초기화
            studentForm.reset();
            //resetForm();
            //목록 새로 고침
            loadStudents();
        })
        .catch((error) => {
            console.log('Error : ', error);
            showError(error.message);
        });
}//createStudent

//Student 삭제 함수
function deleteStudent(studentId, studentName) {
    if (!confirm(`이름 = ${studentName} 학생을 정말로 삭제하시겠습니까?`)) {
        return;
    }
    console.log('삭제처리 ...');
    fetch(`${API_BASE_URL}/api/students/${studentId}`, {
        method: 'DELETE'
    })
        .then(async (response) => {
            if (!response.ok) {
                //응답 본문을 읽어서 에러 메시지 추출
                const errorData = await response.json();
                //status code와 message를 확인하기
                if (response.status === 404) {
                    //중복 오류 처리
                    throw new Error(errorData.message || '존재하지 않는 학생입니다다.');
                } else {
                    //기타 오류 처리
                    throw new Error(errorData.message || '학생 삭제에 실패했습니다.')
                }
            }
            showSuccess("학생이 성공적으로 삭제되었습니다!");
            //목록 새로 고침
            loadStudents();
        })
        .catch((error) => {
            console.log('Error : ', error);
            showError(error.message);
        });
}//deleteStudent

//학생 수정전에 데이터를 로드하는 함수
function editStudent(studentId) {
    fetch(`${API_BASE_URL}/api/students/${studentId}`)
        .then(async (response) => {
            if (!response.ok) {
                //응답 본문을 읽어서 에러 메시지 추출
                const errorData = await response.json();
                //status code와 message를 확인하기
                if (response.status === 404) {
                    //중복 오류 처리
                    throw new Error(errorData.message || '존재하지 않는 학생입니다.');
                }
            }
            return response.json();
        })
        .then((student) => {
            //Form에 데이터 채우기
            studentForm.name.value = student.name;
            studentForm.studentNumber.value = student.studentNumber;
            if (student.detail) {
                studentForm.address.value = student.detail.address;
                studentForm.phoneNumber.value = student.detail.phoneNumber;
                studentForm.email.value = student.detail.email;
                studentForm.dateOfBirth.value = student.detail.dateOfBirth || '';
            }

            //수정 Mode 설정
            editingStudentId = studentId;
            //버튼의 타이틀을 등록 => 수정으로 변경
            submitButton.textContent = "학생 수정";
            //취소 버튼을 활성화
            cancelButton.style.display = 'inline-block';
        })
        .catch((error) => {
            console.log('Error : ', error);
            showError(error.message);
        });
}//editStudent

//학생 수정을 처리하는 함수
function updateStudent(studentId, studentData) {
    fetch(`${API_BASE_URL}/api/students/${studentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(studentData)  //Object => json
    })
        .then(async (response) => {
            if (!response.ok) {
                //응답 본문을 읽어서 에러 메시지 추출 
                //errorData 객체는 서버의 ErrorObject와 매핑이 된다.
                const errorData = await response.json();
                //status code와 message를 확인하기
                if (response.status === 409) {
                    //중복 오류 처리
                    throw new Error(`${errorData.message} ( 에러코드: ${errorData.statusCode} )` || '중복 되는 정보가 있습니다.');
                } else {
                    //기타 오류 처리
                    throw new Error(errorData.message || '학생 수정에 실패했습니다.')
                }
            }
            return response.json();
        })
        .then((result) => {
            showSuccess("학생이 성공적으로 수정되었습니다!");
            //등록모드로 전환
            resetForm();
            //목록 새로 고침
            loadStudents();
        })
        .catch((error) => {
            console.log('Error : ', error);
            showError(error.message);
        });
}//updateStudent

//입력필드 초기화,수정모드에서 등록모드로 전환
function resetForm() {
    //form 초기화
    studentForm.reset();
    //수정 Mode 설정하는 변수 초기화
    editingStudentId = null;
    //submit 버튼의 타이틀을 학생 등록 변경
    submitButton.textContent = "학생 등록";
    //cancel 버튼의 사라지게
    cancelButton.style.display = 'none';
    //error message 초기화
    clearMessages();
}//resetForm


//입력항목의 값의 유효성을 체크하는 함수
function validateStudent(student) {// 필수 필드 검사
    if (!student.name) {
        alert("이름을 입력해주세요.");
        return false;
    }

    if (!student.studentNumber) {
        alert("학번을 입력해주세요.");
        return false;
    }
    // 학번 형식 검사 (예: 영문과 숫자 조합)
    //const studentNumberPattern = /^[A-Za-z0-9]+$/;
    const studentNumberPattern = /^[A-Za-z]\d{5}$/;
    if (!studentNumberPattern.test(student.studentNumber)) {
        alert("학번은 영문(S)과 숫자(5자리)만 입력 가능합니다.");
        return false;
    }

    if (student.detailRequest) {
        const studentDetail = student.detailRequest;
        if (!studentDetail.address) {
            alert("주소를 입력해주세요.");
            return false;
        }

        if (!studentDetail.phoneNumber) {
            alert("전화번호를 입력해주세요.");
            return false;
        }

        if (!studentDetail.email) {
            alert("이메일을 입력해주세요.");
            return false;
        }

        // 전화번호 형식 검사
        const phonePattern = /^[0-9-\s]+$/;
        if (!phonePattern.test(studentDetail.phoneNumber)) {
            alert("올바른 전화번호 형식이 아닙니다.");
            return false;
        }

        // 이메일 형식 검사 (입력된 경우에만)
        if (student.email && !isValidEmail(studentDetail.email)) {
            alert("올바른 이메일 형식이 아닙니다.");
            return false;
        }
    }
    return true;
}//validateStudent

// 이메일 유효성 검사
function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}//isValidEmail

//Student(학생) 목록을 Load 하는 함수
function loadStudents() {
    console.log("학생 목록 Load 중.....");
    fetch(`${API_BASE_URL}/api/students`) //Promise
        .then(async (response) => {
            if (!response.ok) {
                //응답 본문을 읽어서 에러 메시지 추출
                const errorData = await response.json();
                throw new Error(`${errorData.message}`);
            }
            return response.json();
        })
        .then((students) => renderStudentTable(students))
        .catch((error) => {
            console.log(error);
            //alert(">>> 학생 목록을 불러오는데 실패했습니다!.");
            showError(error.message);
            studentTableBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; color: #dc3545;">
                        오류: 데이터를 불러올 수 없습니다.
                    </td>
                </tr>
            `;
        });
};

function renderStudentTable(students) {
    console.log(students);
    studentTableBody.innerHTML = "";
    // [{},{},{}] [] - students, {} - student
    students.forEach((student) => {
        //<tr> 엘리먼트를 생성하기 <tr><td>홍길동</td><td>aaa</td></tr>
        const row = document.createElement("tr");

        //<tr>의 content을 동적으로 생성
        row.innerHTML = `
                    <td>${student.name}</td>
                    <td>${student.studentNumber}</td>
                    <td>${student.detail ? student.detail.address : "-"}</td>
                    <td>${student.detail?.phoneNumber ?? "-"}</td>
                    <td>${student.detail?.email ?? "-"}</td>
                    <td>${student.detail?.dateOfBirth ?? "-"}</td>
                    <td>
                        <button class="edit-btn" onclick="editStudent(${student.id})">수정</button>
                        <button class="delete-btn" onclick="deleteStudent(${student.id},'${student.name}')">삭제</button>
                    </td>
                `;
        //<tbody>의 아래에 <tr>을 추가시켜 준다.
        studentTableBody.appendChild(row);
    });
}//renderStudentTable

//성공 메시지 출력
function showSuccess(message) {
    formErrorSpan.textContent = message;
    formErrorSpan.style.display = 'block';
    formErrorSpan.style.color = '#28a745';
}
//에러 메시지 출력
function showError(message) {
    formErrorSpan.textContent = message;
    formErrorSpan.style.display = 'block';
    formErrorSpan.style.color = '#dc3545';
}
//메시지 초기화
function clearMessages() {
    formErrorSpan.style.display = 'none';
}
