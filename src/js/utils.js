import { msgTemplate, main, listItemTemplate, todoList } from "./selectors.js";
import { kanbanState, TODO, PROG, DONE, updateState, updateCountState, deleteItemState, resetState } from "./state.js";

// state to track dragged element with drag and drop operations within events lifecycle
export let draggedItem = null
const STORAGE_KEY = "Task-App";

export function restoreLocalStorage() {
    if(typeof window === "undefined") return {}
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if(!data.tasks.length) return {}
    return data
}

export function updateLocalStorage(task = {}) {
    if(!Object.keys(task).length) return
    if(typeof window === "undefined") return
    const {toDoCount, inProgressCount, doneCount} = kanbanState
    const item = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if(item) {
        const { tasks } = item
        const isExist = tasks.filter(taskItem => taskItem.id === task.id)[0]?.id === task.id ?? false
        console.log(isExist, task)
        if(isExist) {
            const newTasks = tasks.map(taskItem => taskItem.id === task.id? {...taskItem, title: task.title, type: task.type} : taskItem)
            localStorage.setItem(STORAGE_KEY, JSON.stringify({...item, tasks: [...newTasks], toDoCount, inProgressCount, doneCount}))
            return
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify({...item, tasks: [...item.tasks, task], toDoCount, inProgressCount, doneCount}))
    }
    else
        localStorage.setItem(STORAGE_KEY, JSON.stringify({tasks: [task], toDoCount, inProgressCount, doneCount}))
}

export function deleteItemLocalStorage(itemId) {
    if(typeof window === "undefined" || !itemId) return
    const item = JSON.parse(localStorage.getItem(STORAGE_KEY))
    const {tasks} = item
    if(!tasks.length) return
    const newItems = tasks.filter(task => task.id !== itemId? task : null)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({...item, tasks: newItems}))
}

export function openModal(isEditable = false, itemText = "", id = "", type = "") {
    const modal = document.querySelector("dialog.add-template__modal")
    if(!modal) return
    window.scroll({top: 0, left: 0, behavior: "smooth"})
    modal.showModal()
    if(isEditable && id) {
        modal.querySelector("textarea").value = itemText
        modal.querySelector("textarea").dataset.itemId = id
        modal.querySelector("textarea").dataset.itemType = type
        const item = {
            title: itemText,
            id,
            type,
        }
        updateState(item)
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
    const itemType = form.elements.task.dataset.itemType ?? TODO
    const isAdded = !itemId ? true : false
    const isModified = !isAdded 
    if(textarea) {
        const item = {
            title: textarea,
            id: itemId ?? new Date().toISOString(),
            type: itemType ?? TODO
        }
        updateState(item)
        const {toDoCount, inProgressCount, doneCount} = updateCountState(item.id, isAdded, false, isModified)
        kanbanState.toDoCount = toDoCount
        kanbanState.inProgressCount = inProgressCount
        kanbanState.doneCount = doneCount

        console.log(kanbanState)
        updateLocalStorage(item)
        addNewListItem(item.title, item.id)
    }
    closeModal()
}

export function addNewListItem(task = "", id = "") {
    if(!task || !id) return
    const allListItems = main.querySelectorAll("section.main__task-col-sec>ul.task-col-sec__list>li")
    const isExist = [...allListItems].find(item => item.id === id)
    if(isExist) {
        allListItems.forEach(item => {
            if(item.id === id) {
                item.querySelector("span").textContent = task
                return
            }
        })
        return
    }
    cloneTemplate(listItemTemplate, todoList)
    const newSpan = todoList.querySelector("ul>li:last-child>span")
    newSpan.closest("li").dataset.itemType = getItemType(todoList.classList.value.split(' '))
    newSpan.closest("li").id = id
    newSpan.textContent = task
}


export function getItemType(listItems = []) {
    if(!listItems.length) return ""
    return listItems.filter(cls => cls === TODO || cls === PROG || cls === DONE).join('')
}

export function clearListItems() {
    const allListItems = document.querySelectorAll("section.main__task-col-sec>ul.task-col-sec__list>li")
    if(!allListItems.length) return
    for(const item of allListItems) {
        deleteItemLocalStorage(item.id)
        item.remove()
    }
    resetState()
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
    const itemId = event.target.closest("li").id
    const itemType = event.target.closest("li").dataset.itemType
    listItems.forEach(item => item === event.target.closest("li")? item.remove() : item)
    deleteItemState(itemId)
    const {toDoCount, inProgressCount, doneCount} = updateCountState(itemId, false, true, false)
    kanbanState.toDoCount = toDoCount
    kanbanState.inProgressCount = inProgressCount
    kanbanState.doneCount = doneCount
    console.log(itemType, kanbanState)
    deleteItemLocalStorage(itemId)
}

// define nextElement that should be sit immediately after draggedElement
export function getInsertBeforeElement(list, axisY) {
    // catch all elements or items that not has dragging class to define element after draggedItem or draggedElement within current list (container element)
    // then convert listItems from NodeList (HTMLElementNodeList) to normal array
    const listItems = [...list.querySelectorAll("section.main__task-col-sec>ul.task-col-sec__list>li.list__list-item.list-item:not(.dragging)")]
    return listItems.reduce((closest, item) => {
        const ItemSizes = item.getBoundingClientRect()
        const offset = axisY - (ItemSizes.top + ItemSizes.height / 2)
        if(offset < 0 && offset > closest.offset) 
            return {
                offset,
                element: item
            }
        return closest
    }, {
        offset: Number.NEGATIVE_INFINITY,
        element: null
    }).element
}


// handleDragStart => store data of dragged element
export function handleDragStart(e) {
    // update state by item selected to drag that e.target.closest("li") points to it
    draggedItem = e.target.closest("li.list__list-item.list-item")
    // specifiy type of drag and drop operation by move dragged element to destination
    // by using dataTransfer method and initialize effectAllowed property to "move"
    e.dataTransfer.effectAllowed = "move"
    // store data of dragged element that matches <li> and type of data is plain text "text/plain"
    e.dataTransfer.setData("text/plain", draggedItem.id)
    // add dragging class to all dragged items
    draggedItem.classList.add("dragging")
}

// handleDragEnd => update state of draggedItem and remove visual feedback or dragging class
export function handleDragEnd(e) {
    // update state by item selected to drag that e.target.closest("li") points to it
    draggedItem = e.target.closest("li.list__list-item.list-item")
    draggedItem.classList.remove("dragging")
    // update state of draggedItem to null
    draggedItem = null
}

// handleDragOver => prevent default browser behavior which is automated prevent dragged item over another item (item/element) (dragover associated with list or section)
export function handleDragOver(e) {
    // prevent default browser behavior
    e.preventDefault()

    // catch parent list of draggedItem
    const list = e.target.closest("section.main__task-col-sec>ul.task-col-sec__list")
    // get element after dragged Item
    const nextElement = getInsertBeforeElement(list, e.clientY)

    if(!draggedItem || !list) return

    // define if nextElement is null 
    if(nextElement === null) 
        // so append draggedItem to list as last one
        list.appendChild(draggedItem)
    else 
        // so insertBefore draggedItem before nextElement
        list.insertBefore(draggedItem, nextElement)
}

// handleDragEnter => add visual feedback drag-over class  (dragenter associated with list or section)
export function handleDragEnter(e) {
    // select list dragged from it that e.target.closest("section.main__task-col-sec") points to it
    const list = e.target.closest("section.main__task-col-sec>ul.task-col-sec__list")
    list.classList.add("drag-over")
}

// handleDragLeave => remove visual feedback drag-over class (dragleave associated with list or section)
export function handleDragLeave(e) {
    // select list dragged from it that e.target.closest("section.main__task-col-sec") points to it
    const list = e.target.closest("section.main__task-col-sec>ul.task-col-sec__list")
    list.classList.remove("drag-over")
}

// handleDrop => reset drag and drop operations and prevent default browser behavior (dragleave associated with list or section) and retrieve or restore itemDragged by using dataTransfer.getData
export function handleDrop(e) {
    // prevent default browser behavior
    e.preventDefault()
    // catch list of current draggedItem
    const list = e.target.closest("section.main__task-col-sec>ul.task-col-sec__list")
    // retrieve item ID that transfer by drap and drop html api by dataTransfer.getData(dataType) "text/plain"
    const itemId = e.dataTransfer.getData("text/plain")
    // if only drag and drop elements between containers so i do not need function getInsertBeforeElment
    // and in this append item by document.getElementById(itemId)
    const item = document.getElementById(itemId)

    // const {storage: tasks, toDoCount, inProgressCount, doneCount} = restoreLocalStorage()
    // const itemType =


    // then append item to selected or target list  by list.appendChild(item) that already proccessed inside dragover event 
    console.log(list, item)
}