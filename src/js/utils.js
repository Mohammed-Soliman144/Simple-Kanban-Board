import { msgTemplate, main, listItemTemplate, todoList, progList, doneList, allBadges } from "./selectors.js";
import { kanbanState, TODO, PROG, DONE, updateState, deleteItemState, resetState } from "./state.js";

// state to track dragged element with drag and drop operations within events lifecycle
export let draggedItem = null
const STORAGE_KEY = "Task-App";

// RESTORE DATA FROM LOCALSTORAGE
export function restoreLocalStorage() {
    if(typeof window === "undefined") return {}
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if(!data) return
    return data
}
// UPDATE AND EDIT DATA TO LOCALSTORAGE
export function updateLocalStorage(task = {}) {
    if(!Object.keys(task).length) return
    if(typeof window === "undefined") return
    const item = JSON.parse(localStorage.getItem(STORAGE_KEY))

    if(!item) 
        return localStorage.setItem(STORAGE_KEY, JSON.stringify({tasks: [task]}))

    const {tasks} = item
    const isExist = tasks.filter(taskItem => taskItem.id === task.id).length > 0 ? true : false

    if(isExist)
        return localStorage.setItem(STORAGE_KEY, JSON.stringify({
            tasks: [...item.tasks.map(taskItem => taskItem.id === task.id ? task: taskItem)]}))
        
    return localStorage.setItem(STORAGE_KEY, JSON.stringify({tasks: [...item.tasks, task]}))
}
// DELETE DATA FROM LOCALSTORAGE
export function deleteItemLocalStorage(itemId) {
    if(typeof window === "undefined" || !itemId) return
    const item = JSON.parse(localStorage.getItem(STORAGE_KEY))
    const {tasks} = item
    if(!tasks.length) return
    const newItems = tasks.filter(task => task.id !== itemId? task : null)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({...item, tasks: newItems}))
}
// SHOW DIALOG AND UPDATE KANBAN STATE
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
// CLONE CONTENT OF TEMPLATE ELEMENT AND APPEND TO ROOT
export function cloneTemplate(template, root) {
    if(!template || !root) return
    const cloneTemp = template.content.cloneNode(true)
    root.appendChild(cloneTemp)
    return cloneTemp
}
// CLOSE DIALOG
export function closeModal() {
    const modal = document.querySelector("dialog.add-template__modal")
    if(!modal) return
    modal.close()
    modal.remove()
}
// HANDLE FORM SUBMITION ADD AND UPDATE DATA
export function handleFormSubmittion (e) {
    // to prevent browser from default behavior when submit form
    e.preventDefault()
    const form = main.querySelector("dialog.add-template__modal>form.modal__add-form")
    const textarea = form.elements.task.value
    const itemId = form.elements.task.dataset.itemId
    const itemType = form.elements.task.dataset.itemType ?? TODO
    if(textarea) {
        const item = {
            title: textarea,
            id: itemId ?? new Date().toISOString(),
            type: itemType ?? TODO
        }
        updateState(item)
        updateBadges(countTaskCategories()) 
        updateLocalStorage(item)
        addNewListItem(item.title, item.id)
    }
    closeModal()
}
// COUNT ITEM TYPES [TODO, PROG, DONE] (DERIVED STATES)
export function countTaskCategories() {
    const {items} = kanbanState
    return items.reduce((acc, {type}) => ({...acc, [type]: (acc[type] ?? 0) + 1}), {[TODO]: 0, [PROG]: 0, [DONE]: 0})
}
// UPDATE AND EDIT NEW ITEM TO DOM
export function addNewListItem(task = "", id = "", type = "") {
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
    switch(type) {
        case PROG:
            {
                cloneTemplate(listItemTemplate, progList)
                const newSpan = progList.querySelector("ul>li:last-child>span")
                newSpan.closest("li").dataset.itemType = type
                newSpan.closest("li").id = id
                newSpan.textContent = task
            }
        break;
        case DONE:
            {
                cloneTemplate(listItemTemplate, doneList)
                const newSpan = doneList.querySelector("ul>li:last-child>span")
                newSpan.closest("li").dataset.itemType = type
                newSpan.closest("li").id = id
                newSpan.textContent = task
            }
            break;
        default:
            cloneTemplate(listItemTemplate, todoList)
            const newSpan = todoList.querySelector("ul>li:last-child>span")
            newSpan.closest("li").dataset.itemType = type ?? TODO
            newSpan.closest("li").id = id
            newSpan.textContent = task
    }
}
// GET ITEM_TYPE BASED ON CLASS
export function getItemType(nodeListItems, closestEle = "") {
    if((Array.isArray(nodeListItems) && !nodeListItems.length) || !nodeListItems) return ""
    const classes = closestEle ? nodeListItems?.closest(closestEle).classList.value.split(" ") : nodeListItems?.classList.value.split(" ") 
    return classes.filter(cls => cls === TODO || cls === PROG || cls === DONE).join('')
}
// RESET KANBAN STATE AND CLEAR ITEMS FROM DOM
export function clearListItems() {
    const allListItems = document.querySelectorAll("section.main__task-col-sec>ul.task-col-sec__list>li")
    if(!allListItems.length) return
    for(const item of allListItems) {
        deleteItemLocalStorage(item.id)
        item.remove()
    }
    resetState()
    updateBadges(countTaskCategories())
}
// OPEN TOAST NOTIFICATION (CRUD OPERATION)
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
// CLOSE TOAST NOTIFICATION
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
// DELETE ITEM FROM STORAGE, KANBAN AND DOM
export function removeListItem(event, listItems = []) {
    if(!listItems || !listItems.length || !event) return
    const itemId = event.target.closest("li").id
    // const itemType = event.target.closest("li").dataset.itemType
    listItems.forEach(item => item === event.target.closest("li")? item.remove() : item)
    deleteItemState(itemId)
    updateBadges(countTaskCategories()) 
    deleteItemLocalStorage(itemId)
}

// RETRIEVE NEXT_ELEMENT SHOULD SIT IMMEDIATELY AFTER DRAGGED ELEMENT
export function getInsertBeforeElement(list, axisY) {
    // catch all elements or items that not has dragging class to define element after draggedItem or draggedElement within current list (container element)
    // then convert listItems from NodeList (HTMLElementNodeList) to normal array
    const listItems = [...list.querySelectorAll("section.main__task-col-sec>ul.task-col-sec__list>li.list__list-item.list-item:not(.dragging)")]
    return listItems.reduce((closest, item) => {
        // return object of boundingClientRect() {height: , width: , top: ,left: , right: ,bottom: }
        const ItemSizes = item.getBoundingClientRect()
        // calculate midpoint or center point of item
        // then get closest element that above a midpoint of item (so use -Infinity | Number.NEGATIVE_INIFINTY)
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

// HANDLE DRAG START => SET DATA OF ITEM DRAGGED BY HTML DRAG AND DROP API
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

// HANDLE DRAG END => update state of draggedItem and remove visual feedback or dragging class
export function handleDragEnd(e) {
    // update state by item selected to drag that e.target.closest("li") points to it
    if(!draggedItem) return
    draggedItem = e.target.closest("li.list__list-item.list-item")
    draggedItem.classList.remove("dragging")
    // update state of draggedItem to null
    draggedItem = null
}

// HANDLE DRAG OVER => prevent default browser behavior which is automated prevent dragged item over another item (item/element) (dragover associated with list or section)
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

// HANDLE DRAG ENTER => add visual feedback drag-over class  (dragenter associated with list or section)
export function handleDragEnter(e) {
    // select list dragged from it that e.target.closest("section.main__task-col-sec>ul.task-col-sec__list") points to it
    const list = e.target.closest("section.main__task-col-sec>ul.task-col-sec__list")
    list.classList.add("drag-over")
}

// HANDLE DRAG LEAVE => remove visual feedback drag-over class (dragleave associated with list or section)
export function handleDragLeave(e) {
    // select list dragged from it that e.target.closest("section.main__task-col-sec>ul.task-col-sec__list") points to it
    const list = e.target.closest("section.main__task-col-sec>ul.task-col-sec__list")
    list.classList.remove("drag-over")
}

// HANDLE DROP => reset drag and drop operations and prevent default browser behavior (dragleave associated with list or section) and retrieve or restore itemDragged by using dataTransfer.getData
export function handleDrop(e) {
    // prevent default browser behavior
    e.preventDefault()
    if(!draggedItem) return
    // catch list of current draggedItem
    const list = e.target.closest("section.main__task-col-sec>ul.task-col-sec__list")
    list.classList.remove("drag-over")

    // retrieve item ID that transfer by drap and drop html api by dataTransfer.getData(dataType) "text/plain"
    const itemId = e.dataTransfer.getData("text/plain")
    // if only drag and drop elements between containers so i do not need function getInsertBeforeElment
    // and in this append item by document.getElementById(itemId)
    // const item = document.getElementById(itemId) 
    // if(!draggedItem?.id) return
    const item = document.getElementById(draggedItem.id) 

    if(!item) return

    const itemType = getItemType(document.getElementById(draggedItem.id),"ul")
    
    // console.log(document.getElementById(draggedItem.id), document.getElementById(draggedItem.id).parentElement, document.getElementById(draggedItem.id).closest("ul"))
    
    item.dataset.itemType = itemType

    // console.log(document.getElementById(draggedItem.id).parentElement .classList.value.split(" "), item.classList.value.split(" "), item.dataset.itemType)
    const updateItem = {
        title: item.querySelector("span").textContent || "",
        id: itemId === ""? draggedItem.id : itemId,
        type: itemType 
    }

    // console.log(kanbanState, countTaskCategories().toDoCount, countTaskCategories().inProgressCount, countTaskCategories().doneCount)
    updateState(updateItem) 
    updateBadges(countTaskCategories())
    updateLocalStorage(updateItem)

    // console.log(itemType, draggedItem.id, updateItem.itemType, updateItem.id, updateItem.title)
    // then append item to selected or target list  by list.appendChild(item) that already proccessed inside dragover event 
}
// INITIALIZE APP BY KANBAN STATE
export function initializeApp() {
    const storage = restoreLocalStorage()
    if(!storage) return
    const {tasks} = storage
    for(const task of tasks)
        updateState(task)
    const {items} = kanbanState
    // console.log(items, kanbanState)
    items.map(({title, type, id}) => addNewListItem(title, id, type))
    updateBadges(countTaskCategories())    
}
// UPDATE DOM BY COUNT OF ITEM_TYPES
export function updateBadges(count = {}) {
    const {[TODO]: todoCount, [PROG]: progCount, [DONE]: doneCount} = count
    for(const badge of allBadges)
        badge.textContent = getItemType(badge.parentElement.nextElementSibling) === TODO? todoCount : getItemType(badge.parentElement.nextElementSibling) === PROG? progCount : doneCount
}