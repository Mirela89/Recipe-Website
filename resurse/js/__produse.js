//OLD- prajituri
window.addEventListener("load", function() {
    document.getElementById("filtrare").onclick = function() {
        var inpNume = document.getElementById("inp-nume").value.toLowerCase().trim();
        var descriptionText = document.getElementById("inp-cuvant-cheie").value.toLowerCase().trim();

        var radioCalorii = document.getElementsByName("gr_rad");
        var inpCalorii;
        var tipuri = document.getElementsByName("gr_chck");

        for (let rad of radioCalorii) {
            if (rad.checked) {
                inpCalorii = rad.value;
                break;
            }
        }

        var minCalorii, maxCalorii;
        if (inpCalorii != "toate") {
            var vCal = inpCalorii.split(":");
            minCalorii = parseInt(vCal[0]);
            maxCalorii = parseInt(vCal[1]);
        }

        var inpPret = parseFloat(document.getElementById("inp-pret").value);
        var inpCateg = document.getElementById("inp-categorie").value.toLowerCase().trim();
        var produse = document.getElementsByClassName("produs");

        var vTip = [];
        var checkboxes = document.querySelectorAll('input[name="gr_chck"]:checked');
        checkboxes.forEach(function(checkbox) {
            vTip.push(checkbox.value);
        });

        var selectedIngredients = [];
        var selectedOptions = document.getElementById("i_sel_multiplu").selectedOptions;
        for (var i = 0; i < selectedOptions.length; i++) {
            selectedIngredients.push(selectedOptions[i].value);
        }

        for (let produs of produse) {
            // TEXT
            var valNume = produs.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase().trim();
            var cond1 = valNume.startsWith(inpNume);

            // RADIO
            var valCalorii = parseInt(produs.getElementsByClassName("val-calorii")[0].innerHTML);
            var cond2 = (inpCalorii == "toate" || (minCalorii <= valCalorii && valCalorii < maxCalorii));

            // RANGE
            var valPret = parseFloat(produs.getElementsByClassName("val-pret")[0].innerHTML);
            var cond3 = (valPret >= inpPret);

            // SELECT SIMPLU
            var valCategorie = produs.getElementsByClassName("val-categorie")[0].innerHTML.toLowerCase().trim();
            var cond4 = (inpCateg == valCategorie || inpCateg == "toate");

            // CHECKBOX
            var valTip = produs.getElementsByClassName("val-tip")[0].innerHTML;
            var cond5 = (vTip.includes(valTip));

            // SELECT MULTIPLU
            var prod_ingrediente = produs.getElementsByClassName("val-ingrediente")[0].innerHTML;
            var cond6 = selectedIngredients.every(function(ingredient) {
                return !prod_ingrediente.includes(ingredient);
            });

            // DATALIST
            var selectedIngredientsArray = Array.from(selectedOptions).map(option => option.value);
            var cond7 = selectedIngredientsArray.every(ingredient => !prod_ingrediente.includes(ingredient));

            // TEXTARE
            var valDescriere = produs.getElementsByClassName("val-descriere")[0].innerHTML.toLowerCase().trim();
            var cond8 = valDescriere.includes(descriptionText);

            if (cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7 && cond8) {
                produs.style.display = "block";
            } else {
                produs.style.display = "none";
            }
        }
    }

    

    document.getElementById("resetare").onclick = function() {
        if (confirm("Sunteți sigur că doriți să resetați filtrele?")) {
            // Resetează toate inputurile la valorile implicite
            document.getElementById("inp-nume").value = ""; //TEXT
            document.getElementById("inp-pret").value = document.getElementById("inp-pret").min; //RANGE
            document.getElementById("inp-categorie").value = "toate"; //SELECT SIMPLU
            document.getElementById("i_rad4").checked = true; //RADIO
            document.getElementById("i_sel_multiplu").selectedIndex = -1; //SELECT MULTIPLU
            var checkboxes = document.getElementsByName("gr_chck"); //CHECKBOX
            for (let ch of checkboxes) {
                ch.checked = true;
            }
            document.getElementById("inp-cuvant-cheie").value = ""; //TEXTARE

            // Reafișăm toate produsele
            var produse = document.getElementsByClassName("produs");
            for (let prod of produse) {
                prod.style.display = "block";
            }
        }
    }

    // FUNCTIA DE SORTARE
    function sortare(semn) {
        var produse = document.getElementsByClassName("produs");
        var v_produse = Array.from(produse);
    
        v_produse.sort(function(a, b) {
            let nume_a = a.getElementsByClassName("val-nume")[0].innerHTML;
            let nume_b = b.getElementsByClassName("val-nume")[0].innerHTML;
    
            if (nume_a === nume_b) {
                let descriere_a = a.getElementsByClassName("val-descriere")[0].innerHTML.length;
                let descriere_b = b.getElementsByClassName("val-descriere")[0].innerHTML.length;
                return semn * (descriere_a - descriere_b);
            }
            
            return semn * nume_a.localeCompare(nume_b);
        });
    
        for (let prod of v_produse) {
            prod.parentElement.appendChild(prod);
        }
    }
    
    document.getElementById("sortCrescNume").onclick = function() {
        sortare(1);
    }
    document.getElementById("sortDescrescNume").onclick = function() {
        sortare(-1);
    }
    

    // BUTON CALCUL PRET
    document.getElementById("calculeaza").onclick = function() {
        if (document.getElementById("info-suma"))
            return;
        
        var produse = document.getElementsByClassName("produs");
        let suma = 0;

        //calculez suma produselor
        for (let prod of produse) {
            if (prod.style.display != "none") {
                let pret = parseFloat(prod.getElementsByClassName("val-pret")[0].innerHTML);
                suma += pret;
            }
        }

        //afisez rezultatul
        let p = document.createElement("p");
        p.innerHTML = "Suma: " + suma;
        p.id = "info-suma";

        //inserez paragraful dupa placeholder
        let ps = document.getElementById("p-suma");
        let container = ps.parentNode;
        let frate = ps.nextElementSibling;
        container.insertBefore(p, frate);

        //apare doar doua secunde
        setTimeout(function() {
            let info = document.getElementById("info-suma");
            if (info)
                info.remove();
        }, 2000);
    }
})
