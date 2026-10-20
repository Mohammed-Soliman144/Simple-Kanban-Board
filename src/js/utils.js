const STORAGE_KEY = "Task-App";

export function addNewTask(task) {
    const dateAdded = new Date().toISOString() 
    updateLocalStorage({task, dateAdded})
}

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
    if(item)
        localStorage.setItem(STORAGE_KEY, JSON.stringify({tasks: [...item.tasks, task]}))
    else
        localStorage.setItem(STORAGE_KEY, JSON.stringify({tasks: [task]}))
}

export function openModal(modalSelector = "") {
    if(!modalSelector) return
    const modal = document.querySelector(modalSelector)
    modal.showModal()
}

export function cloneTemplate(template, root) {
    if(!template || !root) return
    const cloneTemp = template.content.cloneNode(true)
    root.appendChild(cloneTemp)
    return cloneTemp
}

export function saveModal(btnSelector = "", taskSelector = "") {
    if(!btnSelector || !taskSelector) return
    const saveBtn = document.querySelector(btnSelector)
    const taskTitle = document.querySelector(taskSelector)?.textContent
    const taskDate = new Date().toISOString()
    saveBtn.addEventListener("click", updateLocalStorage({taskTitle, taskDate}))
}

export function removeModal(modalSelector = "") {
    if(!modalSelector) return
    const modal = document.querySelector(modalSelector)
    modal.close()
    modal.remove()
}