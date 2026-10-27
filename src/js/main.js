import { addBtn, clearBtn, addTemplate, main, allLists } from "./selectors.js";
import { cloneTemplate, openModal, handleFormSubmittion, clearListItems, removeListItem, showToast, closeToast, closeModal, handleDragStart, handleDragEnd, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, getItemType } from "./utils.js";

addBtn?.addEventListener("click", () => {
    cloneTemplate(addTemplate, main)
    openModal()
})

// native click eventName is bubble up by default
main.addEventListener("click", (e) => {
    const isSaveBtnClicked = e.target.matches("dialog.add-template__modal>form.modal__add-form>div.add-form__controls>button.add-form__button.btn-save")
    const isCancelBtnClicked = e.target.matches("dialog.add-template__modal>form.modal__add-form>div.add-form__controls>button.add-form__button.btn-cancel")
    const isCloseBtnClicked = e.target.matches("dialog.add-template__modal>div.model__controls>button.model__controls__button.close-btn")
    const isCloseIconClicked = e.target.matches("dialog.add-template__modal>div.model__controls>button.model__controls__button.close-btn>svg.button__close-icon.icon")
    const isDeleteBtnClicked = e.target.matches("section.main__task-col-sec>ul.task-col-sec__list>li>div.list-item__controls>button.delete-btn")
    const isDeleteIconClicked = e.target.matches("section.main__task-col-sec>ul.task-col-sec__list>li>div.list-item__controls>button.delete-btn>svg.button__delete-icon.icon")
    const isUpdateBtnClicked = e.target.matches("section.main__task-col-sec>ul.task-col-sec__list>li>div.list-item__controls>button.update-btn")
    const isUpdateIconClicked = e.target.matches("section.main__task-col-sec>ul.task-col-sec__list>li>div.list-item__controls>button.update-btn>svg.button__update-icon.icon")
    const isToastCloseBtnClicked = document.querySelector("div.msg-template__toast button.toast__controls__button.close-btn") 

    const alllistItems = main.querySelectorAll("section.main__task-col-sec>ul.task-col-sec__list>li")
    const saveBtnLabel = main.querySelector("dialog.add-template__modal>form.modal__add-form>div.add-form__controls>button.add-form__button.btn-save")

    if(isSaveBtnClicked && saveBtnLabel.textContent.trim() === "edit") {
        handleFormSubmittion(e)
    } else if(isSaveBtnClicked && saveBtnLabel.textContent.trim() === "save") {
        const textarea = main.querySelector("dialog.add-template__modal>form.modal__add-form textarea")
        if(!textarea.value) {
            closeModal()
            return
        }
        handleFormSubmittion(e)
        showToast("Add item successfully!", "INFO")
        closeToast(1500)
    } else if (isCancelBtnClicked || isCloseBtnClicked || isCloseIconClicked) {
        const textarea = main.querySelector("dialog.add-template__modal>form.modal__add-form textarea")
        textarea.value = ""
        closeModal()
    }
    // DONE
    else if (isDeleteBtnClicked || isDeleteIconClicked) {
        removeListItem(e, alllistItems)
    } else if(isUpdateBtnClicked || isUpdateIconClicked) {
        const itemText = e.target.closest("li").querySelector("span").textContent || ""
        const itemId = e.target.closest("li").id || ""
        const itemType = getItemType(e.target.closest("ul").classList.value.split(" "))
        cloneTemplate(addTemplate, main)
        openModal(true, itemText, itemId, itemType)
        main.querySelector("dialog.add-template__modal>form.modal__add-form>div.add-form__controls>button.add-form__button.btn-save").textContent = "edit"
    } else if (isToastCloseBtnClicked) {
        closeToast()
    }
})

// not native eventName close (anyStringAsEventName) does not bubble up 
// so must use {capture: true} or true as third parameter when use addEventLisitener()  
main.addEventListener("close", (e) => {
    if(e.target.matches("dialog.add-template__modal")){
        const textarea = main.querySelector("dialog.add-template__modal>form.modal__add-form textarea")
        textarea.value = ""
        closeModal()
    }
}, {capture: true})

clearBtn.addEventListener("click", clearListItems)


/* handle Drag and drop Web API - always set on element draggable=true to activate */
// to activate HTML drag and drop api must set on element draggable = true
// NOTE => drag | dragstart | dragend => all these events associated with listItem or items <li>
// NOTE => dragenter | dragleave | dragover | drop => all these events associated with lists or section <ul> or <section> (parent of listItem)
// three scenario of drag and drop api elements
// 1- drag and drop element within one container (reordering items => must use getInsertBeforeElment) to define element after dragged
// 2- drag and drop element between more than one container (using only dataTransfer.setData("text/plain", draggedElement.id)) then retrieve elementId by dataTransfer.geData("text/plain") then catch element by document.getElementById(elementId) then append to child within drop event container.appendChild(element)
// 3- thid one handle both above scenarios 

// state to track dragged element with drag and drop operations within events lifecycle
// export let draggedItem = null

// 1- setup and attach event listener for dragstart
main.addEventListener("dragstart", (e) => {
    const isDraggedStart = e.target.matches("section.main__task-col-sec>ul.task-col-sec__list>li")
    const draggedItem = e.target.closest("section.main__task-col-sec>ul.task-col-sec__list>li")
    if(isDraggedStart)
        draggedItem.addEventListener("dragstart", handleDragStart)
})

// 2- setup and attach event listener for dragstart
main.addEventListener("dragend", (e) => {
    const isDraggedEnd = e.target.matches("section.main__task-col-sec>ul.task-col-sec__list>li")
    const draggedItem = e.target.closest("section.main__task-col-sec>ul.task-col-sec__list>li")
    if(isDraggedEnd)
        draggedItem.addEventListener("dragend", handleDragEnd)
})

// 3- Setup and attach event listener for events dragenter | dragleave | dragover | drop
for(const list of allLists){
    list.addEventListener("dragenter", handleDragEnter)
    list.addEventListener("dragleave", handleDragLeave)
    list.addEventListener("dragover", handleDragOver)
    list.addEventListener("drop", handleDrop)
}