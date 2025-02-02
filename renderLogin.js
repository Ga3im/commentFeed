import { login } from "./api.js";
import {
  fetchAndRenderComments,
  setAuth,
  setId,
  setToken,
  setUserName,
} from "./main.js";
import { renderReg } from "./renderReg.js";

export const renderLogin = () => {
  const appEl = document.getElementById("app");

  appEl.innerHTML = `<div class="container">
  <div class="login-body">
        <p class="content-name">Авторизация</p>
        <form class="login-form">
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
           <button class="login-button" id="loginButton">
            Войти
          </button>
        </form>
        <p id="regBtn" class="reg-in-login">Зарегистрироваться</p>
        </div>
        </div>`;

  const loginButtonEl = document.getElementById("loginButton");
  const loginInputEl = document.getElementById("loginInput");
  const passwordInputEl = document.getElementById("passwordInput");
  const regBtnEl = document.getElementById("regBtn");

  loginButtonEl.addEventListener("click", (e) => {
    e.preventDefault();
    login({
      login: loginInputEl.value,
      password: passwordInputEl.value,
    })
      .then((res) => {
        fetchAndRenderComments();
        localStorage.setItem("myName", res.user.name);
        localStorage.setItem("myToken", res.user.token);
        localStorage.setItem("isAuth", true);
        localStorage.setItem("myId", res.user.login);
        setAuth(true);
        setId(res.user.login);
        setToken(res.user.token);
        setUserName(res.user.name);
        return res;
      })
      .catch((error) => {
        console.log(error);
      });
  });

  regBtnEl.addEventListener("click", (e) => {
    e.stopPropagation();
    renderReg();
  });
};
