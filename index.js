//CTRL+C oprire, repornit node .
const express = require("express");
const fs= require('fs');
const path=require('path');
const sharp=require('sharp');
const sass=require('sass');
const ejs=require('ejs');

const Client = require('pg').Client;

const AccesBD= require("./module_proprii/accesbd.js");

const formidable=require("formidable");
const {Utilizator}=require("./module_proprii/utilizator.js")
const session=require('express-session');
const Drepturi = require("./module_proprii/drepturi.js");

var client= new Client({
        database:"recipe_website",
        user:"mirela",
        password:"mirela",
        host:"localhost",
        port:5432});
client.connect();

// client.query("select * from unnest(enum_range(null::categ_prajitura))", function(err, rez){
//     console.log(rez);
// })
 
obGlobal ={
    obErori:null,
    obImagini:null,
    folderScss:path.join(__dirname,"resurse/scss"),
    folderCss:path.join(__dirname,"resurse/css"),
    folderBackup:path.join(__dirname,"backup"),
    optiuniMeniu: []
}

// client.query("select * from unnest(enum_range(null::tipuri_produse))", function(err, rezCategorie){
//     if (err){
//         console.log(err);
//     }
//     else{
//         obGlobal.optiuniMeniu=rezCategorie.rows;
//     }
// });
client.query("select * from unnest(enum_range(null::categorie))", function(err, rezCategorie){ 
    if (err){
        console.log(err);
    }
    else{
        obGlobal.optiuniMeniu = rezCategorie.rows; 
    }
});


app= express(); //primeste cereri de la clienti
console.log("Folder proiect", __dirname); //dirname este folder aplicatiei
console.log("Cale fisier", __filename);
console.log("Director de lucru", process.cwd()); //process.cwd() e folder de unde rulam aplicatia
//__dirname și process.cwd() nu sunt întotdeauna același lucru.

app.use(session({ // aici se creeaza proprietatea session a requestului (pot folosi req.session)
    secret: 'abcdefg',//folosit de express session pentru criptarea id-ului de sesiune
    resave: true,
    saveUninitialized: false
}));

app.use("/*",function(req, res, next){
    res.locals.optiuniMeniu=obGlobal.optiuniMeniu;
    res.locals.Drepturi=Drepturi;
    if (req.session.utilizator){
        req.utilizator=res.locals.utilizator=new Utilizator(req.session.utilizator);
    }    
    next();
})
 
app.set("view engine","ejs");

vect_foldere=["temp", "temp1", "backup", "poze_uploadate"];
for(let folder of vect_foldere){
    let caleFolder = path.join(__dirname, folder)
    if(!fs.existsSync(caleFolder)){ //daca nu exista cale folder
        fs.mkdirSync(caleFolder); //o creez
    }
}
 
app.use("/resurse", express.static(__dirname+"/resurse"));
app.use("/poze_uploadate", express.static(__dirname+"/poze_uploadate"));
app.use("/node_modules", express.static(__dirname+"/node_modules"));

app.get(["/", "/index", "/home"],function(req, res){
    //res.sendFile(__dirname+"/index.html")
    res.render("pagini/index", {ip: req.ip, imagini: obGlobal.obImagini.imagini});
})

//de verificat index.js
//---------------------- PRODUSE ------------------------------------
// app.get("/produse", function (req, res) {
//     client.query("select * from unnest(enum_range(null::tipuri_produse))", function (err, rezTip) {
//         if (err) {
//             console.log(err);
//         } else {
//             let conditieWhere = "";
//             if (req.query.tip) {
//                 conditieWhere = ` where tip_produs='${req.query.tip}'`;
//             }

//             client.query("select * from prajituri" + conditieWhere, function (err, rez) {
//                 if (err) {
//                     console.log(err);
//                     afisareEroare(res, 2);
//                 } else {
//                     client.query(
//                         "SELECT MIN(pret) AS min_price, MAX(pret) AS max_price FROM prajituri",
//                         function (err, rezPret) {
//                             if (err) {
//                                 console.log(err);
//                                 afisareEroare(res, 2);
//                             } else {
//                                 client.query(
//                                     "SELECT distinct(unnest(ingrediente)) FROM prajituri",
//                                     function (err, rezIngrediente) {
//                                         if (err) {
//                                             console.log(err);
//                                             afisareEroare(res, 2);
//                                         } else {
//                                             client.query(
//                                                 "SELECT * FROM unnest(enum_range(null::categ_prajitura))",
//                                                 function (err, rezCategorie) {
//                                                     if (err) {
//                                                         console.log(err);
//                                                         afisareEroare(res, 2);
//                                                     } else {
//                                                         res.render("pagini/produse", {
//                                                             produse: rez.rows,
//                                                             optiuni: rezCategorie.rows,
//                                                             minPrice: rezPret.rows[0].min_price,
//                                                             maxPrice: rezPret.rows[0].max_price,
//                                                             ingrediente: rezIngrediente.rows.map((row) => row.unnest),
//                                                             tipuri: rezTip.rows,
//                                                         });
//                                                     }
//                                                 }
//                                             );
//                                         }
//                                     }
//                                 );
//                             }
//                         }
//                     );
//                 }
//             });
//         }
//     });
// });


app.get("/produse", function (req, res) {
    client.query("select * from unnest(enum_range(null::categorie))", function (err, rezCategorie) {
        if (err) {
            console.log(err);
        } else {
            let conditieWhere = "";
            if (req.query.category) {
                conditieWhere = ` where category='${req.query.category}'`;
            }
            client.query("select * from recipes" + conditieWhere, function (err, rez) {
                if (err) {
                    console.log(err);
                    afisareEroare(res, 2);
                } else {
                    client.query(
                        "SELECT MIN(pret) AS min_price, MAX(pret) AS max_price FROM recipes", function (err, rezPret) {
                            if (err) {
                                console.log(err);
                                afisareEroare(res, 2);
                            } else {
                                client.query(
                                    "SELECT distinct(unnest(ingrediente)) FROM recipes", function (err, rezIngrediente) {
                                        if (err) {
                                            console.log(err);
                                            afisareEroare(res, 2);
                                        } else {
                                            client.query(
                                                "SELECT * FROM unnest(enum_range(null::tara_origine))", function (err, rezTara) {
                                                    if (err) {
                                                        console.log(err);
                                                        afisareEroare(res, 2);
                                                    } else {
                                                        res.render("pagini/produse", {
                                                            produse: rez.rows,
                                                            optiuni: rezCategorie.rows,
                                                            minPrice: rezPret.rows[0].min_price,
                                                            maxPrice: rezPret.rows[0].max_price,
                                                            ingrediente: rezIngrediente.rows.map((row) => row.unnest),
                                                            tariOrigine: rezTara.rows,
                                                        });
                                                    }
                                                }
                                            );
                                        }
                                    }
                                );
                            }
                        }
                    );
                }
            });
        }
    });
});

// app.get("/produs/:id", function(req, res){
//     client.query(`select * from prajituri where id=${req.params.id}`, function(err,rez){ //de pus tabel recipes
//         if(err){
//             console.log(err);
//             afisareEroare(res,2);
//         } else{
//             res.render("pagini/produs", {prod: rez.rows[0]} )
//         }
//     })
// })

app.get("/produs/:id", function(req, res){
    client.query(`SELECT * FROM recipes WHERE id=${req.params.id}`, function(err, rezultat){ 
        if(err){
            console.log(err);
            afisareEroare(res, 2);
        } else{
            if (rezultat.rows.length > 0) { 
                res.render("pagini/produs", {prod: rezultat.rows[0]} );
            } else {
                afisareEroare(res, 404, "Produsul nu a fost găsit", "Produsul cu ID-ul specificat nu există în baza de date.");
            }
        }
    });
});


//-------------------------- Utilizatori ------------------------
app.post("/inregistrare",function(req, res){
    var username;
    var poza;
    var formular= new formidable.IncomingForm()
    formular.parse(req, function(err, campuriText, campuriFisier ){//4
        console.log("Inregistrare:",campuriText);


        console.log(campuriFisier);
        console.log(poza, username);
        var eroare="";


        // var utilizNou = creare utilizator
        var utilizNou = new Utilizator()
        try{
            utilizNou.setareNume=campuriText.nume[0];
            utilizNou.setareUsername=campuriText.username[0];
            utilizNou.email=campuriText.email[0]
            utilizNou.prenume=campuriText.prenume[0]
           
            utilizNou.parola=campuriText.parola[0];
            utilizNou.culoare_chat=campuriText.culoare_chat[0];
            utilizNou.poza= poza[0];
            Utilizator.getUtilizDupaUsername(campuriText.username, {}, function(u, parametru ,eroareUser ){
                if (eroareUser==-1){//nu exista username-ul in BD
                    //TO DO salveaza utilizator
                    utilizNou.salvareUtilizator()
                }
                else{
                    eroare+="Mai exista username-ul";
                }


                if(!eroare){
                    res.render("pagini/inregistrare", {raspuns:"Inregistrare cu succes!"})
                   
                }
                else
                    res.render("pagini/inregistrare", {err: "Eroare: "+eroare});
            })
           


        }
        catch(e){
            console.log(e);
            eroare+= "Eroare site; reveniti mai tarziu";
            console.log(eroare);
            res.render("pagini/inregistrare", {err: "Eroare: "+eroare})
        }
   






    });
    formular.on("field", function(nume,val){  // 1
   
        console.log(`--- ${nume}=${val}`);
       
        if(nume=="username")
            username=val;
    })
    formular.on("fileBegin", function(nume,fisier){ //2
        console.log("fileBegin");
       
        console.log(nume,fisier);
        //TO DO adaugam folderul poze_uploadate ca static si sa fie creat de aplicatie
        //TO DO in folderul poze_uploadate facem folder cu numele utilizatorului (variabila folderUser)
        var folderUser = path.join(__dirname, "poze_uploadate", username)

        if(!fs.existsSync(folderUser))
            fs.mkdirSync(folderUser);
       
        fisier.filepath=path.join(folderUser, fisier.originalFilename)
        poza=fisier.originalFilename;
        //fisier.filepath=folderUser+"/"+fisier.originalFilename
        console.log("fileBegin:",poza)
        console.log("fileBegin, fisier:",fisier)


    })    
    formular.on("file", function(nume,fisier){//3
        console.log("file");
        console.log(nume,fisier);
    });
});

app.post("/login",function(req, res){
    /*TO DO
        testam daca a confirmat mailul
    */
    var username;
    console.log("ceva");
    var formular= new formidable.IncomingForm()
    

    formular.parse(req, function(err, campuriText, campuriFisier ){
        var parametriCallback= {
            req:req,
            res:res,
            parola: campuriText.parola[0]
        }
        Utilizator.getUtilizDupaUsername (campuriText.username[0],parametriCallback, 
            function(u, obparam, eroare ){ //proceseazaUtiliz
            let parolaCriptata=Utilizator.criptareParola(obparam.parola)
            if(u.parola== parolaCriptata && u.confirmat_mail){
                u.poza=u.poza?path.join("poze_uploadate",u.username, u.poza):"";
                obparam.req.session.utilizator=u;               
                obparam.req.session.mesajLogin="Bravo! Te-ai logat!";
                obparam.res.redirect("/index");
                
            }
            else{
                console.log("Eroare logare")
                obparam.req.session.mesajLogin="Date logare incorecte sau nu a fost confirmat mailul!";
                obparam.res.redirect("/index");
            }
        })
    });
    
});
// app.post("/login",function(req, res){
//     var username;
//     console.log("ceva");
//     var formular= new formidable.IncomingForm()
    
    
//     formular.parse(req, function(err, campuriText, campuriFisier ){
//         var parametriCallback= {
//             req:req,
//             res:res,
//             parola:campuriText.parola
//         }

//         Utilizator.getUtilizDupaUsername (campuriText.username[0],parametriCallback, 
//             function(u, obparam ){ //proceseazaUtiliz
//                 let parolaCriptata = Utilizator.criptareParola(obparam.parola)
            
//             if(u.parola == parolaCriptata){
//                 u.poza=u.poza?path.join("poze_uploadate",u.username, u.poza):"";
//                 obparam.req.session.utilizator=u;               
//                 obparam.req.session.mesajLogin="Bravo! Te-ai logat!";
//                 obparam.res.redirect("/index");
                
//             }
//             else{
//                 console.log("Eroare logare")
//                 obparam.req.session.mesajLogin="Date logare incorecte sau nu a fost confirmat mailul!";
//                 obparam.res.redirect("/index");
//             }
//         })
//     });
// });



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