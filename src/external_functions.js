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

// configure firebase
export const firebaseConfigurationDetails = {
    apiKey: "AIzaSyB-opll1P-81cOoc7oQUQ7G5QUSK5FhfrA",
    authDomain: "retro-bf312.firebaseapp.com",
    databaseURL: "https://retro-bf312-default-rtdb.firebaseio.com",
    projectId: "retro-bf312",
    storageBucket: "retro-bf312.appspot.com",
    messagingSenderId: "319056909364",
    appId: "1:319056909364:web:f2215ade4b825b8fe56661",
    measurementId: "G-NT5D2WTQ8T"
}

// categories of items
export const Categories = [
    "Vehicles",
    "Service",
    "Mobile Phones",
    "Computers",
    "Other Electronics",
    "Pets",
    "Agriculture",
    "Fashion",
    "Indoor Design",
    "Health and Beauty",
    "Children",
    "Sports",
]

// categories of items
export const Countries = [
    "Kenya",
    "Uganda",
    "Tanzania",
]

// counties
export const Counties = [
    [
        // kenyan
        "Nairobi",
        "Mombasa",
        "Kwale",
        "Kilifi",
        "Tana River",
        "Lamu",
        "Taita Taveta",
        "Garissa",
        "Wajir",
        "Mandera",
        "Marsabit",
        "Isiolo",
        "Meru",
        "Tharaka-Nithi",
        "Embu",
        "Kitui",
        "Machakos",
        "Makueni",
        "Nyandarua",
        "Nyeri",
        "Kirinyaga",
        "Murang'a",
        "Kiambu",
        "Turkana",
        "West Pokot",
        "Samburu",
        "Trans-Nzoia",
        "Uasin Gishu",
        "Elgeyo-Marakwet",
        "Nandi",
        "Baringo",
        "Laikipia",
        "Nakuru",
        "Narok",
        "Kajiado",
        "Kericho",
        "Bomet",
        "Kakamega",
        "Vihiga",
        "Bungoma",
        "Busia",
        "Siaya",
        "Kisumu",
        "Homa Bay",
        "Migori",
        "Kisii",
        "Nyamira",
    ],
    [
        // Uganda
        "Tororo",
        "Labwor",
        "East Moyo",
        "Agago",
        "Ajuri",
        "Moroto",
        "Kioga",
        "Upe",
        "Amuria",
        "Kapelebyong",
        "Kilak",
        "Kwania",
        "Maruzi",
        "Ayivu",
        "Madi-Okollo",
        "Terego",
        "Vurra",
        "Budaka",
        "Iki-Iki",
        "Manjiya",
        "Bukooli",
        "Buhweju",
        "Buikwe",
        "Bukedea",
        "Bukomansimbi",
    ],
    [
        // Tanzania
        "Arusha",
        "Dar Es Salaam",
        "Dodoma",
        "Geita",
        "Iringa",
        "Kagera",
        "Katavi",
        "Kigoma",
        "Lindi",
        "Manyara",
        "Mbeya",
        "Mjini Magharibi",
        "Morogoro",
        "Mtwara",
        "Mwanza",
        "Njombe",
        "Pemba North",
        "Pemba South",
        "Pwani",
        "Rukwa",
        "Ruvuma",
        "Shinyanga",
        "Simiyu",
        "Singida",
        "Songwe",
        "Tabora",
        "Tanga",
        "Unguja North",
        "Unguja South",
    ],
]

export const adPageHiddenDivs = desiredID => {
    const disappearThese = document.querySelectorAll(".defaultHidden");
    if (disappearThese) {
        for (let i = 0; i < disappearThese.length; i++) {
            const element = disappearThese[i];
            element.style.display = "none";
        }
    }
    document.getElementById( desiredID ).style.display = "inline";
}