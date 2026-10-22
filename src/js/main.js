import { addBtn, clearBtn, addTemplate, main } from "./selectors.js";
import { addNewTask, cloneTemplate, openModal, updateLocalStorage, saveModal, closeModal } from "./utils.js";



addBtn?.addEventListener("click", () => {
    cloneTemplate(addTemplate, main)
    const selector = "dialog.add-template__modal"
    openModal(selector)
})

main.addEventListener("click", (e) => {
    if(e.target.matches("dialog.add-template__modal>form.modal__add-form>div.add-form__controls>button.add-form__button.btn-save")) {
        const formCls = "dialog.add-template__modal>form.modal__add-form"
        const form = e.target.closest(formCls)
        // form.addEventListener("submit", (event)=> handleFormSubmittion(event))
    }
})

function handleFormSubmittion (e) {
    // to prevent browser from default behavior when submit form
    e.preventDefault()
    
    const formData = new FormData(e.target)
    const {task: textarea} = Object.fromEntries(formData)
    console.log(formData)
    if(!textarea) {
        const newTask = {
            title: textarea,
            date: new Date().toISOString()
        }
        updateLocalStorage(newTask)
    }
    const dialogCls = "dialog.add-template__modal"
    closeModal(dialogCls)
}

main.addEventListener("close", (e) => {
    if(e.target.matches("dialog.add-template__modal")){
        switch(e.target) {
            case "":
                handleFormSubmittion(e.target.closest("dialog.add-template__modal>form.modal__add-form"))
        }
    }
}, {capture: true})