"use strict";
const URL_API = `https://wedev-api.sky.pro/api/v1/comment-feed/comments`;
let commentsfromAPI = [];
let saveComment = "";
let saveName = "";

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
          });
        }
      });
    });
  }
};

// Отрисовка комментариев через JS массив
const renderComments = () => {
  nameInputEl.value = saveName;
  commentInputEl.value = saveComment;
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
  fetch(URL_API, {
    method: "GET",
  })
    .then((res) => {
      if (res.status === 500) {
        alert("Сервер не отвечает");
      } else {
        return res.json();
      }
    })
    .then((res) => {
      return res;
    })
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
      saveComment = commentInputEl.value;
      saveName = nameInputEl.value;
      document.getElementById("addForm").classList.remove("add-form");
      document.getElementById("loadish").classList.remove("disable");

      fetch(URL_API, {
        method: "POST",
        body: JSON.stringify({
          id: commentsfromAPI.length + 1,
          text: commentInputEl.value,
          name: nameInputEl.value,
          isLiked: false,
          date: funcDate(),
          likes: 0,
          forceError: true,
        }),
      })
        .then((res) => {
          if (res.status === 500) {
            alert("Сервер не отвечает");
          }
          if (res.status === 400) {
            alert("Имя или комментарий должен быть больше 2-х символов");
          } else {
            saveName = "";
            saveComment = "";
            return res.json();
          }
        })
        .then((res) => {
          if (res.status === 400 || 500) {
            document.getElementById("addForm").classList.add("add-form");
            document.getElementById("loadish").classList.add("disable");
          } else {
            nameInputEl.value = "";
            commentInputEl.value = "";
            fetchAndRenderComments();
          }
        })
        .catch((error) => {
          document.getElementById("addForm").classList.add("add-form");
          document.getElementById("loadish").classList.add("disable");
          console.log(error);
          nameInputEl.value = saveName;
          commentInputEl.value = saveComment;
          alert("Пропал интернет соединение");
        });
    }
  }
  console.log(saveComment);
  console.log(saveName);
});
