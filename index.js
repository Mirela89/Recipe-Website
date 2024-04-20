//CTRL+C oprire, repornit node .
const express = require("express");
const fs= require('fs');
const path=require('path');
const sharp=require('sharp');
const sass=require('sass');
// const ejs=require('ejs');
 
 
obGlobal ={
    obErori:null,
    obImagini:null,
    folderScss:path.join(__dirname,"resurse/scss"),
    folderCss:path.join(__dirname,"resurse/css"),
    folderBackup:path.join(__dirname,"backup")
}

app= express(); //primeste cereri de la clienti
console.log("Folder proiect", __dirname); //dirname este folder aplicatiei
console.log("Cale fisier", __filename);
console.log("Director de lucru", process.cwd()); //process.cwd() e folder de unde rulam aplicatia
//__dirname și process.cwd() nu sunt întotdeauna același lucru.


 
app.set("view engine","ejs");

vect_foldere=["temp", "temp1"];
for(let folder of vect_foldere){
    let caleFolder = path.join(__dirname, folder)
    if(!fs.existsSync(caleFolder)){ //daca nu exista cale folder
        fs.mkdirSync(caleFolder); //o creez
    }
}
 
app.use("/resurse", express.static(__dirname+"/resurse"));



app.get(["/", "/index", "/home"],function(req, res){
    //res.sendFile(__dirname+"/index.html")
    res.render("pagini/index", {ip: req.ip, imagini: obGlobal.obImagini.imagini});
})

// trimiterea unui mesaj fix
app.get("/cerere", function(req, res){
    res.send("<b>Hello</b> <span style='color:red'>world!</span>");

})

//trimiterea unui mesaj dinamic

app.get("/data", function(req, res, next){
    res.write("Data: ");
    next();
});
app.get("/data", function(req, res){
    res.write(""+new Date());
    res.end();

});

/*
trimiterea unui mesaj dinamic in functie de parametri (req.params; req.query)
ce face /* si ordinea app.get-urilor.
*/
app.get("/suma/:a/:b", function(req, res){
    var suma=parseInt(req.params.a)+parseInt(req.params.b)
    res.send(""+suma);

}); 

app.get("/favicon.ico", function(req, res){
    res.sendFile(path.join(__dirname+"/resurse/ico/favicon.ico"));
});

app.get("/*.ejs", function(req, res){
    afisareEroare(res,400);
});

app.get(new RegExp("^\/resurse\/[A-Za-z0-9\/]*\/$"), function(req, res){
    afisareEroare(res,403);
});

app.get("/*", function(req, res){
    console.log(req.url)
    //res.send("whatever");
    try{
        res.render("pagini"+req.url, function(err, rezHtml){
            //console.log(rezHtml);
            //console.log("Eroare:"+err)
            //res.send(rezHtml+""); //codul html al paginii iesit din randare
            if(err){
                if(err.message.startsWith("Failed to lookup view")){
                   afisareEroare(res,404);
                   console.log("Nu a gasit pagina: ", req.url)
                }
            }else{
               res.send(rezHtml+"");
            }
        });
    }catch(err1){
        if(err1.message.startsWith("Cannot find module")){
            afisareEroare(res,404);
            console.log("Nu a gasit resursa: ", req.url)
        }
        else{
            afisareEroare(res);
        }
    }
    

})  
  
function initErori(){
    var continut = fs.readFileSync(path.join(__dirname+"/resurse/json/erori.json")).toString("utf-8");
    console.log(continut);
    obGlobal.obErori = JSON.parse(continut);
    for(let eroare of obGlobal.obErori.info_erori){
        eroare.imagine=path.join(obGlobal.obErori.cale_baza,eroare.imagine);
    }
    console.log(obGlobal.obErori);
}
initErori();

function afisareEroare(res, _identificator, _titlu, _text, _imagine){
    let eroare = obGlobal.obErori.info_erori.find(
        function(elem){
            return elem.identificator == _identificator;
        }
    )
    if (!eroare){
        let eroare_default = obGlobal.obErori.eroare_default
        res.render("pagini/eroare", {
            titlu:_titlu || eroare_default.titlu,
            text: _text || eroare_default.text,
            imagine: _imagine || eroare_default.imagine
        })
    } 
    else{
        if(eroare.status){
            res.status(eroare.identificator)
        }
        res.render("pagini/eroare", {
                titlu:_titlu || eroare.titlu,
                text: _text || eroare.text,
                imagine: _imagine || eroare.imagine
        })
    }
}


//GALERIE STATICA
function initImagini(){
    var continut= fs.readFileSync(path.join(__dirname,"/resurse/json/galerie.json")).toString("utf-8");

    obGlobal.obImagini=JSON.parse(continut);
    let vImagini=obGlobal.obImagini.imagini;

    let caleAbs=path.join(__dirname,obGlobal.obImagini.cale_galerie);
    let caleAbsMediu=path.join(__dirname,obGlobal.obImagini.cale_galerie, "mediu");
    let caleAbsMic = path.join(__dirname, obGlobal.obImagini.cale_galerie, "mic");

    if (!fs.existsSync(caleAbsMediu))
        fs.mkdirSync(caleAbsMediu);
    if (!fs.existsSync(caleAbsMic))
        fs.mkdirSync(caleAbsMic);

    //for (let i=0; i< vErori.length; i++ )
    for (let imag of vImagini){
        [numeFis, ext]=imag.cale_imagine.split(".");//???
        let caleFisAbs=path.join(caleAbs,imag.cale_imagine);
        let caleFisMediuAbs=path.join(caleAbsMediu, numeFis+".webp");
        let caleFisMicAbs = path.join(caleAbsMic, numeFis + ".webp");

        sharp(caleFisAbs).resize(400).toFile(caleFisMediuAbs);
        sharp(caleFisAbs).resize(200).toFile(caleFisMicAbs);

        imag.cale_imagine_mediu=path.join("/", obGlobal.obImagini.cale_galerie, "mediu",numeFis+".webp" )
        imag.cale_imagine_mic = path.join("/", obGlobal.obImagini.cale_galerie, "mic", numeFis + ".webp")
        imag.cale_imagine=path.join("/", obGlobal.obImagini.cale_galerie, imag.cale_imagine)
    }
    console.log(obGlobal.obImagini)
}
initImagini();

//ETAPA 5 --- Compilare automata scss ---
// Function to compile SCSS to CSS
function compileazaScss(caleScss, caleCss){
    console.log("cale:",caleCss);

    // If 'caleCss' is not provided, generate a CSS file name based on the SCSS file name
    if(!caleCss){
        let numeFisExt=path.basename(caleScss);
        let numeFis=numeFisExt.split(".")[0]  // Extract file name without extension
        caleCss=numeFis+".css";// Add '.css' extension
    }
    
    // If 'caleScss' is not an absolute path, make it absolute using 'obGlobal.folderScss'
    if (!path.isAbsolute(caleScss))
        caleScss=path.join(obGlobal.folderScss,caleScss )

    // If 'caleCss' is not an absolute path, make it absolute using 'obGlobal.folderCss'
    if (!path.isAbsolute(caleCss))
        caleCss=path.join(obGlobal.folderCss,caleCss )
    
    // Create a backup directory for CSS files if it doesn't exist
    let caleBackup=path.join(obGlobal.folderBackup, "resurse/css");
    if (!fs.existsSync(caleBackup)) {
        fs.mkdirSync(caleBackup,{recursive:true})
    }
    
    // la acest punct avem cai absolute in caleScss si  caleCss
    // Copy the existing CSS file to the backup directory if it exists
    //TO DO
    let numeFisCss=path.basename(caleCss);
    if (fs.existsSync(caleCss)){
        fs.copyFileSync(caleCss, path.join(obGlobal.folderBackup, "resurse/css",numeFisCss ))// +(new Date()).getTime()
    }
    rez=sass.compile(caleScss, {"sourceMap":true}); // Compile SCSS to CSS
    fs.writeFileSync(caleCss,rez.css) // Write the compiled CSS to the target CSS file
    //console.log("Compilare SCSS",rez);
}
//compileazaScss("a.scss");
// Compile all SCSS files in the SCSS folder
vFisiere=fs.readdirSync(obGlobal.folderScss);
for( let numeFis of vFisiere ){
    if (path.extname(numeFis)==".scss"){
        compileazaScss(numeFis);
    }
}

// Watch for changes in the SCSS folder
fs.watch(obGlobal.folderScss, function(eveniment, numeFis){
    console.log(eveniment, numeFis);
    if (eveniment=="change" || eveniment=="rename"){
        let caleCompleta=path.join(obGlobal.folderScss, numeFis);
        if (fs.existsSync(caleCompleta)){
            compileazaScss(caleCompleta);
        }
    }
})
 
 
app.listen(8080);
console.log("Serverul a pornit");