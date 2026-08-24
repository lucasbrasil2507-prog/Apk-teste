// ================== CONFIG ==================
const API_BASE         = "https://brisol.top";
const ENDPOINT_BALANCE = "/getBalanceInfo";
const ENDPOINT_REWARD  = "/receiveReward";
const TEST_USER_ID     = "67507";
const REWARD           = 500;
const INTERVAL         = 60; // segundos

// Cole o token aqui quando tiver (ex: "Bearer eyJhbG..." ou só o valor)
const AUTH_HEADER = "";
// ============================================

const balanceEl  = document.getElementById("balance");
const balance2El = document.getElementById("balance2");
const timerEl    = document.getElementById("timer");
const claimBtn   = document.getElementById("claimBtn");
const statusEl   = document.getElementById("status");
const serverEl   = document.getElementById("serverResponse");
const ring       = document.querySelector(".timer-ring");

let balance = 15;
let endAt = 0;
let ready = false;
let timerHandle = null;

function headers() {
  const h = {
    "Content-Type": "application/json",
    "Accept": "application/json"
  };
  if (AUTH_HEADER && AUTH_HEADER.trim()) {
    const t = AUTH_HEADER.trim();
    if (t.toLowerCase().startsWith("bearer ")) {
      h["Authorization"] = t;
    } else {
      h["Authorization"] = "Bearer " + t;
      h["token"] = t;
    }
  }
  return h;
}

function showServer(msg, isError = false) {
  if (!serverEl) return;
  serverEl.textContent = typeof msg === "string" ? msg : JSON.stringify(msg, null, 2);
  serverEl.style.color = isError ? "#c0392b" : "#1e7e34";
}

async function api(path, body = null) {
  const url = API_BASE.replace(/\/$/, "") + path;
  const opts = { method: "POST", headers: headers() };
  if (body !== null) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { ok: res.ok, status: res.status, data };
}

function extractBalance(d) {
  if (!d || typeof d !== "object") return null;
  return d.balance ?? d.data?.balance ?? d.amount ?? d.money ??
         d.data?.amount ?? d.result?.balance ?? d.data?.money ?? null;
}

async function loadBalance() {
  statusEl.textContent = "Buscando saldo no servidor...";
  try {
    const r = await api(ENDPOINT_BALANCE, { id: TEST_USER_ID });
    showServer({ http: r.status, body: r.data }, !r.ok);
    const found = extractBalance(r.data);
    if (found != null) {
      balance = Number(found);
      renderBalance();
      statusEl.textContent = "Saldo carregado do servidor.";
    } else {
      statusEl.textContent = "Servidor respondeu. Campo de saldo não identificado.";
    }
  } catch (e) {
    showServer("Erro de rede: " + e.message, true);
    statusEl.textContent = "Falha de rede. Usando saldo local (15).";
  }
}

function renderBalance() {
  const txt = Number(balance).toLocaleString("pt-BR");
  balanceEl.textContent = txt;
  balance2El.textContent = txt;
}

function setTimer(sec) {
  timerEl.textContent = sec;
  const p = Math.max(0, Math.min(1, 1 - sec / INTERVAL));
  ring.style.background = `conic-gradient(#5c63f2 ${p * 360}deg, #e9ebf5 ${p * 360}deg)`;
}

function startCooldown() {
  ready = false;
  claimBtn.disabled = true;
  endAt = Date.now() + INTERVAL * 1000;
  statusEl.textContent = "Aguarde o contador terminar.";
  tick();
}

function tick() {
  clearInterval(timerHandle);
  timerHandle = setInterval(() => {
    const left = Math.max(0, Math.ceil((endAt - Date.now()) / 1000));
    setTimer(left);
    if (left <= 0) {
      ready = true;
      claimBtn.disabled = false;
      statusEl.textContent = "Recompensa liberada! Pode resgatar.";
      clearInterval(timerHandle);
    }
  }, 200);
}

async function claim() {
  if (!ready) return;
  claimBtn.disabled = true;
  statusEl.textContent = "Enviando resgate para o servidor...";
  try {
    const r = await api(ENDPOINT_REWARD, { id: TEST_USER_ID });
    showServer({ http: r.status, body: r.data }, !r.ok);
    if (r.ok) {
      const found = extractBalance(r.data);
      balance = found != null ? Number(found) : balance + REWARD;
      renderBalance();
      statusEl.textContent = "Servidor aceitou o resgate!";
      startCooldown();
    } else {
      statusEl.textContent = `Servidor recusou (HTTP ${r.status}). Veja a resposta.`;
      claimBtn.disabled = false;
      ready = true;
    }
  } catch (e) {
    showServer("Erro de rede: " + e.message, true);
    statusEl.textContent = "Falha de rede no resgate.";
    claimBtn.disabled = false;
    ready = true;
  }
}

document.getElementById("loginBtn")?.addEventListener("click", () => {
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("rewardScreen").classList.remove("hidden");
  renderBalance();
  loadBalance();
  startCooldown();
});

claimBtn?.addEventListener("click", claim);
renderBalance();
