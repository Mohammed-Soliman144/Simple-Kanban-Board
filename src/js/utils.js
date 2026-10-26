import { msgTemplate, main, listItemTemplate, todoList } from "./selectors.js";

const STORAGE_KEY = "Task-App";

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

export function openModal(isEditable = false, itemText = "", id = "") {
    const modal = document.querySelector("dialog.add-template__modal")
    if(!modal) return
    window.scroll({top: 0, left: 0, behavior: "smooth"})
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

export function closeModal() {
    const modal = document.querySelector("dialog.add-template__modal")
    if(!modal) return
    modal.close()
    modal.remove()
}

export function handleFormSubmittion (e) {
    // to prevent browser from default behavior when submit form
    e.preventDefault()
    const form = main.querySelector("dialog.add-template__modal>form.modal__add-form")
    const textarea = form.elements.task.value
    const itemId = form.elements.task.dataset.itemId
    if(textarea) {
        const newTask = {
            id: itemId ?? new Date().toISOString(),
            title: textarea
        }
        updateLocalStorage(newTask)
        addNewListItem(textarea, newTask.id)
    }
    closeModal()
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
    newSpan.closest("li").id = id
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
    console.log("message exist")
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

export function closeToast(ms = 0) {
    const toast = document.querySelector("div.msg-template__toast")
    if(!toast) return
    // msg-template__toast>toast__container>toast__title
    toast.querySelector("div.toast__container").classList.remove("opened")
    toast.querySelector("div.toast__container").classList.add("closed")
    if(ms) {
        setTimeout(() => toast.remove(), ms)
        return
    }
    toast.remove()
}

export function removeListItem(event, listItems = []) {
    if(!listItems || !listItems.length || !event) return
    const itemTitle = event.target.closest("li").querySelector("span").textContent || "" 
    listItems.forEach(item => item === event.target.closest("li")? item.remove() : item)
    deleteItemLocalStorage(itemTitle)
}