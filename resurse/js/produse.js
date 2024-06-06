window.addEventListener("load", function() {
    document.getElementById("filtrare").onclick = function() {
        var produse = document.getElementsByClassName("produs");

        //nume
        var inpNume = document.getElementById("inp-nume").value.toLowerCase().trim();

        //radio Gramaj
        var radioGramaj = document.getElementsByName("gr_rad");
        var inpGramaj;
        for (let rad of radioGramaj) {
                    if (rad.checked) {
                        inpGramaj = rad.value;
                        break;
                    }
        }

        var minGramaj, maxGramaj;
        if (inpGramaj != "toate") {
            var vGramaj = inpGramaj.split(":");
            minGramaj = parseInt(vGramaj[0]);
            maxGramaj = parseInt(vGramaj[1]);
        }

        //checkbox tara
        var vTara = [];
        var checkboxes = document.querySelectorAll('input[name="gr_chck"]:checked');
        checkboxes.forEach(function(checkbox) {
            vTara.push(checkbox.value);
        });
        
        //range pret
        var inpPret = parseFloat(document.getElementById("inp-pret").value);

        //select simplu categorie
        var inpCateg = document.getElementById("inp-category").value.toLowerCase().trim();
        console.log("Selected Category:", inpCateg);

        //datalist ingrediente
        var inpIngredient = document.getElementById("i_datalist").value.toLowerCase().trim();

        //select multiplu
        var selectedIngredients = [];
        var selectedOptions = document.getElementById("i_sel_multiplu").selectedOptions;
        for (var i = 0; i < selectedOptions.length; i++) {
            selectedIngredients.push(selectedOptions[i].value);
        }

        //textare descriere
        var descriptionText = document.getElementById("inp-cuvant-cheie").value.toLowerCase();

        for (let produs of produse) {
            // TEXT 
            var valNume = produs.getElementsByClassName("val-nume")[0].innerHTML.toLowerCase().trim();
            var cond1 = valNume.startsWith(inpNume);

            // RADIO
            var valGramaj = parseInt(produs.getElementsByClassName("val-gramaj")[0].innerHTML);
            var cond2 = (inpGramaj == "toate" || (minGramaj <= valGramaj && valGramaj < maxGramaj));

            // RANGE
            var valPret = parseFloat(produs.getElementsByClassName("val-pret")[0].innerHTML);
            var cond3 = (valPret <= inpPret);

            // SELECT SIMPLU
            var valCategorie = produs.getElementsByClassName("val-category")[0].innerHTML.toLowerCase().trim();
            var cond4 = (inpCateg == valCategorie || inpCateg == "toate");

            // CHECKBOX
            var valTara = produs.getElementsByClassName("val-tara")[0].innerHTML;
            var cond5 = (vTara.includes(valTara));

            // SELECT MULTIPLu
            var prod_ingrediente = produs.getElementsByClassName("val-ingrediente")[0].innerHTML;
            var cond6 = Array.from(selectedOptions).every(function(option) {
                return !prod_ingrediente.includes(option.value);
            });

            // DATALIST
            var valIngrediente = produs.getElementsByClassName("val-ingrediente")[0].innerHTML.toLowerCase().trim();
            var cond7 = (inpIngredient === "" || valIngrediente.includes(inpIngredient));

            // TEXTARE
            var valDescriere = produs.getElementsByClassName("val-descriere")[0].innerHTML.toLowerCase();
            var cond8 = valDescriere.includes(descriptionText); 

            if (cond1 && cond2 && cond3 && cond4 && cond5 && cond6 && cond7 && cond8) {
                produs.style.display = "block";
            } else {
                produs.style.display = "none";
            }
        }
    }
    

    //am adaugat o functie astfel incat sa se schimbe valoarea range-ului de pret in timp real
    document.getElementById("inp-pret").onchange = function () {
        document.getElementById("infoRange").innerHTML = `(${this.value})`;
    }
    

    document.getElementById("resetare").onclick = function() {
        if (confirm("Sunteți sigur că doriți să resetați filtrele?")) {
            // Resetează toate inputurile la valorile implicite
            document.getElementById("inp-nume").value = ""; //TEXT
            document.getElementById("inp-pret").value = document.getElementById("inp-pret").max; //RANGE
            document.getElementById("inp-category").value = "toate"; //SELECT SIMPLU
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
        p.innerHTML = "Suma: " + suma.toFixed(2);
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
