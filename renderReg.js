import { registration } from "./api.js";
import { fetchAndRenderComments, setAuth, setToken, setUserName } from "./main.js";
import { renderLogin } from "./renderLogin.js";

export const renderReg = () => {
  const appEl = document.getElementById("app");
  appEl.innerHTML = `<div class="container">
    <div class="login-body">
        <p class="content-name">Регистрация</p>
          <form class="login-form">
           <input
            id="nameInput"
            type="text"
            class="add-form-name"
            placeholder="Введите никнейм"
          />
               <input
            id="loginInput"
            type="text"
            class="add-form-name"
            placeholder="Введите логин"
          />
             <input
            id="passwordInput"
            type="password"
            class="add-form-name"
            placeholder="Введите пароль"
          />
             <button class="login-button" id="regButton">
              Зарегистрироваться
            </button>
          </form>
          <p id="authBtn" class="reg-in-login">Авторизоваться</p>
          </div>
          </div>`;

  const regButtonEl = document.getElementById("regButton");
  const loginInputEl = document.getElementById("loginInput");
  const nameInputEl = document.getElementById("nameInput");
  const passwordInputEl = document.getElementById("passwordInput");
  const authBtnEl = document.getElementById("authBtn");

  regButtonEl.addEventListener("click", (e) => {
    e.preventDefault();
    registration({
      login: loginInputEl.value,
      name: nameInputEl.value,
      password: passwordInputEl.value,
    }).then((res) => {
        setAuth(true)
        setUserName(res.user.name);
        setToken(res.user.token)
        fetchAndRenderComments()
    });
  });

  authBtnEl.addEventListener("click", (e) => {
    e.preventDefault();
    renderLogin();
  });
};
