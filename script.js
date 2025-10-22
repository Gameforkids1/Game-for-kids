// Router básico
const buttons = document.querySelectorAll('.tab-btn');
buttons.forEach(btn => btn.addEventListener('click', () => showView(btn.dataset.view)));
function showView(view){
  document.querySelectorAll('.view').forEach(v => v.classList.remove('visible'));
  document.getElementById('view-' + view).classList.add('visible');
}

// ====== 1) Figuras ======
const sh = {
  faciles: ["círculo","cuadrado","triángulo"],
  dificiles: ["pentágono","hexágono","estrella"],
  todas: [], actual: "", score: 0, time: 30, timer: null
};
const shCanvas = document.getElementById('sh-canvas');
const shCtx = shCanvas.getContext('2d');
const shInstruction = document.getElementById('sh-instruction');
const shScore = document.getElementById('sh-score');
const shTime = document.getElementById('sh-time');
const shBtns = document.getElementById('sh-btns');

function sh_reset(){
  sh.todas = [...sh.faciles];
  sh.score = 0; sh.time = 30;
  shScore.textContent = sh.score;
  shTime.textContent = sh.time;
  sh_enableBtns();
  sh_newFigure();
  if(sh.timer) clearInterval(sh.timer);
  sh.timer = setInterval(()=>{
    sh.time--;
    shTime.textContent = sh.time;
    if(sh.time<=0){ clearInterval(sh.timer); shInstruction.textContent = "¡Tiempo terminado!"; }
  },1000);
}
function sh_enableBtns(){
  [...shBtns.querySelectorAll('button')].forEach(b => b.disabled = !sh.todas.includes(b.dataset.shape));
}
function sh_newFigure(){
  sh.actual = sh.todas[Math.floor(Math.random()*sh.todas.length)];
  shInstruction.textContent = `Dibuja: ${sh.actual[0].toUpperCase()+sh.actual.slice(1)}`;
  shCtx.clearRect(0,0,shCanvas.width,shCanvas.height);
}
function sh_draw(shape){
  shCtx.clearRect(0,0,shCanvas.width,shCanvas.height);
  shCtx.beginPath();
  switch(shape){
    case "círculo":
      shCtx.arc(130,130,70,0,Math.PI*2); break;
    case "cuadrado":
      shCtx.rect(60,60,140,140); break;
    case "triángulo":
      shCtx.moveTo(130,40); shCtx.lineTo(40,220); shCtx.lineTo(220,220); shCtx.closePath(); break;
    case "pentágono":
      sh_polygon(130,130,80,5); break;
    case "hexágono":
      sh_polygon(130,130,80,6); break;
    case "estrella":
      sh_star(130,130,5,80,34); break;
  }
  shCtx.stroke();
  if(shape === sh.actual){
    sh.score++;
    shScore.textContent = sh.score;
    if(sh.score===3) sh.todas = [...sh.faciles, "pentágono"];
    if(sh.score===6) sh.todas = [...sh.faciles, ...sh.dificiles];
    sh_enableBtns();
    sh_newFigure();
  }
}
function sh_polygon(x,y,r,sides){
  const ang = (Math.PI*2)/sides;
  shCtx.moveTo(x + r*Math.cos(0), y + r*Math.sin(0));
  for(let i=1;i<=sides;i++){
    shCtx.lineTo(x + r*Math.cos(i*ang), y + r*Math.sin(i*ang));
  }
}
function sh_star(cx,cy,sp,outer,inner){
  let rot = Math.PI/2*3, x=cx, y=cy, step = Math.PI/sp;
  shCtx.moveTo(cx, cy-outer);
  for(let i=0;i<sp;i++){
    x=cx+Math.cos(rot)*outer; y=cy+Math.sin(rot)*outer; shCtx.lineTo(x,y); rot+=step;
    x=cx+Math.cos(rot)*inner; y=cy+Math.sin(rot)*inner; shCtx.lineTo(x,y); rot+=step;
  }
  shCtx.lineTo(cx,cy-outer); shCtx.closePath();
}
shBtns.addEventListener('click', (e)=>{
  if(e.target.matches('button[data-shape]')) sh_draw(e.target.dataset.shape);
});
// Inicializar al entrar a la vista
document.querySelector('[data-view="shapes"]').addEventListener('click', sh_reset);

// ====== 2) Sumas ======
let adDifficulty = 1, adScore = 0, adTime = 60, adTimer=null, adCorrect;
const adProblem = document.getElementById('ad-problem');
const adAnswer = document.getElementById('ad-answer');
document.getElementById('ad-ok').addEventListener('click', ad_check);
function ad_start(){
  adDifficulty = 1; adScore = 0; adTime = 60;
  document.getElementById('ad-score').textContent = adScore;
  document.getElementById('ad-time').textContent = adTime;
  ad_generate();
  if(adTimer) clearInterval(adTimer);
  adTimer = setInterval(()=>{
    adTime--;
    document.getElementById('ad-time').textContent = adTime;
    if(adTime<=0){ clearInterval(adTimer); adProblem.textContent="¡Tiempo terminado!"; }
  },1000);
}
function ad_generate(){
  const n1 = Math.floor(Math.random()*(5*adDifficulty))+1;
  const n2 = Math.floor(Math.random()*(5*adDifficulty))+1;
  const n3 = (adDifficulty>=3)? Math.floor(Math.random()*(5*adDifficulty))+1 : 0;
  if(adDifficulty>=3){
    adCorrect = n1+n2+n3;
    adProblem.textContent = `${n1} + ${n2} + ${n3} = ?`;
  } else {
    adCorrect = n1+n2;
    adProblem.textContent = `${n1} + ${n2} = ?`;
  }
  adAnswer.value = ""; adAnswer.focus();
}
function ad_check(){
  const val = parseInt(adAnswer.value,10);
  if(val === adCorrect){
    adScore++;
    if(adScore%3===0) adDifficulty++;
    document.getElementById('ad-score').textContent = adScore;
  }
  ad_generate();
}
document.querySelector('[data-view="adds"]').addEventListener('click', ad_start);

// ====== 3) Restas ======
let suScore=0, suErrors=0, suDifficulty=1, suCorrect;
const suProblem = document.getElementById('su-problem');
const suAnswer = document.getElementById('su-answer');
document.getElementById('su-ok').addEventListener('click', su_check);
function su_start(){
  suScore=0; suErrors=0; suDifficulty=1;
  document.getElementById('su-score').textContent = suScore;
  document.getElementById('su-errors').textContent = suErrors;
  su_generate();
}
function su_generate(){
  let n1 = Math.floor(Math.random()*(5*suDifficulty))+1;
  let n2 = Math.floor(Math.random()*(5*suDifficulty))+1;
  if(n2>n1) [n1,n2] = [n2,n1];
  suCorrect = n1-n2;
  suProblem.textContent = `${n1} - ${n2} = ?`;
  suAnswer.value=""; suAnswer.focus();
}
function su_check(){
  const val = parseInt(suAnswer.value,10);
  if(val===suCorrect){
    suScore++;
    if(suScore%3===0) suDifficulty++;
    document.getElementById('su-score').textContent = suScore;
  } else {
    suErrors++; document.getElementById('su-errors').textContent = suErrors;
    if(suErrors>=5){ alert("¡Has cometido 5 errores! Se reinicia."); su_start(); return; }
  }
  su_generate();
}
document.querySelector('[data-view="subs"]').addEventListener('click', su_start);

// ====== 4) Multiplicaciones ======
let muLevel=1, muStreak=0, muErrors=0, muCorrect;
const muMax = {1:5,2:8,3:12,4:15,5:20};
const muAnswer = document.getElementById('mu-answer');
document.getElementById('mu-ok').addEventListener('click', mu_check);
function mu_start(){
  muLevel=1; muStreak=0; muErrors=0;
  mu_update();
  mu_generate();
}
function mu_update(){
  document.getElementById('mu-level').textContent = muLevel;
  document.getElementById('mu-streak').textContent = muStreak;
  document.getElementById('mu-errors').textContent = muErrors;
}
function mu_generate(){
  const max = muMax[muLevel];
  const a = Math.floor(Math.random()*max)+1;
  const b = Math.floor(Math.random()*max)+1;
  muCorrect = a*b;
  document.getElementById('mu-problem').textContent = `${a} × ${b} = ?`;
  muAnswer.value=""; muAnswer.focus();
}
function mu_check(){
  const val = parseInt(muAnswer.value,10);
  if(val===muCorrect){
    muStreak++;
    if(muStreak>=5 && muLevel<5){
      muLevel++; muStreak=0; alert(`¡Felicidades! Pasaste al nivel ${muLevel}`);
    }
  } else {
    muErrors++; muStreak=0;
    if(muErrors>=3){ alert("¡Has cometido 3 errores! Se reinicia."); mu_start(); return; }
  }
  mu_update(); mu_generate();
}
document.querySelector('[data-view="mults"]').addEventListener('click', mu_start);

// ====== 5) Operaciones aleatorias ======
let opNumbers=[], opSelected=[], opDifficulty=2, opScore=0, opErrors=0, opOperation="+";
const opContainer = document.getElementById('op-numbers');
document.getElementById('op-ok').addEventListener('click', op_check);
document.getElementById('op-new').addEventListener('click', op_generate);
function op_start(){
  opNumbers=[]; opSelected=[]; opDifficulty=2; opScore=0; opErrors=0;
  document.getElementById('op-score').textContent = opScore;
  document.getElementById('op-errors').textContent = opErrors;
  document.getElementById('op-need').textContent = opDifficulty;
  op_generate();
}
function op_generate(){
  opNumbers=[]; opSelected=[]; opContainer.innerHTML="";
  for(let i=0;i<10;i++){
    const n = Math.floor(Math.random()*(5*opDifficulty))+1;
    opNumbers.push(n);
    const div = document.createElement('div');
    div.className = 'number'; div.textContent = n;
    div.addEventListener('click', ()=>op_toggle(i,div));
    opContainer.appendChild(div);
  }
}
function op_toggle(index, el){
  const pos = opSelected.indexOf(index);
  if(pos>=0){ opSelected.splice(pos,1); el.classList.remove('selected'); }
  else if(opSelected.length<opDifficulty){ opSelected.push(index); el.classList.add('selected'); }
}
function op_chooseOperation(){ const ops=["+","-","×"]; opOperation = ops[Math.floor(Math.random()*ops.length)]; }
function op_calc(nums){
  if(opOperation==="+") return nums.reduce((a,b)=>a+b,0);
  if(opOperation==="×") return nums.reduce((a,b)=>a*b,1);
  // resta
  return nums.reduce((a,b)=>a-b);
}
function op_check(){
  if(opSelected.length!==opDifficulty){ alert(`Debes elegir exactamente ${opDifficulty} número(s).`); return; }
  op_chooseOperation();
  const chosen = opSelected.map(i=>opNumbers[i]);
  const correct = op_calc(chosen);
  const ans = parseInt(prompt(`¿Cuánto es ${chosen.join(` ${opOperation} `)} ?`),10);
  if(ans===correct){
    opScore++; if(opScore%3===0 && opDifficulty<4) opDifficulty++;
    document.getElementById('op-score').textContent = opScore;
  } else {
    opErrors++; document.getElementById('op-errors').textContent = opErrors;
    if(opErrors>=5){ alert("¡Has cometido 5 errores! Se reinicia."); op_start(); return; }
  }
  document.getElementById('op-need').textContent = opDifficulty;
  op_generate();
}
document.querySelector('[data-view="ops"]').addEventListener('click', op_start);

// ====== 6) Inglés básico (10 ejercicios) ======
const enExercises = [
  { type:"mc", q:"¿Cómo se dice 'gato' en inglés?", options:["cat","dog","cow"], answer:0 },
  { type:"mc", q:"Color de 'sky' normalmente es…", options:["green","blue","red"], answer:1 },
  { type:"input", q:"Completa: She __ my friend. (is/are)", answer:"is" },
  { type:"input", q:"Escribe el artículo correcto: __ apple (a/an)", answer:"an" },
  { type:"mc", q:"Select the animal that can fly:", options:["fish","bird","cow"], answer:1 },
  { type:"input", q:"Traduce al inglés: 'libro'", answer:"book" },
  { type:"input", q:"Completa: I __ 10 years old. (am/is/are)", answer:"am" },
  { type:"mc", q:"Choose the correct plural of 'bus':", options:["buss","buses","busies"], answer:1 },
  { type:"input", q:"Traduce al español: 'house'", answer:"casa" },
  { type:"mc", q:"Which one is a fruit?", options:["car","apple","chair"], answer:1 }
];
let enIndex=0, enScore=0, enChecked=false;
const enCard = document.getElementById('en-card');
const enFeedback = document.getElementById('en-feedback');
function en_render(){
  document.getElementById('en-index').textContent = enIndex+1;
  document.getElementById('en-score').textContent = enScore;
  enFeedback.textContent = "Lee la consigna y responde."; enFeedback.style.color="";
  const ex = enExercises[enIndex];
  enCard.innerHTML = "";
  const q = document.createElement('div'); q.className="en-q"; q.textContent = ex.q; enCard.appendChild(q);
  if(ex.type==="mc"){
    const wrap = document.createElement('div'); wrap.className="en-options";
    ex.options.forEach((opt,i)=>{
      const label = document.createElement('label');
      const radio = document.createElement('input'); radio.type="radio"; radio.name="en-opt"; radio.value=i;
      label.appendChild(radio); label.appendChild(document.createTextNode(opt));
      wrap.appendChild(label);
    });
    enCard.appendChild(wrap);
  } else {
    const input = document.createElement('input'); input.className="en-input"; input.type="text"; input.id="en-input";
    input.placeholder = "Escribe tu respuesta"; enCard.appendChild(input);
    setTimeout(()=>input.focus(),0);
  }
  enChecked=false;
}
function en_check(){
  if(enChecked){ enFeedback.textContent="Ya comprobaste este ejercicio. Avanza al siguiente."; return; }
  const ex = enExercises[enIndex];
  let ok=false;
  if(ex.type==="mc"){
    const selected = document.querySelector('input[name="en-opt"]:checked');
    if(!selected){ enFeedback.textContent="Elige una opción."; return; }
    ok = parseInt(selected.value,10)===ex.answer;
  } else {
    const val = (document.getElementById('en-input').value||"").trim().toLowerCase();
    ok = val === ex.answer.toLowerCase();
  }
  if(ok){ enScore++; document.getElementById('en-score').textContent = enScore; enFeedback.textContent="¡Correcto!"; enFeedback.style.color="#0b7e7d"; }
  else { enFeedback.textContent = `Incorrecto. Respuesta: ${ex.type==="mc"? ex.options[ex.answer] : ex.answer}`; enFeedback.style.color="var(--danger)"; }
  enChecked=true;
}
function en_next(){ if(enIndex<enExercises.length-1){ enIndex++; en_render(); } }
function en_prev(){ if(enIndex>0){ enIndex--; en_render(); } }
function en_reset(){ enIndex=0; enScore=0; en_render(); }
document.getElementById('en-check').addEventListener('click', en_check);
document.getElementById('en-next').addEventListener('click', en_next);
document.getElementById('en-prev').addEventListener('click', en_prev);
document.getElementById('en-reset').addEventListener('click', en_reset);
document.querySelector('[data-view="english"]').addEventListener('click', ()=>{ en_reset(); });

// Accesibilidad básica: Enter para confirmar en vistas con input
['ad','su','mu'].forEach(prefix=>{
  const input = document.getElementById(`${prefix}-answer`);
  if(input){
    input.addEventListener('keydown', (e)=>{ if(e.key==='Enter') document.getElementById(`${prefix}-ok`).click(); });
  }
});