/* ===================== DOM SELECTORS ======================= */
const addBtn = document.querySelector("section.main__task-col-sec>div.list__controls>button.add-btn") 
const clearBtn = document.querySelector("section.main__task-col-sec>div.list__controls>button.clear-btn") 
const todoListItems = document.querySelectorAll("section.main__task-col-sec>ul.task-col-sec__list.to-do-list>li")
const inProgressListItems = document.querySelectorAll("section.main__task-col-sec>ul.task-col-sec__list.in-progress-list>li")
const doneListItems = document.querySelectorAll("section.main__task-col-sec>ul.task-col-sec__list.done-list>li")
const todoListItemEditBtns = document.querySelectorAll("section.main__task-col-sec>ul.task-col-sec__list.to-do-list>li>div.list-item__controls>button.update-btn")
const todoListItemDeleteBtns = document.querySelectorAll("section.main__task-col-sec>ul.task-col-sec__list.to-do-list>li>div.list-item__controls>button.delete-btn")
const addTemplate = document.getElementById("add-template")
// const taskDialog = document.querySelector("dialog.add-template__modal>form.modal__add-form>textarea.add-form__textarea")
// const saveBtn = document.querySelector("dialog.add-template__modal>form.modal__add-form>button.btn-save")
const cancelBtn = document.querySelector("dialog.add-template__modal>form.modal__add-form>button.btn-cancel")
const closeBtn = document.querySelector("dialog.add-template__modal>div.model__controls>button.close-btn")
const msgTemplate = document.getElementById("msg-template")
const toast = document.querySelector("div.msg-template__toast")
const toastTitle = document.querySelector("div.msg-template__toast>p.toast__title")
const closeToastBtn = document.querySelector("div.msg-template__toast>button.close-btn")
const main = document.querySelector("main.main")


export {addBtn, clearBtn, todoListItems, inProgressListItems, doneListItems, todoListItemDeleteBtns, todoListItemEditBtns, addTemplate, cancelBtn, closeBtn, msgTemplate, toast, toastTitle, closeToastBtn, main}