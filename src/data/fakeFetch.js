export const fakeFetch = (value) =>
  new Promise((resolve) => {
    const delay = Math.floor(Math.random() * 1500) + 500;
    setTimeout(() => resolve(value), delay);
  });
