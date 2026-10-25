/* ===================== DOM SELECTORS ======================= */
const addBtn = document.querySelector("section.main__task-col-sec>div.list__controls>button.add-btn") 
const clearBtn = document.querySelector("section.main__task-col-sec>div.list__controls>button.clear-btn")
const todoList = document.querySelector("section.main__task-col-sec>ul.task-col-sec__list.to-do-list")



const addTemplate = document.getElementById("add-template")
const cancelBtn = document.querySelector("dialog.add-template__modal>form.modal__add-form>button.btn-cancel")
const closeBtn = document.querySelector("dialog.add-template__modal>div.model__controls>button.close-btn")
const msgTemplate = document.getElementById("msg-template")
const toast = document.querySelector("div.msg-template__toast")
const toastTitle = document.querySelector("div.msg-template__toast>p.toast__title")
const closeToastBtn = document.querySelector("div.msg-template__toast>button.close-btn")
const listItemTemplate = document.getElementById("list-item-template")
const main = document.querySelector("main.main")

export {addBtn, clearBtn, addTemplate, cancelBtn, closeBtn, msgTemplate, toast, toastTitle, closeToastBtn, main, listItemTemplate, todoList}