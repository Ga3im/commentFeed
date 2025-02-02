"use strict";
import { delComment, getComments, like, postComments } from "./api.js";
import { renderLogin } from "./renderLogin.js";
let commentsfromAPI = [];
let isAuth = localStorage.getItem("isAuth");
let userName = localStorage.getItem("myName");
let token = localStorage.getItem("myToken");
let id = localStorage.getItem("myId");
let quoteName = "";
let quoteText = "";

export const setId = (newId) => {
  id = newId;
};
export const setAuth = (newIsAuth) => {
  isAuth = newIsAuth;
};
export const setToken = (newToken) => {
  token = newToken;
};
export const setUserName = (newName) => {
  userName = newName;
};

const appEl = document.getElementById("app");

//функция имитации загрузки API для лайков
function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}

// Отрисовка комментариев через JS массив
const renderComments = () => {
  const commentsHtml = commentsfromAPI
    .map((comment) => {
      return `<li class="comment">
          <div class="comment-header">
            <div>${comment.author.name}</div>
            <div>${comment.date}</div>
          </div>
          <div class="comment-body" data-id="${comment.id}">             
                <div class="comment-text">${comment.text}</div>
          </div>
          <div class="comment-footer">
            <div class="likes">
              <span class="likes-counter">${comment.likes}</span>
              <button id="likeBtn" class="like-button ${
                comment.isLiked ? "-active-like" : ""
              }" data-id="${comment.id}"></button>
            </div>
          </div>
                ${
                  localStorage.getItem("myId") === comment.author.login
                    ? `<button class="del-btn" data-id="${comment.id}">Удалить</button>`
                    : ""
                }
        </li>`;
    })
    .join("");
  appEl.innerHTML = ` 
  ${
    isAuth
      ? `<p id="main-logout-button" class="login-logout-button">
        Выйти
      </p>`
      : ` <p id="main-login-button" class="login-logout-button">
        Войти
      </p>`
  }
  <div id="content" class="container">
      <ul id="commentList" class="comments">${commentsHtml}</ul>
      ${
        isAuth
          ? `<div id="addForm" class="add-form">
        <input
          id="nameInput"
          type="text"
          class="add-form-name-full"
          readonly
        />
        <div id="quoteCom" class="disable">
          <div class="quote-content">
            <p id="quoteComment"></p>
            <div id="close-quote" class="close-quote-btn" >x</div>
          </div>
          <p class="quote-name" id="quoteName"></p>
        </div>
        <textarea
          id="commentInput"
          type="textarea"
          class="add-form-text"
          placeholder="Введите ваш коментарий"
          rows="4"
        ></textarea>
        <div class="add-form-row">
          <button class="add-form-button" id="addButton">
            Написать
          </button>
        </div>
      </div>
    </div>`
          : `<div class="auth-content">Чтобы оставить комментарий, <span id="auth-btn" class="auth-button">Авторизуйтесь</span></div>`
      }`;

  const addButtonEl = document.getElementById("addButton");
  const commentInputEl = document.getElementById("commentInput");
  const authButtonEl = document.getElementById("auth-btn");
  const mainLoginButtonEl = document.getElementById("main-login-button");
  const mainLogoutButtonEl = document.getElementById("main-logout-button");
  const quoteComEl = document.getElementById("quoteCom");
  const closeQuoteEl = document.getElementById("close-quote");

  if (isAuth) {
    const nameInputEl = document.getElementById("nameInput");
    const delBtnEl = document.querySelectorAll(".del-btn");
    const commentBodyEl = document.querySelectorAll(".comment-body");

    nameInputEl.value = userName;

    //Удаление

    for (const delBtn of delBtnEl) {
      let id = delBtn.dataset.id;
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        delComment({ id: id, token: token }).then(() => {
          fetchAndRenderComments();
        });
      });
    }

    // Событие клика на кнопку "Написать"
    addButtonEl.addEventListener("click", (e) => {
      e.preventDefault();
      console.log('added new comment clicked "Написать"');
      postComments({
        text: commentInputEl.value,
        token: token,
      })
        .then(() => {
          fetchAndRenderComments();
        })
        .catch((error) => {
          console.log(error);
        });
    });
    // кнопка выйти
    mainLogoutButtonEl.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.clear();
      isAuth = false;
      fetchAndRenderComments();
    });
  }
  // авторизация
  if (!isAuth) {
    authButtonEl.addEventListener("click", (e) => {
      e.preventDefault();
      renderLogin();
    });
    mainLoginButtonEl.addEventListener("click", (e) => {
      e.preventDefault();
      renderLogin();
    });
  }
  // ответ на комментарий
  const quoteEl = document.getElementById("quoteComment");
  const quoteNameEl = document.getElementById("quoteName");
  for (const commentBody of commentBodyEl) {
    let id = commentBody.dataset.id;
    commentBody.addEventListener("click", (e) => {
      e.preventDefault();
      quoteComEl.classList.remove("disable");
      quoteComEl.classList.add("quote");
      quoteEl.scrollIntoView({ behavior: "smooth" });
      commentsfromAPI.map((comment) => {
        if (id === comment.id) {
          quoteText = comment.text;
          quoteName = `©${comment.author.name}`;
          quoteEl.textContent = comment.text;
          quoteNameEl.textContent = `© ${comment.author.name}`;
        }
      });
      closeQuoteEl.addEventListener("click", (e) => {
        e.stopPropagation();
        quoteComEl.classList.add("disable");
        quoteComEl.classList.remove("quote");
      });
    });
  }

  // Событие при нажатии на лайк
  const initLikeBtnListener = () => {
    const likeButtonsEl = document.querySelectorAll(".like-button");
    for (const likeButtonEl of likeButtonsEl) {
      let id = likeButtonEl.dataset.id;
      likeButtonEl.addEventListener("click", (e) => {
        e.preventDefault();
        like({ id: id, token: token }).then((res) => {
          console.log(res.result.isLiked);
          fetchAndRenderComments();
        });
      });
    }
  };

  initLikeBtnListener();
  console.log("render page");
};
// рендер данных из Api
export const fetchAndRenderComments = () => {
  getComments()
    .then((resData) => {
      commentsfromAPI = resData.comments;
      return renderComments();
    })
    .catch((error) => {
      console.log(error);
    });
};

fetchAndRenderComments();
