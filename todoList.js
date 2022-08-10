let selectedId = null;

// 할일 추가 버튼 
function getShow(id) {

    // id가 있는 경우 - 수정
    if(id){
        const li = document.querySelector(`.todoList li[data-id="${id}"]>span`);
        document.querySelector('#todoName').value = li.innerText;
    }//id가 없는 경우 - 신규 추가
    else{
        document.querySelector('#todoName').value = '';
    }
    
    addListDiv.style = "";
    selectedId = id;
}
function getHide() {
    addListDiv.style = "display:none";
}

// 저장 버튼 클릭시
// id == null 이면 append 추가
// id == Not null 이면 update
// 저장버튼
async function saveMessage() {
    if(selectedId) {
        update(selectedId)
    } else {
        create()
    }
}
// 목록생성
async function create() {
    const todoName = document.querySelector('#todoName').value //입력창의 값을 가져옴
    await fetch('http://localhost:3000/cats', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
            // 'Content-Type': 'application/x-www-form-urlencoded', 여러 파일 형식 넣는 거 가능
        },
        body: JSON.stringify({
            "name": todoName,
            "age": 1,
            "color": "black",
            "breed": "jin-do"
        })
    }).then((response) => {
        alert("할일이 저장되었습니다");
    }).catch(() => {
        alert('에러 났어');
    })
    getList();
}

async function update(id) {
    const content = document.querySelector('#todoName').value 
    const list = await fetch(`http://localhost:3000/cats/${id}`,{
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
            //'Content-Type': 'application/x-www-form-urlencoded',
            // body에 들어가는 컨텐츠 타입을 알려줌
        }, body: JSON.stringify({
            "name": content,
            "age": 1,
            "color": "black",
            "breed": "jin-do"
        })
    }).then((response) => {
        alert("할일이 수정되었습니다");
    }).catch(() => {
        alert('에러 났어');
    })
    getList();
}

//삭제버튼
async function deleteTodo(id) {
    //body부분 필요없음. 그냥 삭제니까
    await fetch(`http://localhost:3000/cats/${id}`,{
        method: 'DELETE'
    }).then((response) => {
        alert("할일이 삭제되었습니다")
    }).catch(() => {
        alert("Error");
    })
    getList() 
}

//ul에 list추가  
async function getList() {
    const list = await fetch('http://localhost:3000/cats')
        .then(response => response.json());

    // todo selector를 써서 ul 변수 담기
    const ul = document.querySelector('.todoList') //class >> . 점

    ul.innerHTML = '' //비웠다가 다시 붙이기 append
    for (let l of list) {
        const li = document.createElement('li'); //createElement : 요소만들기
        let checked = '';
        //var : 유연한 변수 선언, 그러나 어디서 사용되었는지 파악하기 어렵고 값이 바뀔 우려가 있다
        //let : 재선언은 안되지만, 재할당은 가능
        //const : 변수 재선언, 재할당이 되지 않음
        if(l.done){
            checked = 'checked';
        }
        li.setAttribute('data-id', l.id) //요소에 값 할당
        li.className = 'oneListStyle';
        li.innerHTML = `
            <span><input class="todoList-checkbox" type="checkbox" ${checked} onChange="toggle(this,${l.id})"> ${l.name}</span>
            <button class="oneListButton" onclick="getShow(${l.id})">수정</button>
            <button class="oneListButton" onclick="deleteTodo(${l.id})">삭제</button>
        `;
        ul.append(li);
    }
} 

// 체크박스 클릭하면 실행됨
async function toggle(obj, id) {
    // 현재 선택 유무 상태
    const check = obj.checked
 
    const response = await fetch(`http://localhost:3000/cats/${id}/toggle`,{
        method: 'PATCH'
    }).then((response)=>{          
        return response.json();
    }).catch(()=>{
        alert("Error");
    })
}