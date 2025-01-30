const URL_API = `https://wedev-api.sky.pro/api/v1/comment-feed/comments`;

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

export const getComments = () => {
  return fetch(URL_API, {
    method: "GET",
  }).then((res) => {
    if (res.status === 500) {
      alert("Сервер не отвечает");
    } else {
      return res.json();
    }
  });
};

export const postComments = ({id, userText, userName}) => {
  return fetch(URL_API, {
    method: "POST",
    body: JSON.stringify({
      id: id,
      text: userText,
      name: userName,
      isLiked: false,
      date: funcDate(),
      likes: 0,
      forceError: true,
    }),
  }).then((res) => {
    if (res.status === 500) {
      alert("Сервер не отвечает");
    }
    if (res.status === 400) {
      alert("Имя или комментарий должен быть больше 2-х символов");
    } else {
      return res.json();
    }
  });
};
