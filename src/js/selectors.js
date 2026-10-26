/* ===================== DOM SELECTORS ======================= */
const addBtn = document.querySelector("section.main__task-col-sec>div.list__controls>button.add-btn") 
const clearBtn = document.querySelector("section.main__task-col-sec>div.list__controls>button.clear-btn")
const todoList = document.querySelector("section.main__task-col-sec>ul.task-col-sec__list.to-do-list")
// const allLists = document.querySelectorAll("section.main__task-col-sec>ul.task-col-sec__list")
const allLists = document.querySelectorAll("section.main__task-col-sec")
const addTemplate = document.getElementById("add-template")
const msgTemplate = document.getElementById("msg-template")
const listItemTemplate = document.getElementById("list-item-template")
const main = document.querySelector("main.main")

export {addBtn, clearBtn, addTemplate, msgTemplate, main, listItemTemplate, todoList, allLists}