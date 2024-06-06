const AccesBD=require('./accesbd.js');
const parole=require('./parole.js');

const {RolFactory}=require('./roluri.js');
const crypto=require("crypto");
const nodemailer=require("nodemailer");

/**
 * Clasa Utilizator reprezintă un utilizator în sistem.
 * @class
 */
class Utilizator{
    static tipConexiune="local";
    static tabel="utilizatori"
    static parolaCriptare="tehniciweb";
    static emailServer="dolcecrostata@gmail.com";
    static lungimeCod=64;
    static numeDomeniu="localhost:8080";
    #eroare;

    /**
     * Constructor pentru clasa Utilizator.
     * @param {Object} param0 - Obiect cu datele utilizatorului.
     * @param {number} param0.id - ID-ul utilizatorului.
     * @param {string} param0.username - Username-ul utilizatorului.
     * @param {string} param0.nume - Numele utilizatorului.
     * @param {string} param0.prenume - Prenumele utilizatorului.
     * @param {string} param0.email - Email-ul utilizatorului.
     * @param {string} param0.parola - Parola utilizatorului.
     * @param {Object} param0.rol - Rolul utilizatorului.
     * @param {string} [param0.culoare_chat="black"] - Culoarea chatului utilizatorului.
     * @param {string} [param0.poza] - Poza utilizatorului.
     */
    constructor({id, username, nume, prenume, email, parola, rol, culoare_chat="black", poza}={}) {
        this.id=id;

        //optional sa facem asta in constructor
        try{
        if(this.checkUsername(username))
            this.username = username;
        else throw new Error("Username incorrect");
        }
        catch(e){ this.#eroare=e.message}

        for(let prop in arguments[0]){
            this[prop]=arguments[0][prop]
        }
        if(this.rol)
            this.rol=this.rol.cod? RolFactory.creeazaRol(this.rol.cod):  RolFactory.creeazaRol(this.rol);
        console.log(this.rol);

        this.#eroare="";
    }

    /**
     * Verifică dacă numele este valid.
     * @param {string} nume - Numele de verificat.
     * @returns {boolean} - True dacă numele este valid, altfel false.
     */
    checkName(nume){
        return nume!="" && nume.match(new RegExp("^[A-Z][a-z]+$")) ;
    }

    /**
     * Setează numele utilizatorului după ce îl verifică.
     * @param {string} nume - Numele de setat.
     * @throws {Error} - Aruncă eroare dacă numele este greșit.
     */
    set setareNume(nume){
        if (this.checkName(nume)) this.nume=nume
        else{
            throw new Error("Nume gresit")
        }
    }

    /**
     * Setează username-ul utilizatorului după ce îl verifică.
     * @param {string} username - Username-ul de setat.
     * @throws {Error} - Aruncă eroare dacă username-ul este greșit.
     */
    set setareUsername(username){
        if (this.checkUsername(username)) this.username=username
        else{
            throw new Error("Username gresit")
        }
    }

    /**
     * Verifică dacă username-ul este valid.
     * @param {string} username - Username-ul de verificat.
     * @returns {boolean} - True dacă username-ul este valid, altfel false.
     */
    checkUsername(username){
        return username!="" && username.match(new RegExp("^[A-Za-z0-9#_./]+$")) ;
    }

    /**
     * Criptează parola utilizatorului.
     * @param {string} parola - Parola de criptat.
     * @returns {string} - Parola criptată.
     */
    static criptareParola(parola){
        return crypto.scryptSync(parola,Utilizator.parolaCriptare,Utilizator.lungimeCod).toString("hex");
    }

    /**
     * Înregistrează utilizatorul în baza de date.
     * @throws {Error} - Aruncă eroare dacă apare o problemă la inserare.
     */
    //înregistreaza utilizatorul. Dacă username-ul mai există, va arunca o eroare cu un text explicativ.
    salvareUtilizator(){
        let parolaCriptata=Utilizator.criptareParola(this.parola);
        let utiliz=this;
        let token=parole.genereazaToken(100);
        AccesBD.getInstanta(Utilizator.tipConexiune).insert({tabel:Utilizator.tabel,
            campuri:{
                username:this.username,
                nume: this.nume,
                prenume:this.prenume,
                parola:parolaCriptata,
                email:this.email,
                culoare_chat:this.culoare_chat,
                cod:token,
                poza:this.poza}
            }, function(err, rez){
            if(err)
                console.log(err);
            else
                utiliz.trimiteMail("Te-ai inregistrat cu succes","Username-ul tau este "+utiliz.username,
            `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${utiliz.username}.</p> <p><a href='http://${Utilizator.numeDomeniu}/cod/${utiliz.username}/${token}'>Click aici pentru confirmare</a></p>`,
            )
        });
    }
//xjxwhotvuuturmqm

    /**
     * Trimite un email utilizatorului.
     * @param {string} subiect - Subiectul emailului.
     * @param {string} mesajText - Textul emailului.
     * @param {string} mesajHtml - HTML-ul emailului.
     * @param {Array} [atasamente=[]] - Lista de atașamente.
     * @returns {Promise<void>} - O promisiune care se rezolvă când emailul este trimis.
     */
    //trimite un e-mail utilizatorului, cu subiectul și textul dat (atât ca plain text cât și ca HTML și o listă de atașamente
    async trimiteMail(subiect, mesajText, mesajHtml, atasamente=[]){
        var transp= nodemailer.createTransport({
            service: "gmail",
            secure: false,
            auth:{//date login 
                user:Utilizator.emailServer,
                pass:"lxhh eqhj prhw wvhl"
            },
            tls:{
                rejectUnauthorized:false
            }
        });
        //genereaza html
        await transp.sendMail({
            from:Utilizator.emailServer,
            to:this.email, //TO DO
            subject:subiect,//"Te-ai inregistrat cu succes",
            text:mesajText, //"Username-ul tau este "+username
            html: mesajHtml,// `<h1>Salut!</h1><p style='color:blue'>Username-ul tau este ${username}.</p> <p><a href='http://${numeDomeniu}/cod/${username}/${token}'>Click aici pentru confirmare</a></p>`,
            attachments: atasamente
        })
        console.log("trimis mail");
    }
   
    /**
     * Returnează obiectul de tip utilizator corespunzător username-ului dat.
     * @param {string} username - Username-ul utilizatorului.
     * @returns {Promise<Utilizator|null>} - Promisiune care rezolvă un obiect Utilizator sau null dacă nu găsește utilizatorul.
     */
    //returnează obiectul de tip utilizator corespunzător username-ului dat ca parametru. Returneaza null dacă nu gaseste un astfel de utilizator în tabel.
    static async getUtilizDupaUsernameAsync(username){
        if (!username) return null;
        try{
            let rezSelect= await AccesBD.getInstanta(Utilizator.tipConexiune).selectAsync(
                {tabel:"utilizatori",
                campuri:['*'],
                conditiiAnd:[`username='${username}'`]
            });
            if(rezSelect.rowCount!=0){
                return new Utilizator(rezSelect.rows[0])
            }
            else {
                console.log("getUtilizDupaUsernameAsync: Nu am gasit utilizatorul");
                return null;
            }
        }
        catch (e){
            console.log(e);
            return null;
        }
        
    }

    /**
     * Caută un utilizator după username.
     * @param {string} username - Username-ul utilizatorului.
     * @param {Object} obparam - Obiect cu parametrii suplimentari.
     * @param {Function} proceseazaUtiliz - Funcția callback pentru procesarea utilizatorului.
     */
    //caută un utilizator după username (dat ca parametru). Aceasta va mai primi și un obiect cu niște câmpuri setate si o funcție callback care va folosi acel obiect. De exemplu obiectul poate conține parola introdusă de utilizator la login, iar funcția callback verifică dacă parola corespunde username-ului dat.
    static getUtilizDupaUsername (username,obparam, proceseazaUtiliz){
        if (!username) return null;
        let eroare=null;
        AccesBD.getInstanta(Utilizator.tipConexiune).select({tabel:"utilizatori",campuri:['*'],conditiiAnd:[`username='${username}'`]}, function (err, rezSelect){
            if(err){
                console.error("Utilizator:", err);
                //throw new Error()
                eroare=-2;
            }
            else if(rezSelect.rowCount==0){
                eroare=-1;
            }
            //constructor({id, username, nume, prenume, email, rol, culoare_chat="black", poza}={})
            let u= new Utilizator(rezSelect.rows[0])
            proceseazaUtiliz(u, obparam, eroare);
        });
    }

    /**
     * Verifică dacă utilizatorul are un anumit drept.
     * @param {string} drept - Dreptul de verificat.
     * @returns {boolean} - True dacă utilizatorul are dreptul, altfel false.
     */
    //primește o valoare din drepturi.js și, în funcție de rolul utilizatorului, returnează true, dacă are acel drept și false dacă nu.
    areDreptul(drept){
        return this.rol.areDreptul(drept);
    }

    //----------functii adaugate-----------

    /**
     * Metodă pentru a modifica utilizatorul curent.
     * @param {Object} dateNoi - Obiect cu noile date ale utilizatorului.
     * @throws {Error} - Aruncă o eroare dacă utilizatorul nu există.
     */
    //O metodă modifica() care primește un obiect cu noile date ale utilizatorului și modifică înregistrarea din tabel corespunzătoare lui. 
    //Aruncă o eroare dacă utilizatorul nu există.
    modifica(dateNoi) {
        if (!this.username) {
            throw new Error("Utilizatorul nu exista");
        }

        //am construit ob de actualizare
        let campuriDeActualizat = {};
        for (let prop in dateNoi) {
            if (dateNoi[prop] !== undefined && prop !== 'id' && prop !== 'username') {
                campuriDeActualizat[prop] = dateNoi[prop];
            }
        }

        //actualizez in baza de date
        try {
            let instantaBD = AccesBD.getInstanta(Utilizator.tipConexiune);
            let rezUpdate = instantaBD.updateSync({
                tabel: Utilizator.tabel,
                campuri: campuriDeActualizat,
                conditiiAnd: [`username='${this.username}'`]
            });

            if (rezUpdate.rowCount === 0) {
                throw new Error("Utilizatorul nu a fost gasit :(");
            } else {
                // Actualizăm obiectul curent cu noile date
                for (let prop in campuriDeActualizat) {
                    this[prop] = campuriDeActualizat[prop];
                }
                console.log("Utilizator actualizat cu succes :)");
            }
        } catch (err) {
            console.error("Eroare la actualizarea utilizatorului:", err);
            throw err;
        }
    }

    /**
     * Șterge utilizatorul curent din baza de date.
     * @throws {Error} - Aruncă o eroare dacă utilizatorul nu există.
     */
    //O metodă sterge() care șterge din tabel utilizatorul curent și aruncă o eroare dacă acesta nu există.
    sterge() {
        if (!this.username) {
            throw new Error("Utilizatorul nu exista");
        }

        try {
            let instantaBD = AccesBD.getInstanta(Utilizator.tipConexiune);
            let rezDelete = instantaBD.deleteSync({
                tabel: Utilizator.tabel,
                conditiiAnd: [`username='${this.username}'`]
            });

            if (rezDelete.rowCount === 0) {
                throw new Error("Utilizatorul nu a fost gasit");
            } else {
                console.log("Utilizator sters cu succes.");
            }
        } catch (err) {
            console.error("Eroare la stergerea utilizatorului:", err);
            throw err;
        }
    }

    /**
     * Metodă statică sincronă pentru a căuta utilizatorii.
     * @param {Object} obParam - Obiect cu parametrii de căutare.
     * @param {Function} callback - Funcția callback pentru procesarea rezultatului.
     */
    //O metodă statică sincronă cauta(obParam,callback) care primește ca prim argument un obiect ale cărui proprietăți au aceleași nume cu cele ale instanțelor clasei Utilizator. 
    static cauta(obParam, callback) {
        let conditii = []; //conditiile de cautare
        for (let prop in obParam) {
            if (obParam[prop] !== undefined) {
                conditii.push(`${prop}='${obParam[prop]}'`); //Fiecare proprietate definită este adăugată la lista de condiții.
            }
        }

        //Dacă nu sunt specificate condiții, callback-ul este apelat cu un mesaj de eroare și o listă goală
        if (conditii.length === 0) {
            callback("Nu a fost specificat niciun criteriu de căutare.", []);
            return;
        }

        //Construim query-ul de selectare folosind condițiile construite
        let conditiiAnd = conditii.join(" AND ");

        try {
            let instantaBD = AccesBD.getInstanta(Utilizator.tipConexiune);
            let rezSelect = instantaBD.selectSync({//Folosim metoda sincronă selectSync de la AccesBD pentru a căuta utilizatorii care se potrivesc condițiilor
                tabel: Utilizator.tabel,
                campuri: ['*'],
                conditiiAnd: [conditiiAnd]
            });

            if (rezSelect.rowCount === 0) {//Dacă nu se găsesc utilizatori, callback-ul este apelat cu null și o listă goală.
                callback(null, []);
            } else {
                let listaUtiliz = rezSelect.rows.map(row => new Utilizator(row));
                callback(null, listaUtiliz); //Dacă se găsesc utilizatori, aceștia sunt transformați în instanțe ale clasei Utilizator și returnați prin callback.
            }
        } catch (err) {
            console.error("Eroare la căutarea utilizatorilor:", err);
            callback(err, []);
        }
    }

}
module.exports={Utilizator:Utilizator}