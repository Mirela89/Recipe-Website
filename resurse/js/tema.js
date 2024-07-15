// 2 TEME
// let tema = localStorage.getItem("tema");
// if (tema)
//     document.body.classList.add("dark");

// window.addEventListener("DOMContentLoaded", function () {
//     if (document.body.classList.contains("dark")) {
//         document.getElementById("tema").checked = "true";
//     }
//     document.getElementById("tema").onclick = function () {
//         if (document.body.classList.contains("dark")) {
//             document.body.classList.remove("dark");
//             localStorage.removeItem("tema");
//         }
//         else {
//             document.body.classList.add("dark");
//             localStorage.setItem("tema", "dark");
//         }
//     }
// });


// 3 TEME
window.addEventListener("DOMContentLoaded", function(){
    var selectTheme = document.getElementById("schimba-tema"); // Găsește elementul cu id-ul "schimba-tema"
    
    // Adaugă un eveniment de schimbare pentru elementul selectat
    selectTheme.addEventListener("change", function() {
        var selectedTheme = selectTheme.value; // Obține valoarea temei selectate
        document.body.classList.remove("light", "dark", "blue"); // Elimină toate clasele de temă existente de pe elementul body
        document.body.classList.add(selectedTheme); // Adaugă clasa temei selectate pe elementul body
        localStorage.setItem("tema", selectedTheme); // Salvează tema selectată în localStorage
    });

    var savedTheme = localStorage.getItem("tema"); // Obține tema salvată din localStorage

    // Dacă există o temă salvată, aplic-o pe body și setează selectarea curentă
    if (savedTheme) {
        document.body.classList.add(savedTheme);
        selectTheme.value = savedTheme;
    }
});