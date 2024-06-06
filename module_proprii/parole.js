/**
 * Vector care conține intervalele de coduri ASCII pentru cifre, litere mari și litere mici.
 * @type {number[][]}
 */
let v_intervale = [[48, 57], [65, 90], [97, 122]];

/**
 * Șir care conține toate caracterele alfanumerice generate din intervalele ASCII.
 * @type {string}
 */
let sirAlphaNum = "";
for (let interval of v_intervale) {
    for (let i = interval[0]; i <= interval[1]; i++) {
        sirAlphaNum += String.fromCharCode(i);
    }
}

console.log(sirAlphaNum);

/**
 * Generează un token alfanumeric de lungime specificată.
 * @param {number} n - Lungimea tokenului de generat.
 * @returns {string} - Tokenul generat.
 */
function genereazaToken(n) {
    let token = "";
    for (let i = 0; i < n; i++) {
        token += sirAlphaNum[Math.floor(Math.random() * sirAlphaNum.length)];
    }
    return token;
}

module.exports.genereazaToken = genereazaToken;
