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


export function windowResized() {

        // this was evoked from a literal page resize
        // get window width
        const ww = Math.max(document.documentElement["clientWidth"], window["innerWidth"]);
        const rightDiv = document.getElementById("imageDivModal").querySelector("#modalRight");
        const leftDiv = document.getElementById("imageDivModal").querySelector("#modalLeft");
        const leftURL = leftDiv.querySelectorAll("img")[0].src;
        if (rightDiv) {
            if (ww >= 620) {
                // we are resizing upwards
                rightDiv.style.backgroundImage = `url("")`;
                rightDiv.style.backgroundColor = "var(--whiteColor)";
                return
            }
            // we are resizing downwards
            rightDiv.style.backgroundImage = `url(${leftURL})`;
            rightDiv.style.backgroundColor = "var(--darkColor)";
            
        }

}