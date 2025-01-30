import { getComments, postComments } from "./api.js";
("use strict");
let commentsfromAPI = [];

const contentEl = document.getElementById("content");
const addButtonEl = document.getElementById("addButton");
const nameInputEl = document.getElementById("nameInput");
const commentInputEl = document.getElementById("commentInput");
const commentListEl = document.getElementById("commentList");

//функция имитации загрузки API для лайков
function delay(interval = 300) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, interval);
  });
}

nameInputEl.addEventListener("input", () => {
  addButtonEl.disabled = false;
});
commentInputEl.addEventListener("input", () => {
  addButtonEl.disabled = false;
});

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
  commentListEl.innerHTML = commentsHtml;
  initLikeBtnListener();
  console.log("render page");
};

const fetchAndRenderComments = () => {
  getComments()
    .then((resData) => {
      commentsfromAPI = resData.comments;
      document.getElementById("addForm").classList.add("add-form");
      document.getElementById("loadish").classList.add("disable");
      return renderComments();
    })
    .catch((error) => {
      alert("Пропал интернет соединение");
      console.log(error);
    });
};

fetchAndRenderComments();

// Событие клика на кнопку "Написать"
addButtonEl.addEventListener("click", (e) => {
  e.preventDefault();
  console.log('added new comment clicked "Написать"');
  if (nameInputEl.value === "") {
    alert("Введите имя");
  } else {
    if (commentInputEl.value === "") {
      alert("Введите комментарий");
    } else {
      document.getElementById("addForm").classList.remove("add-form");
      document.getElementById("loadish").classList.remove("disable");
      postComments({
        id: commentsfromAPI.length + 1,
        userText: commentInputEl.value,
        userName: nameInputEl.value,
      })
        .then(() => {
          document.getElementById("addForm").classList.add("add-form");
          document.getElementById("loadish").classList.add("disable");
          fetchAndRenderComments();
        })
        .catch((error) => {
          document.getElementById("addForm").classList.add("add-form");
          document.getElementById("loadish").classList.add("disable");
          console.log(error);
          alert("Пропал интернет соединение");
        });
    }
  }
});
