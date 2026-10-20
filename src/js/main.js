import { addBtn, clearBtn, addTemplate, main } from "./selectors.js";
import { addNewTask, cloneTemplate, openModal, updateLocalStorage, saveModal, removeModal } from "./utils.js";



addBtn?.addEventListener("click", () => {
    cloneTemplate(addTemplate, main)
    const selector = "dialog.add-template__modal"
    openModal(selector)
})

main.addEventListener("click", (e) => {
    if(e.target.matches("button.add-form__button")) {
        const textarea = main.querySelector("textarea.add-form__textarea")
        const taskTitle =  textarea.value
        const taskDate = new Date().toISOString()
        const task = {
            taskTitle,
            taskDate
        }
        updateLocalStorage(task)
        const selector = "dialog.add-template__modal"
        removeModal(selector)
    }
})