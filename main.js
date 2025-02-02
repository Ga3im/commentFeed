import { getComments, postComments } from "./api.js";
import { renderLogin } from "./renderLogin.js";
("use strict");
let commentsfromAPI = [];
let isAuth = false;
let userName = "";
let token = "";

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
              }" data-id="${comment.id}" ></button>
            </div>
          </div>
        </li>`;
    })
    .join("");
  appEl.innerHTML = ` <div id="content" class="container">
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
  const nameInputEl = document.getElementById("nameInput");
  const commentInputEl = document.getElementById("commentInput");
  const authButtonEl = document.getElementById("auth-btn");

  // Событие клика на кнопку "Написать"
  if (isAuth) {
    nameInputEl.value = userName;

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
  }
  if (!isAuth) {
    authButtonEl.addEventListener("click", () => {
      renderLogin();
    });
  }

  // Событие при нажатии на лайк
  const initLikeBtnListener = () => {
    const likeButtonsEl = document.querySelectorAll(".like-button");
    for (const likeButtonEl of likeButtonsEl) {
      let id = Number(likeButtonEl.dataset.id);
      likeButtonEl.addEventListener("click", (e) => {
        e.preventDefault();
        likeButtonEl.classList.add("loading-like");
        commentsfromAPI.map((comment) => {
          if (comment.id === id) {
            delay(2000).then(() => {
              likeButtonEl.classList.remove("loading-like");
              if (comment.isLiked) {
                --comment.likes;
                comment.isLiked = false;
                console.log(`disLikedd comment, id:${comment.id}`);
              } else {
                ++comment.likes;
                comment.isLiked = true;
                console.log(`liked comment, id:${comment.id}`);
              }
              fetchAndRenderComments();
            });
          }
        });
      });
    }
  };

  initLikeBtnListener();
  console.log("render page");
};

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
