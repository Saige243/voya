"use client";

export const WindowAlert = (text: string) => {
  return window.alert(text);
};

export const WindowConfirm = (prompt: string, command: string) => {
  const userInput = window.prompt(prompt);

  if (userInput !== command) {
    return;
  }

  return userInput;
};
