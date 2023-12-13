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
    "Mobile Phones",
    "Computers, PC, Cameras",
    "General Electronics",
    "Services",
    "Pets",
    "Food and Agriculture",
    "Fashion and Interior",
    "Health and Beauty",
    "Children and Babies",
    "Sports and Extra Curricular",
    "Furniture",
    "Kitchenware",
]

// categories of items
export const Countries = [
    "Kenya",
    "Uganda",
    "Tanzania",
    "Rwanda",
    "Burundi",
]

// counties
export const Counties = [
    [
        // kenyan
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
        "Nairobi",
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
        "Kongasis",
        "Bulambuli",
        "Buliisa",
        "Bughendera",
        "Bwamba",
        "Bushenyi-Ishaka",
        "Igara",
        "Busia",
        "Samia-Bugwe",
        "Bunyole",
        "Butambala",
        "Buvuma Islands",
        "Budiope East",
        "Budiope West",
        "Dokolo",
        "Gomba",
        "Aswa",
        "Gulu",
        "Omoro",
        "Bugahya",
        "Buhaguzi",
        "Hoima",
        "Ibanda",
        "Bugweri",
        "Iganga",
        "Kigulu",
        "Bukanga",
        "Isingiro",
        "Butembe",
        "Jinja",
        "Kagoma",
        "Dodoth East",
        "Dodoth West",
        "Kabale",
        "Ndorwa",
        "Rubanda",
        "Rukiga",
        "Bunyangabu",
        "Burahya",
        "Fort Portal",
        "Nakasongola",
        "Kaberamaido",
        "Kalaki",
        "Bujumba",
        "Kyamuswa",
        "Bulamogi",
        "Kalungu",
        "Kampala Capital City",
        "Bugabula",
        "Buzaaya",
        "Kibale",
        "Kitagwenda",
        "Kinkiizi",
        "Tingey",
        "Bukonzo",
        "Busongora",
        "Kasese",
        "Toroma",
        "Usuk",
        "Bbaale",
        "Ntenjeru",
        "Bugangaizi",
        "Bugangaizi East",
        "Buyaga",
        "Buyaga West",
        "Buyanja",
        "Kiboga East",
        "Kibuku",
        "Kazo",
        "Nyabushozi",
        "Kibanda",
        "Bufumbira",
        "Chua",
        "Koboko",
        "Kole",
        "Jie",
        "Kumi",
        "Kween",
        "Kiboga West",
        "Kyaka",
        "Mwenge",
        "Lamwo",
        "Erute",
        "Lira",
        "Luuka",
        "Bamunanika",
        "Katikamu",
        "Bukoto",
        "Kabula",
        "Bubulo",
        "Maracha",
        "Bukoto Central",
        "Bukoto East",
        "Masaka",
        "Bujenje",
        "Buruuli",
        "Masindi",
        "Bunya",
        "Bungokho",
        "Mbale",
        "Kashari",
        "Mbarara",
        "Rwampara",
        "Ruhinda",
        "Busujju",
        "Mityana",
        "Matheniko",
        "Moroto",
        "Obongi",
        "West Moyo",
        "Mawokota",
        "Buwekula",
        "Kasambya",
        "Kassanda",
        "Mukono",
        "Mukono",
        "Ik",
        "Nakifuma Council",
        "Chekwii (Kadam)",
        "Pian",
        "Nakaseke North",
        "Nakaseke South",
        "Budyebo",
        "Nakasongola",
        "Bukooli Island",
        "Bukooli South",
        "Busiki",
        "Bokora",
        "Jonam",
        "Padyere",
        "Ngora",
        "Ntoroko",
        "Kajara",
        "Ntungamo",
        "Ruhaama",
        "Rushenyi",
        "Nwoya",
        "Otuke",
        "Oyam",
        "Aruu",
        "Agule",
        "Butebo",
        "Pallisa",
        "Kakuuto",
        "Kooki",
        "Kyotera",
        "Bunyaruguru",
        "Katerera",
        "Rubabo",
        "Rujumbura",
        "Rukungiri Municipal",
        "Lwemiyaga",
        "Mawogola",
        "Kasilo",
        "Serere",
        "Sheema",
        "Budadiri",
        "Soroti",
        "West Budama Council",
        "Busiro",
        "Entebbe",
        "Kyadondo",
        "Aringa",
        "Okoro"
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
        "Unguja North (Zanzibar)",
        "Unguja South (Zanzibar)",
    ],
    [
        // Rwanda
        "Umujyi wa Kigali (Kigali)",
        "Amajyepfo (Southern)",
        "Iburengerazuba (Western)",
        "Amajyaruguru (Northern)",
        "Iburasirazuba (Eastern)",
    ],
    [
        // Burundi
        "Cankuzo",
        "Gitega",
        "Rutana",
        "Ruyigi",
        "Karuzi",
        "Kayanza",
        "Kirundo",
        "Muyinga",
        "Ngozi",
        "Bururi",
        "Makamba",
        "Rumonge",
        "Bubanza",
        "Bujumbura Mairie",
        "Bujumbura Rural",
        "Cibitoke",
        "Muramvya",
        "Mwaro",
    ]
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

export const VAPID_KEY = "BOrMn0qr1bE_vZkFcBUvl3-BgGKWNp_YZyL07dAGi7rRRZylFwsVga2G4Av8Ze73_6heTOmxDB_LdSp8sBD9OUs";