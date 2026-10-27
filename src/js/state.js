/** kanban state
 *  {
 *      items: [{id:  ,title:  ,type: }]
 *      to-do-counter:
 *      in-progress-counter:
 *      done-counter:
 *  } 
 */

export const TODO = "to-do-list", PROG = "in-progress-list", DONE = "done-list"

export let kanbanState = {
    items: [],
    toDoCount: 0, 
    inProgressCount: 0, 
    doneCount: 0
}

export function updateCountState(itemId = "", isAdded = false, isDeleted = false, isModified = false) {
    if((!isAdded || !isDeleted || !isModified) && !itemId) return
    const {items} = kanbanState
    return items.reduce((counter, item) => {
        const countState = 
            (isAdded || isModified) && item.type === TODO && item.id === itemId || 
            isDeleted && item.type === TODO && item.id === itemId || 
            (isAdded || isModified) && item.type === PROG && item.id === itemId || 
            isDeleted && item.type === PROG && item.id === itemId || 
            (isAdded || isModified) && item.type === DONE && item.id === itemId || 
            isDeleted && item.type === DONE && item.id === itemId 

        switch(countState) {
            case (isAdded || isModified) && item.type === TODO && item.id === itemId:
                counter.toDoCount++
            break;
            case isDeleted && item.type === TODO && item.id === itemId:
                counter.toDoCount--
            break;
            case (isAdded || isModified) && item.type === PROG && item.id === itemId:
                counter.inProgressCount++
            break;
            case isDeleted && item.type === PROG && item.id === itemId:
                counter.inProgressCount--
            break;
            case (isAdded || isModified) && item.type === DONE && item.id === itemId :
                counter.doneCount++
            break;
            case isDeleted && item.type === DONE && item.id === itemId:
                counter.doneCount--
            break;
        }
        return counter
    }, {
        toDoCount: 0,
        inProgressCount: 0,
        doneCount: 0
    })
}

// export function updateCountState(isAdded = false, isDeleted = false, isModified = false, itemType = "") {
//     if((!isAdded || !isDeleted || !isModified) && !itemType) return
//     const countState = 
//         (isAdded || isModified) && itemType === TODO || 
//         isDeleted && itemType === TODO || 
//         (isAdded || isModified) && itemType === PROG || 
//         isDeleted && itemType === PROG || 
//         (isAdded || isModified) && itemType === DONE || 
//         isDeleted && itemType === DONE 
    
//     switch(countState){
//         case (isAdded || isModified) && itemType === TODO:
//             kanbanState.toDoCount++
//         break;
//         case isDeleted && itemType === TODO:
//             kanbanState.toDoCount--
//         break;
//         case (isAdded || isModified) && itemType === PROG:
//             kanbanState.inProgressCount++
//         break;
//         case isDeleted && itemType === PROG:
//             kanbanState.inProgressCount--
//         break;
//         case (isAdded || isModified) && itemType === DONE:
//             kanbanState.doneCount++
//         break;
//         case isDeleted && itemType === DONE :
//             kanbanState.doneCount--
//         break;
//     }
// }

export function deleteItemState(itemId = "") {
    if(!itemId) return
    kanbanState = {
        ...kanbanState,
        items: [...kanbanState.items.filter(item => item.id !== itemId)]
    }
}

export function updateState(item = {}) {
    if(!Object.keys(item).length) return
    const {items} = kanbanState
    const isExist = items.filter(task => task.id === item.id) ? false : true
    if(isExist) {
        kanbanState = {
            ...kanbanState,
            items: [...kanbanState.items.filter(task => task.id !== item.id), item]
        }
        return
    } 
    kanbanState = {
        ...kanbanState,
        items: [...kanbanState.items, item]
    }
}

export function resetState() {
    Object.assign(kanbanState, {
        items: [],
        toDoCount: 0,
        inProgressCount: 0,
        doneCount: 0
    })
}