export const saveToLocalStorage = (key: string, value: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, value);
  }
};

export const getFromLocalStorage = (key: string) =>
  typeof window !== "undefined" && key && localStorage.getItem(key);

export const deleteFromLocalStorage = (key: string) =>
  typeof window !== "undefined" && key && localStorage.removeItem(key);

export const saveToSessionStorage = (key: string, value: string) => {
  if (typeof window !== "undefined") {
    sessionStorage.setItem(key, value);
  }
};

export const getFromSessionStorage = (key: string) =>
  typeof window !== "undefined" && key && sessionStorage.getItem(key);

export const deleteFromSessionStorage = (key: string) =>
  typeof window !== "undefined" && key && sessionStorage.removeItem(key);
