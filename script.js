// 3x3 Quiz Tic-Tac-Toe — do'stim
(() => {
  const SIZE = 3;
  const HUMAN = 'X';
  const AI = 'O';

  const boardEl = document.getElementById('board');
  const turnEl = document.getElementById('turn');
  const msgEl = document.getElementById('message');
  const scoreXEl = document.getElementById('scoreX');
  const scoreOEl = document.getElementById('scoreO');
  const scoreDEl = document.getElementById('scoreD');

  const restartBtn = document.getElementById('restart');
  const resetScoresBtn = document.getElementById('resetScores');

  // modal elements
  const modal = document.getElementById('quizModal');
  const quizText = document.getElementById('quizText');
  const optionsEl = document.getElementById('options');
  const quizForm = document.getElementById('quizForm');
  const submitAnswerBtn = document.getElementById('submitAnswer');
  const cancelAnswerBtn = document.getElementById('cancelAnswer');

  // Questions (from siz bergan ro'yxat)
  const QUESTIONS = [
    { q: "1. HTML nima?", opts: ["Dasturlash tili","Saytning skeleti (tuzilishi)","Rasm tahrirlovchi dastur","Kalkulyator dasturi"], a:1 },
    { q: "2. HTML'da eng katta sarlavha qaysi teg bilan yoziladi?", opts: ["<h6>","<h3>","<h1>","<title>"], a:2 },
    { q: "3. CSS nima?", opts: ["Saytning dizayni va ko'rinishi","Hisoblashlar uchun dastur","E-mail yuboruvchi dastur","Matn muharriri"], a:0 },
    { q: "4. CSS'da matn rangi qaysi xususiyat bilan o'zgartiriladi?", opts: ["font-color","text-color","color","text-red"], a:2 },
    { q: "5. Paragrafni HTML'da qaysi teg bilan yozamiz?", opts: ["<paragraf>","<p>","<text>","<para>"], a:1 },
    { q: "6. HTML'da sahifaga rasm qo'yish uchun qaysi teg ishlatiladi?", opts: ["<image>","<img>","<picture>","<photo>"], a:1 },
    { q: "7. CSS'da fon rangi qaysi xususiyat bilan o'zgartiriladi?", opts: ["background-color","bg-color","color-background","back-color"], a:0 },
    { q: "8. Matnni qalin qilish uchun qaysi teg ishlatiladi?", opts: ["<thin>","<i>","<b>","<u>"], a:2 },
    { q: "9. HTML'da link yaratish uchun qaysi teg ishlatiladi?", opts: ["<url>","<link>","<a>","<href>"], a:2 },
    { q: "10. Matnni markazga tekislash uchun CSS'da qanday qiymat ishlatiladi?", opts: ["text-align: middle","text-align: center","text-align: left","text-align: right"], a:1 },
    { q: "11. HTML'da tugma yaratish uchun qaysi teg ishlatiladi?", opts: ["<click>","<btn>","<button>","<key>"], a:2 },
    { q: "12. CSS'da matn o'lchamini kattalashtirish uchun qaysi xususiyat ishlatiladi?", opts: ["font-weight","font-style","font-size","text-size"], a:2 },
    { q: "13. HTML'da yangi qatorga o'tish uchun qaysi teg ishlatiladi?", opts: ["<new>","<break>","<br>","<line>"], a:2 },
    { q: "14. CSS'da matnni kursiv qilish uchun qaysi qiymat ishlatiladi?", opts: ["font-style: strong","font-style: italic","font-style: bold","font-style: thin"], a:1 },
    { q: "15. HTML'da sahifaning asosiy qismi qaysi tegda yoziladi?", opts: ["<main>","<body>","<html>","<content>"], a:1 },
    { q: "16. CSS'da rasm atrofiga ramka chizish uchun qaysi xususiyat ishlatiladi?", opts: ["outline","border","line","frame"], a:1 },
    { q: "17. HTML'da tartibsiz ro'yxat uchun qaysi teg ishlatiladi?", opts: ["<ol>","<ul>","<li>","<list>"], a:1 },
    { q: "18. CSS'da rasm burchaklarini yumaloqlashtirish uchun qaysi xususiyat ishlatiladi?", opts: ["corner-round","border-corners","border-radius","curve"], a:2 },
    { q: "19. HTML'da matn ostiga chiziq chizish uchun qaysi teg ishlatiladi?", opts: ["<underline>","<u>","<down-line>","<line>"], a:1 },
    { q: "20. CSS'da linkning tagi chizilgan qismini olib tashlash uchun qaysi qiymat ishlatiladi?", opts: ["text-decoration: none","text-decoration: line","text-decoration: remove","text-decoration: delete"], a:0 },
  ];

  let board = []; // 2D array
  let current = HUMAN;
  let playing = true;
  let pendingCell = null; // {r,c} when user clicked a cell -> modal asks question
  let scores = { X:0, O:0, D:0 };

  // init
  function initBoard(){
    board = Array.from({length: SIZE}, ()=> Array.from({length: SIZE}, ()=> null));
    boardEl.innerHTML = '';
    for(let r=0;r<SIZE;r++){
      for(let c=0;c<SIZE;c++){
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.dataset.r = r;
        cell.dataset.c = c;
        cell.setAttribute('role','button');
        cell.setAttribute('aria-label', `katak ${r+1}-${c+1}`);
        cell.addEventListener('click', onCellClick);
        boardEl.appendChild(cell);
      }
    }
    current = HUMAN;
    playing = true;
    pendingCell = null;
    turnEl.textContent = `${current} (Siz)`;
    msgEl.textContent = 'Boshlash uchun katakka bosing.';
    clearWinHighlights();
  }

  function clearWinHighlights(){
    boardEl.querySelectorAll('.cell').forEach(el => el.classList.remove('win','x','o'));
  }

  function onCellClick(e){
    if(!playing) return;
    const r = Number(e.currentTarget.dataset.r);
    const c = Number(e.currentTarget.dataset.c);
    if(board[r][c]) return;
    // open modal with random question
    pendingCell = {r,c};
    openQuizModal();
  }

  // Modal logic
  function openQuizModal(){
    // pick random question
    const idx = Math.floor(Math.random() * QUESTIONS.length);
    const q = QUESTIONS[idx];
    modal.setAttribute('aria-hidden','false');
    quizText.textContent = q.q;
    optionsEl.innerHTML = '';
    q.opts.forEach((opt, i) => {
      const id = `opt-${i}`;
      const wrapper = document.createElement('label');
      wrapper.className = 'option';
      wrapper.innerHTML = `<input type="radio" name="answer" value="${i}" id="${id}" required /> <span>${opt}</span>`;
      optionsEl.appendChild(wrapper);
    });
    // attach current question index to form dataset
    quizForm.dataset.qidx = idx;
  }

  function closeQuizModal(){
    modal.setAttribute('aria-hidden','true');
    // clear radio selection
    quizForm.reset();
  }

  quizForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    const qidx = Number(quizForm.dataset.qidx);
    const q = QUESTIONS[qidx];
    const formData = new FormData(quizForm);
    const ans = formData.get('answer');
    const ansIdx = ans !== null ? Number(ans) : null;
    closeQuizModal();

    if(ansIdx === q.a){
      // correct -> place human mark
      placeAt(pendingCell.r, pendingCell.c, HUMAN);
      msgEl.textContent = "To'g'ri! Katak siznikiga aylantirildi.";
      // check win/draw then AI move
      const win = checkWin(pendingCell.r, pendingCell.c, HUMAN);
      if(win){
        endGame(HUMAN, win);
        return;
      }
      if(isBoardFull()){
        endDraw();
        return;
      }
      // AI move after small delay so user can see their mark
      setTimeout(() => {
        aiMove();
      }, 400);
    } else {
      // wrong answer -> forfeit turn, AI moves immediately
      msgEl.textContent = "Noto'g'ri javob — navbat yo'qotildi, AI o'ynaydi.";
      setTimeout(() => {
        aiMove();
      }, 450);
    }
    pendingCell = null;
  });

  cancelAnswerBtn.addEventListener('click', () => {
    // cancel = treat as wrong (forfeit)
    closeQuizModal();
    msgEl.textContent = "Savol bekor qilindi — navbat yo'qotildi, AI o'ynaydi.";
    pendingCell = null;
    setTimeout(() => aiMove(), 400);
  });

  // Place a mark on board and update UI
  function placeAt(r,c,player){
    if(board[r][c]) return false;
    board[r][c] = player;
    const selector = `.cell[data-r="${r}"][data-c="${c}"]`;
    const el = boardEl.querySelector(selector);
    if(el){
      el.textContent = player;
      el.classList.add(player === HUMAN ? 'x' : 'o');
    }
    return true;
  }

  function isBoardFull(){
    for(let r=0;r<SIZE;r++) for(let c=0;c<SIZE;c++) if(!board[r][c]) return false;
    return true;
  }

  // Win checker (returns list of winning cells or null)
  function checkWin(r,c,player){
    const lines = [
      // row
      Array.from({length:SIZE}, (_,i) => [r,i]),
      // col
      Array.from({length:SIZE}, (_,i) => [i,c]),
      // diag TL-BR
      Array.from({length:SIZE}, (_,i) => [i,i]),
      // diag TR-BL
      Array.from({length:SIZE}, (_,i) => [i,SIZE-1-i])
    ];
    for(const line of lines){
      if(line.every(([rr,cc]) => board[rr][cc] === player)) return line;
    }
    return null;
  }

  function highlightWin(cells){
    cells.forEach(([r,c]) => {
      const el = boardEl.querySelector(`.cell[data-r="${r}"][data-c="${c}"]`);
      if(el) el.classList.add('win');
    });
  }

  function endGame(winner, winCells){
    playing = false;
    highlightWin(winCells);
    if(winner === HUMAN){
      msgEl.textContent = "Tabriklar — siz yutdingiz!";
      scores.X++;
    } else {
      msgEl.textContent = "AI yutdi. Keyingi safar omad!";
      scores.O++;
    }
    updateScores();
    turnEl.textContent = 'O\'yin tugadi';
  }

  function endDraw(){
    playing = false;
    msgEl.textContent = "Durang!";
    scores.D++;
    updateScores();
    turnEl.textContent = 'Durang';
  }

  // Simple minimax AI for 3x3
  function aiMove(){
    if(!playing) return;
    // find best move using minimax
    const best = minimax(board, AI);
    if(best && best.move){
      placeAt(best.move[0], best.move[1], AI);
      const win = checkWin(best.move[0], best.move[1], AI);
      if(win){
        endGame(AI, win);
        return;
      }
      if(isBoardFull()){
        endDraw();
        return;
      }
      turnEl.textContent = `${HUMAN} (Siz)`;
      msgEl.textContent = 'Sizning navbatingiz — katakka bosing va savolga javob bering.';
    } else {
      // fallback random
      const empties = [];
      for(let r=0;r<SIZE;r++) for(let c=0;c<SIZE;c++) if(!board[r][c]) empties.push([r,c]);
      if(empties.length){
        const [r,c] = empties[Math.floor(Math.random()*empties.length)];
        placeAt(r,c,AI);
        const win = checkWin(r,c,AI);
        if(win){ endGame(AI, win); return; }
        if(isBoardFull()){ endDraw(); return; }
        turnEl.textContent = `${HUMAN} (Siz)`;
        msgEl.textContent = 'Sizning navbatingiz — katakka bosing va savolga javob bering.';
      }
    }
  }

  // Minimax implementation
  function minimax(boardState, player){
    // check terminal
    const winner = evaluate(boardState);
    if(winner !== null){
      // score from AI perspective
      if(winner === AI) return {score: 10};
      if(winner === HUMAN) return {score: -10};
      return {score: 0}; // draw
    }

    const moves = [];
    for(let r=0;r<SIZE;r++){
      for(let c=0;c<SIZE;c++){
        if(!boardState[r][c]){
          // try move
          boardState[r][c] = player;
          const result = minimax(boardState, player === AI ? HUMAN : AI);
          moves.push({ move:[r,c], score: result.score });
          boardState[r][c] = null;
        }
      }
    }

    // choose best
    let bestMove = null;
    if(player === AI){
      // maximize
      let bestScore = -Infinity;
      for(const m of moves) if(m.score > bestScore){ bestScore = m.score; bestMove = m; }
    } else {
      // minimize
      let bestScore = Infinity;
      for(const m of moves) if(m.score < bestScore){ bestScore = m.score; bestMove = m; }
    }
    return bestMove;
  }

  // evaluate board: return AI/HUMAN if someone wins, 'D' for draw, null otherwise
  function evaluate(b){
    // rows, cols, diags
    for(let i=0;i<SIZE;i++){
      if(b[i][0] && b[i][0] === b[i][1] && b[i][1] === b[i][2]) return b[i][0];
      if(b[0][i] && b[0][i] === b[1][i] && b[1][i] === b[2][i]) return b[0][i];
    }
    if(b[0][0] && b[0][0] === b[1][1] && b[1][1] === b[2][2]) return b[0][0];
    if(b[0][2] && b[0][2] === b[1][1] && b[1][1] === b[2][0]) return b[0][2];
    // draw?
    if(b.flat().every(x => x !== null)) return 'D';
    return null;
  }

  // Scores
  function updateScores(){
    scoreXEl.textContent = scores.X;
    scoreOEl.textContent = scores.O;
    scoreDEl.textContent = scores.D;
  }

  // Buttons
  restartBtn.addEventListener('click', () => {
    initBoard();
    playing = true;
    turnEl.textContent = `${HUMAN} (Siz)`;
    msgEl.textContent = 'Yangi o‘yin — boshlash uchun katakka bosing.';
  });

  resetScoresBtn.addEventListener('click', () => {
    scores = { X:0, O:0, D:0 };
    updateScores();
    msgEl.textContent = 'Hisoblar tiklandi.';
  });

  // Start
  initBoard();
  updateScores();

})();