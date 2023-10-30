// an onclick event that is only active when the aside menu is on...in mobile devices, hide it
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

// create cookies
export function createCookie(name, value, daysToExpire) {
    let cookie = name + '=' + value;
  
    if (daysToExpire) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + daysToExpire);
      cookie += '; expires=' + expirationDate.toUTCString();
    }
  
    document.cookie = cookie;
  }

// delete cookies
export function deleteCookie(name) {
const expirationDate = new Date('Thu, 01 Jan 1970 00:00:00 UTC');
document.cookie = name + '=; expires=' + expirationDate.toUTCString();
}