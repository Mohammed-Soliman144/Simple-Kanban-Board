import { addBtn, clearBtn, addTemplate, msgTemplate, main, listItemTemplate, todoList } from "./selectors.js";
import { cloneTemplate, openModal, handleFormSubmittion, clearListItems, removeListItem, showToast, closeToast } from "./utils.js";



// const todoListItems = document.querySelectorAll("section.main__task-col-sec>ul.task-col-sec__list.to-do-list>li")
// const inProgressListItems = document.querySelectorAll("section.main__task-col-sec>ul.task-col-sec__list.in-progress-list>li")
// const doneListItems = document.querySelectorAll("section.main__task-col-sec>ul.task-col-sec__list.done-list>li")


// const todoListItemEditBtns = document.querySelectorAll("section.main__task-col-sec>ul.task-col-sec__list.to-do-list>li>div.list-item__controls>button.update-btn")
// const todoListItemDeleteBtns = document.querySelectorAll("section.main__task-col-sec>ul.task-col-sec__list.to-do-list>li>div.list-item__controls>button.delete-btn")
// const inProgressListItemDeleteBtns = document.querySelectorAll("section.main__task-col-sec>ul.task-col-sec__list.in-progress-list>li>div.list-item__controls>button.delete-btn")
// const doneListItemDeleteBtns = document.querySelectorAll("section.main__task-col-sec>ul.task-col-sec__list.done-list>li>div.list-item__controls>button.delete-btn")


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
    const deleteIcon = e.target.matches("section.main__task-col-sec>ul.task-col-sec__list>li>div.list-item__controls>button.delete-btn>svg.button__delete-icon.icon")
    const updateBtn = e.target.matches("section.main__task-col-sec>ul.task-col-sec__list>li>div.list-item__controls>button.update-btn")
    const updateIcon = e.target.matches("section.main__task-col-sec>ul.task-col-sec__list>li>div.list-item__controls>button.update-btn>svg.button__update-icon.icon")
    const alllistItems = main.querySelectorAll("section.main__task-col-sec>ul.task-col-sec__list>li")
    

    if(saveBtn && saveBtn.textContent === "Edit") {
        handleFormSubmittion(e)
        return
    }

    if(saveBtn || cancelBtn || closeBtn || closeIconBtn) {
        handleFormSubmittion(e)
        cloneTemplate(msgTemplate, main)
        showToast("Add item successfully!", "INFO")
        const toastCls = "div.msg-template__toast"
        setTimeout(() => closeToast(toastCls), 1200)
    } else if (deleteBtn || deleteIcon) {
        removeListItem(e, alllistItems)
    } else if(updateBtn || updateIcon) {
        const itemText = e.target.closest("li").querySelector("span").textContent || ""
        const itemId = e.target.closest("li").querySelector("span").id || ""
        cloneTemplate(addTemplate, main)
        const selector = "dialog.add-template__modal"
        openModal(selector, true, itemText, itemId)
        main.querySelector("dialog.add-template__modal>form.modal__add-form>div.add-form__controls>button.add-form__button.btn-save").textContent = "Edit"
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
