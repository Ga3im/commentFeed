const URL_API = `https://wedev-api.sky.pro/api/v2/comment-feed/comments`;

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
    headers: {
      Authorization: `Bearer`,
    },
  }).then((res) => {
    if (res.status === 500) {
      alert("Сервер не отвечает");
    } else {
      return res.json();
    }
  });
};

export const postComments = ({ text, token }) => {
  return fetch(URL_API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      text,
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

export const login = ({ login, password }) => {
  return fetch("https://wedev-api.sky.pro/api/user/login", {
    method: "POST",
    body: JSON.stringify({
      login,
      password,
    }),
  })
    .then((res) => {
      if (res.status === 400) {
        throw new Error("Неправильный логин или пароль");
      }
      if (res.status === 201) {
        return res.json();
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

export const registration = ({ login, name, password }) => {
  return fetch("https://wedev-api.sky.pro/api/user", {
    method: "POST",
    body: JSON.stringify({
      login,
      name,
      password,
    }),
  }).then((resData) => {
    if (resData.status === 400) {
      throw new Error("Пользователь с таким логином уже сущетсвует");
    }
    if (resData.status === 201) {
      return resData.json();
    }
  });
};
