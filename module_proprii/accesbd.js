/*

ATENTIE!
inca nu am implementat protectia contra SQL injection
*/

const {Client, Pool}=require("pg");


class AccesBD{
    static #instanta=null; //o proprietate statică numită instanta, care va conține unica instanță a clasei (Inițial are valoarea null)
    static #initializat=false; // Indicator dacă clasa a fost inițializată

    constructor() { 
        if(AccesBD.#instanta){ //un constructor care va arunca o eroare dacă deja a fost instanțiată clasa.
            throw new Error("Deja a fost instantiat");
        }
        else if(!AccesBD.#initializat){ // Constructor care aruncă o eroare dacă clasa nu a fost inițializată corect
            throw new Error("Trebuie apelat doar din getInstanta; fara sa fi aruncat vreo eroare");
        }
    }

    // Inițializează conexiunea locală la baza de date
    initLocal(){ //una sau mai multe metode de inițializare a bazei de date prin care se oferă datele de autentificare (utilizator, parola, baza de date, port). Aceste metode vor salva în proprietatea client obiectul corespunzător conexiunii prin care se realizează cererile către baza de date.
        this.client= new Client({
            database:"recipe_website",
            user:"mirela", 
            password:"mirela", 
            host:"localhost", 
            port:5432});
        // this.client2= new Pool({database:"laborator",
        //         user:"irina", 
        //         password:"irina", 
        //         host:"localhost", 
        //         port:5432});
        this.client.connect();
    }

    // Returnează clientul de bază de date
    getClient(){// Se va scrie și un getter pentru client
        if(!AccesBD.#instanta ){
            throw new Error("Nu a fost instantiata clasa");
        }
        return this.client;
    }

    /**
     * @typedef {object} ObiectConexiune - obiect primit de functiile care realizeaza un query
     * @property {string} init - tipul de conexiune ("init", "render" etc.)
     * 
    * /

    /**
     * Returneaza instanta unica a clasei
     *
     * @param {ObiectConexiune} init - un obiect cu datele pentru query
     * @returns {AccesBD}
    */


    //o metodă getInstanta() care creează o instanță, dacă nu a fost deja creată, și o atribuie variabilei statice instanta. 
    //în această metodă se va ințializa și conexiunea la baza de date. Metoda va returna o referință către instanță.
    static getInstanta({init="local"}={}){
        console.log(this);//this-ul e clasa nu instanta pt ca metoda statica
        if(!this.#instanta){ //daca nu exista instanta
            this.#initializat=true; //o initializam
            this.#instanta=new AccesBD(); //creem inmstanta

            //initializarea poate arunca erori
            //vom adauga aici cazurile de initializare 
            //pentru baza de date cu care vrem sa lucram
            try{
                switch(init){
                    case "local": this.#instanta.initLocal(); //face conexiunea la baza de date
                }
                //daca ajunge aici inseamna ca nu s-a produs eroare la initializare
                
            }
            catch (e){
                console.error("Eroare la initializarea bazei de date!");
            }

        }
        return this.#instanta;
    }




    /**
     * @typedef {object} ObiectQuerySelect - obiect primit de functiile care realizeaza un query
     * @property {string} tabel - numele tabelului
     * @property {string []} campuri - o lista de stringuri cu numele coloanelor afectate de query; poate cuprinde si elementul "*"
     * @property {string[]} conditiiAnd - lista de stringuri cu conditii pentru where
    */


    
    /**
     * callback pentru queryuri.
     * @callback QueryCallBack
     * @param {Error} err Eventuala eroare in urma queryului
     * @param {Object} rez Rezultatul query-ului
    */
    /**
     * Selecteaza inregistrari din baza de date
     *
     * @param {ObiectQuerySelect} obj - un obiect cu datele pentru query
     * @param {function} callback - o functie callback cu 2 parametri: eroare si rezultatul queryului
    */

    // Metoda pentru executarea unui query de SELECT
    select({tabel="",campuri=[],conditiiAnd=[]} = {}, callback, parametriQuery=[]){
        let conditieWhere="";
        if(conditiiAnd.length>0)
            conditieWhere=`where ${conditiiAnd.join(" and ")}`; 
        let comanda=`select ${campuri.join(",")} from ${tabel} ${conditieWhere}`;
        console.error(comanda);
        /*
        comanda=`select id, camp1, camp2 from tabel where camp1=$1 and camp2=$2;
        this.client.query(comanda,[val1, val2],callback)

        */
        this.client.query(comanda,parametriQuery, callback)
    }

    // Metoda asincronă pentru executarea unui query SELECT
    async selectAsync({tabel="",campuri=[],conditiiAnd=[]} = {}){
        let conditieWhere="";
        if(conditiiAnd.length>0)
            conditieWhere=`where ${conditiiAnd.join(" and ")}`;
        
        let comanda=`select ${campuri.join(",")} from ${tabel} ${conditieWhere}`;
        console.error("selectAsync:",comanda);
        try{
            let rez=await this.client.query(comanda);
            console.log("selectasync: ",rez);
            return rez;
        }
        catch (e){
            console.log(e);
            return null;
        }
    }

    // Metoda pentru inserarea unei înregistrări în baza de date
    insert({tabel="",campuri={}} = {}, callback){
                /*
        campuri={
            nume:"savarina",
            pret: 10,
            calorii:500
        }
        */
        console.log("-------------------------------------------")
        console.log(Object.keys(campuri).join(","));
        console.log(Object.values(campuri).join(","));
        let comanda=`insert into ${tabel}(${Object.keys(campuri).join(",")}) values ( ${Object.values(campuri).map((x) => `'${x}'`).join(",")})`;
        console.log(comanda);
        this.client.query(comanda,callback)
    }

     /**
     * @typedef {object} ObiectQuerySelect - obiect primit de functiile care realizeaza un query
     * @property {string} tabel - numele tabelului
     * @property {string []} campuri - o lista de stringuri cu numele coloanelor afectate de query; poate cuprinde si elementul "*"
     * @property {string[]} conditiiAnd - lista de stringuri cu conditii pentru where
     */   
    // update({tabel="",campuri=[],valori=[], conditiiAnd=[]} = {}, callback, parametriQuery){
    //     if(campuri.length!=valori.length)
    //         throw new Error("Numarul de campuri difera de nr de valori")
    //     let campuriActualizate=[];
    //     for(let i=0;i<campuri.length;i++)
    //         campuriActualizate.push(`${campuri[i]}='${valori[i]}'`);
    //     let conditieWhere="";
    //     if(conditiiAnd.length>0)
    //         conditieWhere=`where ${conditiiAnd.join(" and ")}`;
    //     let comanda=`update ${tabel} set ${campuriActualizate.join(", ")}  ${conditieWhere}`;
    //     console.log(comanda);
    //     this.client.query(comanda,callback)
    // }

    // Metoda pentru actualizarea unei înregistrări în baza de date
    update({tabel="",campuri={}, conditiiAnd=[]} = {}, callback, parametriQuery){
        let campuriActualizate=[];
        for(let prop in campuri)
            campuriActualizate.push(`${prop}='${campuri[prop]}'`);
        let conditieWhere="";
        if(conditiiAnd.length>0)
            conditieWhere=`where ${conditiiAnd.join(" and ")}`;
        let comanda=`update ${tabel} set ${campuriActualizate.join(", ")}  ${conditieWhere}`;
        console.log(comanda);
        this.client.query(comanda,callback)
    }

    // Metoda pentru actualizarea parametrizată a unei înregistrări în baza de date
    updateParametrizat({tabel="",campuri=[],valori=[], conditiiAnd=[]} = {}, callback, parametriQuery){
        if(campuri.length!=valori.length)
            throw new Error("Numarul de campuri difera de nr de valori")
        let campuriActualizate=[];
        for(let i=0;i<campuri.length;i++)
            campuriActualizate.push(`${campuri[i]}=$${i+1}`);
        let conditieWhere="";
        if(conditiiAnd.length>0)
            conditieWhere=`where ${conditiiAnd.join(" and ")}`;
        let comanda=`update ${tabel} set ${campuriActualizate.join(", ")}  ${conditieWhere}`;
        console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1111",comanda);
        this.client.query(comanda,valori, callback)
    }


    //TO DO
    // updateParametrizat({tabel="",campuri={}, conditiiAnd=[]} = {}, callback, parametriQuery){
    //     let campuriActualizate=[];
    //     for(let prop in campuri)
    //         campuriActualizate.push(`${prop}='${campuri[prop]}'`);
    //     let conditieWhere="";
    //     if(conditiiAnd.length>0)
    //         conditieWhere=`where ${conditiiAnd.join(" and ")}`;
    //     let comanda=`update ${tabel} set ${campuriActualizate.join(", ")}  ${conditieWhere}`;
    //     this.client.query(comanda,valori, callback)
    // }

    // Metoda pentru ștergerea unei înregistrări din baza de date
    delete({tabel="",conditiiAnd=[]} = {}, callback){
        let conditieWhere="";
        if(conditiiAnd.length>0)
            conditieWhere=`where ${conditiiAnd.join(" and ")}`;
        
        let comanda=`delete from ${tabel} ${conditieWhere}`;
        console.log(comanda);
        this.client.query(comanda,callback)
    }

    // Metoda pentru execuția unui query arbitrar
    query(comanda, callback){
        this.client.query(comanda,callback);
    }

}

module.exports=AccesBD;