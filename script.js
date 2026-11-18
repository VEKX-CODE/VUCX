let isDirect = true;
function toggleMode() {
    isDirect = !isDirect;
    updateLabel();
}
function convert() {
    let number = Number(document.getElementById("value").value);
    let unit = document.getElementById("Unit").value;
    let result = 0;

   if (unit === "Miles") {
        result = isDirect ? number * 1.60934 : number / 1.60934;
    } else if (unit === "m") {
        result = isDirect ? number * 100 : number / 100;
    } else if (unit === "sm") {
        result = isDirect ? number / 100 : number * 100;
    } else if (unit === "KByte") {
        result = isDirect ? number * 1024 : number / 1024;
    } else if (unit === "Mbyte") {
        result = isDirect ? number * 1024 * 1024 : number / (1024 * 1024);
    } else if (unit === "Bite") {
        result = isDirect ? number / 1024 : number * 1024;
    }

    document.getElementById("result").innerText = result.toFixed(2);
}

function updateLabel() {
    let unit = document.getElementById("Unit").value;
    let text = "";
    if (unit === "Miles") {
        text = isDirect ? "Мили ➔ Километры" : "Километры ➔ Мили";
    } else if (unit === "m") {
        text = isDirect ? "Метры ➔ Сантиметры" : "Сантиметры ➔ Метры";
    } else if (unit === "sm") {
        text = isDirect ? "Сантиметры ➔ Метры" : "Метры ➔ Сантиметры";
    } else if (unit === "KByte") {
        text = isDirect ? "Килобайты ➔ Байты" : "Байты ➔ Килобайты";
    } else if (unit === "Mbyte") {
        text = isDirect ? "Мегабайты ➔ Байты" : "Байты ➔ Мегабайты";
    } else if (unit === "Bite") {
        text = isDirect ? "Байты ➔ Килобайты" : "Килобайты ➔ Байты";
    }
    document.getElementById("directionLabel").innerText = text;
}