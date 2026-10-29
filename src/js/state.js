/** KANBAN STATE
 *  { items: [{id:  ,title:  ,type: }]} 
 */
// CONSTANT STATES (ITEM_TYPE)
export const TODO = "to-do-list", PROG = "in-progress-list", DONE = "done-list"

// KANBAN STATE
export let kanbanState = {
    items: [],
}
// DELETE ITEM
export function deleteItemState(itemId = "") {
    if(!itemId) return
    kanbanState = {
        ...kanbanState,
        items: [...kanbanState.items.filter(item => item.id !== itemId)]
    }
}
// UPDATE AND EDIT ITEM
export function updateState(item = {}) {
    if(!Object.keys(item).length) return
    const {items} = kanbanState
    if(!items.length)
        return kanbanState = {
            ...kanbanState,
            items: [...kanbanState.items, item]
        }
    const isExist = items.filter(itemTask => itemTask.id === item.id).length > 0 ? true : false
    if(isExist)
        return kanbanState = {
            ...kanbanState,
            items: [...kanbanState.items.filter(task => task.id !== item.id), item]
        }
    return kanbanState = {
        ...kanbanState,
        items: [...kanbanState.items, item]
    }
}
// RESET KANBAN STATE
export function resetState() {
    Object.assign(kanbanState, { items: []})
}
// TRACING STATE AFTER CRUD OPERATIONS
export function logState(operation = "") {
    console.log(`----------- ${operation} --------`);
    const deepClonedState = structuredClone(kanbanState)
    console.log(deepClonedState)
}