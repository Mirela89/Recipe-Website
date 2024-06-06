const Drepturi = require('./drepturi.js');

/**
 * Clasa Rol reprezintă rolul de bază pentru utilizatori.
 * @class
 */
class Rol {
    /**
     * Tipul rolului.
     * @returns {string}
     */
    static get tip() {
        return "generic";
    }

    /**
     * Lista drepturilor asociate rolului.
     * @returns {Symbol[]}
     */
    static get drepturi() {
        return [];
    }

    /**
     * Constructor pentru clasa Rol.
     */
    constructor() {
        this.cod = this.constructor.tip; // Proprietatea publică cod care conține stringul corespunzător rolului.
    }

    /**
     * Verifică dacă rolul are un anumit drept.
     * @param {Symbol} drept - Dreptul de verificat.
     * @returns {boolean} - True dacă rolul are dreptul, altfel false.
     */
    areDreptul(drept) {
        console.log("in metoda rol!!!!");
        return this.constructor.drepturi.includes(drept);
    }
}

/**
 * Clasa RolAdmin reprezintă rolul de administrator al site-ului, care are toate drepturile.
 * @class
 * @extends Rol
 */
class RolAdmin extends Rol {
    /**
     * Tipul rolului.
     * @returns {string}
     */
    static get tip() {
        return "admin";
    }

    /**
     * Constructor pentru clasa RolAdmin.
     */
    constructor() {
        super();
    }

    /**
     * Verifică dacă rolul are un anumit drept (administratori au toate drepturile).
     * @returns {boolean} - Always true for administrators.
     */
    areDreptul() {
        return true;
    }
}

/**
 * Clasa RolModerator reprezintă rolul de moderator al site-ului, care are drepturi legate de utilizatori.
 * @class
 * @extends Rol
 */
class RolModerator extends Rol {
    /**
     * Tipul rolului.
     * @returns {string}
     */
    static get tip() {
        return "moderator";
    }

    /**
     * Lista drepturilor asociate rolului de moderator.
     * @returns {Symbol[]}
     */
    static get drepturi() {
        return [
            Drepturi.vizualizareUtilizatori,
            Drepturi.stergereUtilizatori
        ];
    }

    /**
     * Constructor pentru clasa RolModerator.
     */
    constructor() {
        super();
    }
}

/**
     * Clasa RolClient reprezintă rolul de client logat al site-ului.
     * @class
     * @extends Rol
     */
    class RolClient extends Rol {
    /**
     * Tipul rolului.
     * @returns {string}
     */
    static get tip() {
        return "comun";
    }

    /**
     * Lista drepturilor asociate rolului de client.
     * @returns {Symbol[]}
     */
    static get drepturi() {
        return [
            Drepturi.cumparareProduse
        ];
    }

    /**
     * Constructor pentru clasa RolClient.
     */
    constructor() {
        super();
    }
}

/**
 * Clasa RolFactory este responsabilă pentru crearea instanțelor de roluri.
 * @class
 */
class RolFactory {
    /**
     * Creează o instanță de rol în funcție de tipul specificat.
     * @param {string} tip - Tipul de rol care trebuie creat.
     * @returns {Rol} - Instanță a clasei corespunzătoare rolului.
     */
    static creeazaRol(tip) {
        switch (tip) {
            case RolAdmin.tip: return new RolAdmin();
            case RolModerator.tip: return new RolModerator();
            case RolClient.tip: return new RolClient();
            default: throw new Error("Tip de rol necunoscut");
        }
    }
}

module.exports = {
    RolFactory: RolFactory,
    RolAdmin: RolAdmin
};
