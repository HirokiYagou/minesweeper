document.addEventListener('DOMContentLoaded', function(){
  // ①変数の宣言
  let rowNumber;
  let colNumber;
  let mineNumber;
  
  let startTime;
  let timeoutId;
  
  // let shuffledNumbers = [];
  // const row = [];
  let sheet = [];
  
  let isPlaying;
  let isDead;
  
  
  // ②関数たち
  // ランダムな配列を作る関数
  function shuffle(array) {
    for (let i = array.length - 1; i >= 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }
  
  // ストップウォッチを動かす関数
  function countUp() {
    const d = Date.now() - startTime;
    const s = String(Math.floor(d/1000)).padStart(3,'0');
  
    document.getElementById('time').textContent = s;
  
    timeoutId = setTimeout(() => {
      countUp();
    }, 1000)
  }
  
  // 難易度ボタンを押してマス分のtdを作る関数
  function makeSheet(e) {
    if (e.id === 'easy') {
      rowNumber = 9;
      colNumber = 9;
      mineNumber =  10;
    } else if (e.id === 'normal') {
      rowNumber = 16;
      colNumber = 16;
      mineNumber =  40;
    } else if (e.id === 'hard') {
      rowNumber = 16;
      colNumber = 30;
      mineNumber =  99;
    }
    document.getElementById('counter').textContent = String(mineNumber).padStart(3, '0');
    
    
    for (let i = 0; i < rowNumber; i++) {
      let tr = document.createElement('tr');
      for (let j = 0; j < colNumber; j++) {
        let td = document.createElement('td');
        tr.appendChild(td);
        let val = i * colNumber + j + 1;
        td.setAttribute('id', val)
      }
      document.getElementById('field').appendChild(tr);
    }
  }
  
  // mineを配置する関数
  function setMine(e) {
    getRowCol(e);
    
    const idValue = Number(e.id);
    
    let numbers = [];
    
    for (let i = 0; i < mineNumber; i++) {numbers.push(1);}
    for (let j = 0; j < rowNumber * colNumber - mineNumber - 1; j++) {numbers.push(0);}
    let shuffledNumbers = shuffle(numbers);
    shuffledNumbers.splice(idValue - 1, 0, 0);
    
    
    for (let i = 0; i < rowNumber; i++) {
      sheet.push(shuffledNumbers.splice(0, colNumber))
    }
    console.table(sheet);
    
    const tds = document.querySelectorAll('#game-table td');
    tds.forEach((td) => {
      const RC = getRowCol(td);
      let r = RC[0];
      let c = RC[1];
      if (sheet[r][c] === 1){
        td.classList.add('bomb');
      }
    })
  }
  
  // 難易度ボタン押しなおして再開するとき一旦tdを全部消す関数
  function clearSheet() {
    sheet = [];
    const tbody = document.getElementById('field');
    while(tbody.firstChild) {
      tbody.removeChild(tbody.firstChild);
    }
  }
  
  // tdのidから行rowと列columnを得る関数
  function getRowCol(e) {
    let r;
    let c;
    const idValue = Number(e.id);
    // console.log(idValue);
    
    if(idValue % colNumber === 0) {
      c = colNumber - 1;
      r = idValue / colNumber - 1;
    } else {
      c = idValue % colNumber - 1
      r = (idValue - c - 1) / colNumber;
    }
    const RC = [r, c];
    return RC
    // console.log(r, c);
  }
  
  // 押したtdの周りにどれだけmineがあるか数える関数
  function count(e) {
    e.classList.add('clicked');
    
    getRowCol(e);
    const RC = getRowCol(e);
    let r = RC[0];
    let c = RC[1];
    
    let sum = 0;
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        let R = r - 1 + i;
        let C = c - 1 + j;
        if(R < 0 || R > rowNumber - 1 || C < 0 || C > colNumber - 1) {
          
        } else{
          sum += sheet[R][C];
        }
      }      
    }
    sum -= sheet[r][c];
    
    if(sum !== 0) {
      e.textContent = sum;
      e.classList.add('a' + sum);
    }
    // console.log(sum);
    return sum;
  }
  
  //0のとき周りをsweepしていく関数
  function mineSweep(e) {
    count(e);
    const sum = count(e);
    const allCountRC = [];
    const include0RC = [];
    if(sum === 0) {
      getRowCol(e);
      const RC = getRowCol(e);
      let r = RC[0];
      let c = RC[1];
      
      for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
          let R = r - 1 + i;
          let C = c - 1 + j;
          let searchId = Number(e.id) - colNumber - 2 + (colNumber * i) + j;
          let searchTd = document.querySelectorAll('#game-table td')[searchId];
          if(R < 0 || R > rowNumber - 1 || C < 0 || C > colNumber - 1) {
            allCountRC.push(9);
          } else{
            let clickedTd = searchTd.classList.contains('clicked');
            // console.log([searchTd, clickedTd]);
            count(searchTd);
            let sum = count(searchTd);
            allCountRC.push(sum);
            if(i !== 1 || j !== 1) {
              if(sum === 0 && clickedTd === false) {
                include0RC.push(searchTd);
              }
            }
          }
        }      
      }
    }

    if(include0RC === []) {
      return;
    }
    for (let i = 0; i < include0RC.length; i++) {
      mineSweep(include0RC[i]);
    }
    
    if(rowNumber * colNumber - mineNumber === document.getElementsByClassName('clicked').length) {
      alert('completed!!');
      clearTimeout(timeoutId);
      formAppear();
    }
  }
  
  //tdの周りにflagが何個あるか数える関数
  function countFlag(e) {
    getRowCol(e);
    const RC = getRowCol(e);
    let r = RC[0];
    let c = RC[1];
    let counter = 0;
    
    for(let i = 0; i < 3; i++){
      for(let j = 0; j < 3; j++){
        let R = r - 1 + i;
        let C = c - 1 + j;
        let searchId = Number(e.id) - colNumber - 2 + (colNumber * i) + j;
        let searchTd = document.querySelectorAll('#game-table td')[searchId];
        if(R < 0 || R > rowNumber - 1 || C < 0 || C > colNumber - 1) {
        } else{
          if(searchTd.classList.contains('flag')) {
            counter++;
          }
          
        }
      }      
    }
    
    return counter;
  }
    
  // 数字と旗の数が同じなら周り開ける関数
  function dbcSweep(e) {
    let counter = countFlag(e);
    let sum = count(e);
    if(counter === sum) {
      const RC = getRowCol(e);
      let r = RC[0];
      let c = RC[1];
      
      for(let i = 0; i < 3; i++){
        for(let j = 0; j < 3; j++){
          let R = r - 1 + i;
          let C = c - 1 + j;
          let searchId = Number(e.id) - colNumber - 2 + (colNumber * i) + j;
          let searchTd = document.querySelectorAll('#game-table td')[searchId];
          if(R < 0 || R > rowNumber - 1 || C < 0 || C > colNumber - 1) {
          } else{
            if(searchTd.firstChild) {} else {
              if(isDead === false){
                if(searchTd.classList.contains('bomb')){
                  isDead = true;
                  clearTimeout(timeoutId);
                  searchTd.classList.add('bombed');
                  const tds3 = document.querySelectorAll('#game-table td');
                  tds3.forEach((td) => {
                    if(td.classList.contains('bomb')) {
                      if(td.classList.contains('flag')) {
                        
                      } else {
                        const img = document.createElement('img');
                        img.src = '/assets/mine.png'
                        td.appendChild(img);
                        td.classList.add('clicked');
                      }
                    } else {
                      if(td.classList.contains('flag')) {
                        while(td.firstChild){
                          td.removeChild(td.firstChild);
                          td.classList.remove('flag');
                        }
                        const img = document.createElement('img');
                        img.src = '/assets/minefalse.png'
                        td.appendChild(img);
                        td.classList.add('clicked');
                      }
                    }
                  })
                } else {
                  mineSweep(searchTd);
                }
              }
            }
            
          }
        }      
      }
    }
    
  }

  // isPlaying, isDeadが変化した時送信フォームを出す関数
  function formAppear() {
    const formTime = document.getElementById('form-time')
    const time = document.getElementById('time')
    formTime.value = time.textContent
    // document.getElementById('form-comment').removeAttribute('type', 'hidden')
    document.getElementById('submit').removeAttribute('type', 'hidden')
    document.getElementById('submit').setAttribute('type', 'submit')
  }
  
  // isPlaying, isDeadが変化した時送信フォームを消す関数
  function formDestroy() {
    // document.getElementById('form-comment').setAttribute('type', 'hidden')
    document.getElementById('submit').setAttribute('type', 'hidden')
  }
  
  
  
  // ③ボタン操作たち
  const buttons = document.querySelectorAll('.level-btn');
  buttons.forEach((button) => {
    //難易度ボタン
    button.addEventListener('click', () => {
      clearSheet();
      makeSheet(button);
      isPlaying = false;
      isDead = false;
      formDestroy();
      clearTimeout(timeoutId);
      document.getElementById('time').textContent = '000';
      
      //td押す操作
      const tds = document.querySelectorAll('#game-table td');
      const tds2 = [...tds];
      tds2.forEach((td) => {
        // clickした時
        td.addEventListener('click', () => {
          if (isPlaying === false){
            setMine(td);
            isPlaying = true;
            startTime = Date.now();
            countUp();
          } 
          
          if(td.firstChild) {} else {
            if(isDead === false){
              if(td.classList.contains('bomb')){
                isDead = true;
                clearTimeout(timeoutId);
                td.classList.add('bombed');
                // formAppear();
                const tds3 = document.querySelectorAll('#game-table td');
                tds3.forEach((td) => {
                  if(td.classList.contains('bomb')) {
                    if(td.classList.contains('flag')) {
                      
                    } else {
                      const img = document.createElement('img');
                      img.src = '/assets/mine.png'
                      td.appendChild(img);
                      td.classList.add('clicked');
                    }
                  } else {
                    if(td.classList.contains('flag')) {
                      while(td.firstChild){
                        td.removeChild(td.firstChild);
                        td.classList.remove('flag');
                      }
                      const img = document.createElement('img');
                      img.src = '/assets/minefalse.png'
                      td.appendChild(img);
                      td.classList.add('clicked');
                    }
                  }
                })
                
              } else {
                mineSweep(td);
              }
            }
          }
        })
  
        // 右クリックしたとき
        let counter = 0;
        td.addEventListener('contextmenu', (e) => {
          if(isDead === false) {
            if(td.classList.contains('clicked')) {
              e.preventDefault();
            } else {
              e.preventDefault();
              counter++;
              // console.log(counter);
              while(td.firstChild){
                td.removeChild(td.firstChild);
                td.classList.remove('flag');
              }
              if (counter % 3 === 1) {
                const img = document.createElement('img');
                img.src = '/assets/flag.png'
                td.appendChild(img);
                td.classList.add('flag')
              } else if (counter % 3 === 2) {
                td.textContent = '?';
              }
            }
          }
  
          const flag = document.getElementsByClassName('flag');
          const counter2 = document.getElementById('counter');
          counter2.textContent = String(mineNumber - flag.length).padStart(3, '0');
        })
  
        // ダブルクリックしたとき
        td.addEventListener('dblclick', () => {
          if(isDead === false) {
            if(td.classList.contains('flag')) {} else {
              dbcSweep(td);
            }
          }
        })
      })
    })
  })
});
