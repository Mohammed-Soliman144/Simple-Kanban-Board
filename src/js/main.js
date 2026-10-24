import { addBtn, clearBtn, addTemplate, msgTemplate, main, todoListItems, doneListItems, inProgressListItems, todoListItemDeleteBtns, inProgressListItemDeleteBtns, doneListItemDeleteBtns} from "./selectors.js";
import { addNewTask, cloneTemplate, openModal, updateLocalStorage, saveModal, closeModal, deleteItemLocalStorage } from "./utils.js";



addBtn?.addEventListener("click", () => {
    cloneTemplate(addTemplate, main)
    const selector = "dialog.add-template__modal"
    openModal(selector)
})

// native click eventName is bubble up by default
main.addEventListener("click", (e) => {
    const saveBtn = e.target.matches("dialog.add-template__modal>form.modal__add-form>div.add-form__controls>button.add-form__button.btn-save")
    const cancelBtn = e.target.matches("dialog.add-template__modal>form.modal__add-form>div.add-form__controls>button.add-form__button.btn-cancel")
    const closeIconBtn = e.target.matches("dialog.add-template__modal>div.model__controls>button.model__controls__button.close-btn>svg.button__close-icon")
    const closeBtn = e.target.matches("dialog.add-template__modal>div.model__controls>button.model__controls__button.close-btn>svg.button__close-icon")
    const deleteBtn = e.target.matches("section.main__task-col-sec>ul.task-col-sec__list>li>div.list-item__controls>button.delete-btn")

    if(saveBtn || cancelBtn || closeBtn || closeIconBtn) {
        handleFormSubmittion(e)
    } else if (deleteBtn) {
        const allItems = [...todoListItems, ...inProgressListItems, ...doneListItems]
        removeListItem(e, allItems)
    }
})

// not native eventName close (anyStringAsEventName) does not bubble up 
// so must use {capture: true} or true as third parameter when use addEventLisitener()  
main.addEventListener("close", (e) => {
    if(e.target.matches("dialog.add-template__modal")){
        handleFormSubmittion(e)
    }
}, {capture: true})

clearBtn.addEventListener("click", clearListItems)


const allBtns = [...todoListItemDeleteBtns, ...inProgressListItemDeleteBtns, ...doneListItemDeleteBtns]
const allItems = [...todoListItems, ...inProgressListItems, ...doneListItems]

for(const button of allBtns) {
    button.addEventListener("click", (e) => {
        removeListItem(e, allItems)
    })
}





export function handleFormSubmittion (e) {
    // to prevent browser from default behavior when submit form
    e.preventDefault()
    const form = main.querySelector("dialog.add-template__modal>form.modal__add-form")
    const textarea = form.elements.task.value
    if(textarea) {
        const newTask = {
            title: textarea,
            date: new Date().toISOString()
        }
        updateLocalStorage(newTask)
    }
    const dialogCls = "dialog.add-template__modal"
    addNewListItem(textarea)
    closeModal(dialogCls)
}

export function addNewListItem(task = "") {
    if(!task) return
    const todoList = main.querySelector("ul.task-col-sec__list.to-do-list") 
    const newItem = todoList.querySelector("li").cloneNode(true)
    const newSpan = newItem.querySelector("span")
    newSpan.textContent = task
    todoList.appendChild(newItem)
}

export function clearListItems() {
    if(!todoListItems.length && !inProgressListItems.length && !doneListItems.length) return
    const listItems = [...todoListItems, ...inProgressListItems, ...doneListItems]
    for(const item of listItems)
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
    toastTitle.closest("div.msg-template__toast").classList.remove("closed")
    toastTitle.closest("div.msg-template__toast").classList.add("opened")
}

export function closeToast(toastSelector = "") {
    if(!toastSelector) return
    // msg-template__toast>toast__container>toast__title
    const toast = document.querySelector(toastSelector)
    toast.classList.remove("opened")
    toast.classList.add("closed")
}

export function removeListItem(event, listItems = []) {
    if(!listItems || !listItems.length || !event) return
    const itemTitle = event.currentTarget.closest("li").querySelector("span").textContent || ""
    const text = event.target.closest("li").querySelector("span").textContent || "" 
    console.log(itemTitle, event.target, event.currentTarget, itemTitle, text)
    listItems.forEach(item => item === event.currentTarget.closest("li")? item.remove() : item)
    deleteItemLocalStorage(itemTitle)
}