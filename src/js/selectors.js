/* ===================== DOM SELECTORS ======================= */
const addBtn = document.querySelector("section.main__task-col-sec>div.list__controls>button.add-btn")
const clearBtn = document.querySelector("section.main__task-col-sec>div.list__controls>button.clear-btn")
const todoList = document.querySelector("section.main__task-col-sec>ul.task-col-sec__list.to-do-list")
const progList = document.querySelector("section.main__task-col-sec>ul.task-col-sec__list.in-progress-list")
const doneList = document.querySelector("section.main__task-col-sec>ul.task-col-sec__list.done-list")
const allLists = document.querySelectorAll("section.main__task-col-sec>ul.task-col-sec__list")
const addTemplate = document.getElementById("add-template")
const msgTemplate = document.getElementById("msg-template")
const listItemTemplate = document.getElementById("list-item-template")
const main = document.querySelector("main.main")
const allBadges = document.querySelectorAll("span.task-col-sec__heading__badge")

export {addBtn, clearBtn, addTemplate, msgTemplate, main, listItemTemplate, todoList, allLists, progList, doneList, allBadges}