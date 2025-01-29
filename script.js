"use strict";
const URL_API = `https://wedev-api.sky.pro/api/v1/comment-feed/comments`;
let commentsfromAPI = [];

const contentEl = document.getElementById("content");
const addButtonEl = document.getElementById("addButton");
const nameInputEl = document.getElementById("nameInput");
const commentInputEl = document.getElementById("commentInput");
const commentListEl = document.getElementById("commentList");

// функция времени
const funcDate = () => {
  const currentDate = new Date();
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  return currentDate.toLocaleDateString("ru-RU", options);
};

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
      comments.map((comment) => {
        if (comment.id === id) {
          if (comment.isLiked) {
            --comment.likes;
            comment.isLiked = false;
            console.log(`disLikedd comment, id:${comment.id}`);
          } else {
            ++comment.likes;
            comment.isLiked = true;
            console.log(`liked comment, id:${comment.id}`);
          }
        }
      });
      renderComments();
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
              <button class="like-button ${
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

fetch(URL_API, {
  method: "GET",
})
  .then((res) => {
    return res.json();
  })
  .then((resData) => {
    commentsfromAPI = resData.comments;
    document.getElementById("addForm").classList.add("add-form");
    document.getElementById("loadish").classList.add("disable");
    return renderComments();
  });

// Событие клика на кнопку "Написать"
addButtonEl.addEventListener("click", (e) => {
  e.preventDefault();
  document.getElementById("addForm").classList.remove("add-form");
  document.getElementById("loadish").classList.remove("disable");
  if (nameInputEl.value === "") {
    alert("Введите имя");
  } else {
    if (commentInputEl.value === "") {
      alert("Введите комментарий");
    } else {
      fetch(URL_API, {
        method: "POST",
        body: JSON.stringify({
          id: commentsfromAPI.length + 1,
          text: commentInputEl.value,
          name: nameInputEl.value,
          isLiked: false,
          date: funcDate(),
          likes: 0,
        }),
      })
        .then((res) => {
          return res.json();
        })
        .then(() => {
          return fetch(URL_API, {
            method: "GET",
          });
        })
        .then((res) => {
          return res.json();
        })
        .then((resData) => {
          document.getElementById("addForm").classList.add("add-form");
          document.getElementById("loadish").classList.add("disable");
          commentsfromAPI = resData.comments;
          return renderComments();
        }),
        (nameInputEl.value = "");
      commentInputEl.value = "";
      console.log('added new comment clicked "Написать"');
    }
  }
  renderComments();
});
