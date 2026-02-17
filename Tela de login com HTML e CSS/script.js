/* =========================================================
   UTILITÁRIOS (helpers)
   ========================================================= */
/**
 * Lê o "banco" de usuários do localStorage.
 * Se não existir, devolve um array vazio.
 */
function getUsers() {
  const raw = localStorage.getItem("users");
  return raw ? JSON.parse(raw) : [];
}
/**
 * Salva o "banco" de usuários no localStorage.
 */
function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}
/**
 * Salva a sessão do usuário logado.
 */
function setSession(username) {
  localStorage.setItem("sessionUser", username);
}
/**
 * Retorna o usuário logado (ou null).
 */
function getSession() {
  return localStorage.getItem("sessionUser");
}
/**
 * Remove a sessão (logout).
 */
function clearSession() {
  localStorage.removeItem("sessionUser");
}
/**
 * Mostra mensagens (erro/sucesso) em um elemento.
 */
function setMessage(el, type, text) {
  el.classList.remove("error", "success");
  if (type) el.classList.add(type);
  el.textContent = text || "";
}
/* =========================================================
   VALIDAÇÕES
   ========================================================= */
/**
 * Valida e-mail com regex simples e confiável para front-end.
 */
function isValidEmail(email) {
  // regex simples: texto@texto.dominio
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}
/**
 * Regras de senha forte:
 * - mínimo 8 caracteres
 * - 1 letra minúscula
 * - 1 letra maiúscula
 * - 1 número
 * - 1 símbolo
 */
function isStrongPassword(pass) {
  const minLen = pass.length >= 8;
  const hasLower = /[a-z]/.test(pass);
  const hasUpper = /[A-Z]/.test(pass);
  const hasNumber = /[0-9]/.test(pass);
  const hasSymbol = /[^A-Za-z0-9]/.test(pass);
  return minLen && hasLower && hasUpper && hasNumber && hasSymbol;
}
/**
 * Valida nome (apenas checa se tem pelo menos 2 palavras e tamanho mínimo).
 */
function isValidName(name) {
  const trimmed = name.trim();
  if (trimmed.length < 6) return false; // evita nomes muito curtos
  return trimmed.split(/\s+/).length >= 2; // exige pelo menos 2 palavras
}
/**
 * Valida usuário (sem espaços, 3 a 20 caracteres).
 */
function isValidUsername(username) {
  return /^[A-Za-z0-9_.-]{3,20}$/.test(username);
}
/* =========================================================
   SELETORES
   ========================================================= */
const wrapper = document.getElementById("wrapper");
// Links de troca
const goRegister = document.getElementById("goRegister");
const goLogin = document.getElementById("goLogin");
// Forms
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");
// Campos login
const loginUser = document.getElementById("loginUser");
const loginPass = document.getElementById("loginPass");
// Campos cadastro
const regName = document.getElementById("regName");
const regEmail = document.getElementById("regEmail");
const regUser = document.getElementById("regUser");
const regPass = document.getElementById("regPass");
const regPass2 = document.getElementById("regPass2");
// Mensagens
const loginMsg = document.getElementById("loginMsg");
const registerMsg = document.getElementById("registerMsg");
// “Logged box”
const loggedBox = document.getElementById("loggedBox");
const loggedUser = document.getElementById("loggedUser");
const logoutBtn = document.getElementById("logoutBtn");
// Link "esqueci senha"
const forgotLink = document.getElementById("forgotLink");
/* =========================================================
   TROCA DE TELAS
   ========================================================= */
goRegister.addEventListener("click", (e) => {
  e.preventDefault();
  wrapper.classList.add("show-register");
  // limpa mensagens
  setMessage(registerMsg, "", "");
  setMessage(loginMsg, "", "");
});
goLogin.addEventListener("click", (e) => {
  e.preventDefault();
  wrapper.classList.remove("show-register");
  // limpa mensagens
  setMessage(registerMsg, "", "");
  setMessage(loginMsg, "", "");
});
/* =========================================================
   ESQUECI SENHA (sem backend)
   ========================================================= */
forgotLink.addEventListener("click", (e) => {
  e.preventDefault();
  alert("Sem backend: aqui você integraria o fluxo de recuperação de senha.");
});
/* =========================================================
   CADASTRO (salva no localStorage)
   ========================================================= */
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // limpa mensagem anterior
  setMessage(registerMsg, "", "");
  const name = regName.value.trim();
  const email = regEmail.value.trim();
  const username = regUser.value.trim();
  const pass = regPass.value;
  const pass2 = regPass2.value;
  // 1) valida nome
  if (!isValidName(name)) {
    setMessage(registerMsg, "error", "Informe seu nome completo (nome e sobrenome).");
    return;
  }
  // 2) valida email
  if (!isValidEmail(email)) {
    setMessage(registerMsg, "error", "E-mail inválido. Exemplo: nome@dominio.com");
    return;
  }
  // 3) valida usuário
  if (!isValidUsername(username)) {
    setMessage(registerMsg, "error", "Usuário inválido. Use 3-20 caracteres: letras, números, _ . -");
    return;
  }
  // 4) senha forte
  if (!isStrongPassword(pass)) {
    setMessage(
      registerMsg,
      "error",
      "Senha fraca. Use 8+ caracteres, maiúscula, minúscula, número e símbolo."
    );
    return;
  }
  // 5) confirmar senha
  if (pass !== pass2) {
    setMessage(registerMsg, "error", "As senhas não conferem.");
    return;
  }
  // Carrega usuários
  const users = getUsers();
  // 6) checa se usuário já existe
  const userExists = users.some((u) => u.username.toLowerCase() === username.toLowerCase());
  if (userExists) {
    setMessage(registerMsg, "error", "Esse usuário já existe. Escolha outro.");
    return;
  }
  // 7) checa se email já existe
  const emailExists = users.some((u) => u.email.toLowerCase() === email.toLowerCase());
  if (emailExists) {
    setMessage(registerMsg, "error", "Esse e-mail já está cadastrado.");
    return;
  }
  // 8) cria usuário (simulação)
  // OBS: para projeto real, NUNCA salve senha assim. Aqui é apenas didático.
  users.push({
    name,
    email,
    username,
    password: pass,
    createdAt: new Date().toISOString(),
  });
  // Salva no localStorage
  saveUsers(users);
  // Mensagem de sucesso
  setMessage(registerMsg, "success", "Conta criada com sucesso! Agora faça login.");
  // Limpa o formulário
  registerForm.reset();
  // Volta pro login
  wrapper.classList.remove("show-register");
});
/* =========================================================
   LOGIN (compara com localStorage)
   ========================================================= */
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  // limpa mensagem anterior
  setMessage(loginMsg, "", "");
  const username = loginUser.value.trim();
  const pass = loginPass.value;
  // validações básicas
  if (!username || !pass) {
    setMessage(loginMsg, "error", "Preencha usuário e senha.");
    return;
  }
  const users = getUsers();
  // procura usuário
  const user = users.find((u) => u.username.toLowerCase() === username.toLowerCase());
  if (!user) {
    setMessage(loginMsg, "error", "Usuário não encontrado. Faça o cadastro.");
    return;
  }
  // confere senha
  if (user.password !== pass) {
    setMessage(loginMsg, "error", "Senha incorreta.");
    return;
  }
  // login ok: cria sessão
  setSession(user.username);
  // Atualiza UI
  showLoggedState(user.username);
  // Limpa campos do login
  loginForm.reset();
  setMessage(loginMsg, "success", "Login realizado com sucesso!");
});
/* =========================================================
   ESTADO LOGADO (UI)
   ========================================================= */
/**
 * Mostra a área “logado” e esconde o form de login.
 */
function showLoggedState(username) {
  loggedUser.textContent = username;
  // esconde o form e mostra o box logado
  loginForm.style.display = "none";
  loggedBox.hidden = false;
}
/**
 * Volta para o estado “deslogado”.
 */
function showLoggedOutState() {
  loginForm.style.display = "flex";
  loggedBox.hidden = true;
}
/* Botão logout */
logoutBtn.addEventListener("click", () => {
  clearSession();
  showLoggedOutState();
  setMessage(loginMsg, "success", "Você saiu da conta.");
});
/* =========================================================
   AUTO-LOGIN (se houver sessão salva)
   ========================================================= */
const sessionUser = getSession();
if (sessionUser) {
  // Se existe sessão, já mostra estado logado
  showLoggedState(sessionUser);
}
