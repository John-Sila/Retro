export function windowOnclick(event) {
    const menuModal = document.getElementsByTagName("aside")[0];
    if (menuModal) {
        if(event.target.tagName.toString().toLowerCase() !== "aside") {
            if (event.target.parentElement.tagName.toString().toLowerCase() !== "aside") {
                const left = getComputedStyle(menuModal).left;
                if (left === "10px") {
                    menuModal.style.left = "-200vw";
                    window.removeEventListener("click", windowOnclick)
                }
            }
        }
        return;
    }
    return false;
}
