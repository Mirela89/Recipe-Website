/*let tema = localStorage.getItem("tema");
if (tema) {
    if (tema === "dark") {
        document.body.classList.add("dark");
    } else if (tema === "blue") { // Add an else if statement for the blue theme
        document.body.classList.add("blue");
    }
}

window.addEventListener("DOMContentLoaded", function() {
    document.getElementById("schimba-tema").onclick = function() {
        if (document.body.classList.contains("dark")) {
            document.body.classList.remove("dark")
            localStorage.removeItem("tema");
        } else if (document.body.classList.contains("blue")) { // Remove the blue theme if applied
            document.body.classList.remove("blue");
            localStorage.removeItem("tema");
        } else {
            document.body.classList.add("dark")
            localStorage.setItem("tema", "dark");
        }
    }
});*/

window.addEventListener("DOMContentLoaded", function(){
    var selectTheme = document.getElementById("schimba-tema");
    
    selectTheme.addEventListener("change", function() {
        var selectedTheme = selectTheme.value;
        document.body.classList.remove("light", "dark", "blue");
        document.body.classList.add(selectedTheme);
        localStorage.setItem("tema", selectedTheme);
    });

    var savedTheme = localStorage.getItem("tema");
    if (savedTheme) {
        document.body.classList.add(savedTheme);
        selectTheme.value = savedTheme;
    }
});