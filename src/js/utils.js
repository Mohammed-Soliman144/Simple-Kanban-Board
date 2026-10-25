import { msgTemplate, main, listItemTemplate, todoList } from "./selectors.js";

const STORAGE_KEY = "Task-App";

// export function addNewTask(task) {
//     const dateAdded = new Date().toISOString() 
//     updateLocalStorage({task, dateAdded})
// }

export function restoreLocalStorage() {
    if(typeof window === "undefined") return []
    const {data: tasks} = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if(!tasks.length) return []
    return tasks
}

export function updateLocalStorage(task = {}) {
    if(!Object.keys(task).length) return
    if(typeof window === "undefined") return
    const item = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if(item) {
        const {tasks} = item
        const isExist = tasks.find(taskItem => taskItem.id === task.id)
        if(isExist) {
            const newTasks = tasks.map(taskItem => taskItem.id === task.id? {...taskItem, title: task.title} : taskItem)
            localStorage.setItem(STORAGE_KEY, JSON.stringify({tasks: [...newTasks]}))
            return
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify({tasks: [...item.tasks, task]}))
    }
    else
        localStorage.setItem(STORAGE_KEY, JSON.stringify({tasks: [task]}))
}

export function deleteItemLocalStorage(itemId) {
    if(typeof window === "undefined" || !itemId) return
    const item = JSON.parse(localStorage.getItem(STORAGE_KEY))
    const {tasks} = item
    if(!tasks.length) return
    const newItems = tasks.filter(task => task.id !== itemId? task : null)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({tasks: newItems}))
}

export function openModal(modalSelector = "", isEditable = false, itemText = "", id = "") {
    if(!modalSelector) return
    const modal = document.querySelector(modalSelector)
    modal.showModal()
    if(isEditable && id) {
        modal.querySelector("textarea").value = itemText
        modal.querySelector("textarea").dataset.itemId = id
    }
}

export function cloneTemplate(template, root) {
    if(!template || !root) return
    const cloneTemp = template.content.cloneNode(true)
    root.appendChild(cloneTemp)
    return cloneTemp
}

// export function saveModal(btnSelector = "", taskSelector = "") {
//     if(!btnSelector || !taskSelector) return
//     const saveBtn = document.querySelector(btnSelector)
//     const taskTitle = document.querySelector(taskSelector)?.textContent
//     const taskDate = new Date().toISOString()
//     saveBtn.addEventListener("click", updateLocalStorage({taskTitle, taskDate}))
// }

export function closeModal(modalSelector = "") {
    if(!modalSelector) return
    const modal = document.querySelector(modalSelector)
    modal.close()
    modal.remove()
}

export function handleFormSubmittion (e) {
    // to prevent browser from default behavior when submit form
    e.preventDefault()

    const form = main.querySelector("dialog.add-template__modal>form.modal__add-form")
    const textarea = form.elements.task.value
    const itemId = form.elements.task.dataset.itemId
    console.log(itemId)

    if(textarea) {
        const newTask = {
            id: itemId ?? new Date().toISOString(),
            title: textarea
        }
        console.log(newTask.id)
        console.log(newTask.id === itemId)
        updateLocalStorage(newTask)
        addNewListItem(textarea, newTask.id)
    }
    const dialogCls = "dialog.add-template__modal"
    closeModal(dialogCls)
}

export function addNewListItem(task = "", id = "") {
    if(!task || !id) return
    const allListItems = main.querySelectorAll("section.main__task-col-sec>ul.task-col-sec__list>li>span")
    const isExist = [...allListItems].find(item => item.id === id)
    if(isExist) {
        allListItems.forEach(item => {
            if(item.id === id) {
                item.textContent = task
                return
            }
        })
        return
    }
    cloneTemplate(listItemTemplate, todoList)
    const newSpan = todoList.querySelector("ul>li:last-child>span")
    newSpan.id = id
    newSpan.textContent = task
}

export function clearListItems() {
    const allListItems = document.querySelectorAll("section.main__task-col-sec>ul.task-col-sec__list>li")
    const allListSpans = document.querySelectorAll("section.main__task-col-sec>ul.task-col-sec__list>li>span")
    if(!allListItems.length && !allListSpans.length) return
    for(const span of allListSpans)
        deleteItemLocalStorage(span.id)
    for(const item of allListItems)
        item.remove()
}

export function showToast(msg = "", msgType = "INFO") {
    if(!msg) return
    cloneTemplate(msgTemplate, main)
    const toastTitle = main.querySelector("div.msg-template__toast>div.toast__container>p.toast__title")
    toastTitle.textContent = msg
    switch(msgType) {
        case "INFO":
            toastTitle.closest("div.toast__container").classList.toggle("info")
            break;
        case "ERROR":
            toastTitle.closest("div.toast__container").classList.toggle("error")
            break;
    }
    toastTitle.closest("div.msg-template__toast>div.toast__container").classList.remove("closed")
    toastTitle.closest("div.msg-template__toast>div.toast__container").classList.add("opened")
}

export function closeToast(toastSelector = "") {
    if(!toastSelector) return
    // msg-template__toast>toast__container>toast__title
    const toast = document.querySelector(toastSelector)
    toast.querySelector("div.toast__container").classList.remove("opened")
    toast.querySelector("div.toast__container").classList.add("closed")
    toast.remove()
}

export function removeListItem(event, listItems = []) {
    if(!listItems || !listItems.length || !event) return
    const itemTitle = event.target.closest("li").querySelector("span").textContent || "" 
    listItems.forEach(item => item === event.target.closest("li")? item.remove() : item)
    deleteItemLocalStorage(itemTitle)
}