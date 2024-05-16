DROP TYPE IF EXISTS categorie;
DROP TYPE IF EXISTS tara_origine;
DROP TYPE IF EXISTS dificultate_desert;

CREATE TYPE categorie AS ENUM( 'cake', 'tart', 'creme', 'biscuit', 'other','common');
CREATE TYPE tara_origine AS ENUM('USA', 'France', 'Mexico', 'Italy', 'Turkey', 'Austria', 'other', 'unknown');
CREATE TYPE dificultate_desert AS ENUM('simple', 'medium', 'hard');

CREATE TABLE IF NOT EXISTS recipes (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   imagine VARCHAR(300),
   category categorie DEFAULT 'common',
   country tara_origine DEFAULT 'unknown',
   pret NUMERIC(8,2) NOT NULL,
   gramaj INT NOT NULL CHECK (gramaj>=0),   
   data_adaugare TIMESTAMP DEFAULT current_timestamp,
   dificultate dificultate_desert,--caracteristica care poate sa aiba doar o singura valoare pentru o entitate (dint-un set de valori
   ingrediente VARCHAR [],
   de_post BOOLEAN NOT NULL DEFAULT FALSE
);

INSERT into recipes(nume, descriere, imagine, category, country, pret, gramaj, dificultate, ingrediente, de_post) VALUES
    ('Tarte Tatin', 'Un desert tradițional francez, constând din mere caramelizate pe o crustă de aluat de foietaj.', 'tarte_tatin.jpg', 'tart', 'France', 29.99, 400, 'medium', '{"mere","unt","zahăr","aluat de foietaj"}', FALSE),
    ('Millefeuille', 'Un desert elegant și rafinat compus din straturi subțiri de aluat puff, cremă de vanilie și glazură de ciocolată.', 'millefeuille.jpg', 'tart', 'France', 36.50, 350, 'hard', '{"aluat puff","lapte","zahăr","ouă","făină","vanilie","ciocolată"}', FALSE),
    ('Macarons', 'Delicioasele dulciuri frantuzești, formate din două bezele de migdale legate împreună cu cremă.', 'macarons.jpg', 'biscuit', 'France', 27.50, 200, 'hard', '{"migdale măcinate","zahăr pudră","albușuri de ou","cremă de unt","coloranți alimentari"}', TRUE),
    ('Religieuse', 'O prăjitură tradițională franceză compusă din două éclairs mari, umplute cu cremă și acoperite cu glazură.', 'religieuse.jpg', 'creme', 'France', 25.99, 300, 'medium', '{"aluat de choux","smântână","făină","zahăr","ouă","ciocolată"}', FALSE),
    ('Saint Honoré', 'Un desert francez clasic, constând dintr-o crustă de foi de patiserie, împreună cu choux umplut cu cremă și glazură de caramel.', 'saint_honore.jpg', 'cake', 'France', 39.99, 500, 'hard', '{"foi de patiserie","choux","smântână","făină","zahăr","ouă","caramel"}', FALSE),
    ('Éclair', 'Un desert clasic francez, constând dintr-un choux umplut cu cremă și acoperit cu glazură.', 'eclair.jpg', 'creme', 'France', 21.50, 150, 'medium', '{"aluat de choux","smântână","făină","zahăr","ouă"}', FALSE),
    ('Opera Cake', 'Un desert sofisticat compus din foi de biscuit Joconde, cremă de unt de cafea și ganache de ciocolată.', 'opera_cake.jpg', 'cake', 'France', 42.99, 450, 'hard', '{"făină de migdale","zahăr pudră","ouă","făină","zahăr","cafea","ciocolată"}', FALSE),
    ('Mousse au Chocolat', 'O mousse fină și aerată cu gust intens de ciocolată.', 'mousse_chocolat.jpg', 'creme', 'France', 18.99, 200, 'simple', '{"ciocolată","ouă","smântână","zahăr"}', TRUE),
    ('Tarte au Citron', 'Un desert răcoritor cu o crustă de tartă fragedă și umplutură de lămâie dulce-acrișoară.', 'tarte_citron.jpg', 'tart', 'France', 32.50, 350, 'medium', '{"făină","unt","zahăr","ouă","lămâie"}', FALSE),
    ('Pain au Chocolat', 'Un mic dejun francez clasic, constând din foi de aluat crescut, umplute cu ciocolată.', 'pain_chocolat.jpg', 'other', 'France', 14.50, 120, 'medium', '{"făină","unt","zahăr","drojdie","ciocolată"}', FALSE),

    ('Tres Leches Cake', 'Un desert mexican clasic, constând dintr-o prăjitură înmuiată în trei tipuri de lapte și acoperită cu frișcă.', 'tres_leches_cake.jpg', 'cake', 'Mexico', 34.99, 400, 'medium', '{"făină","lapte","zahăr","ouă","vanilie","frișcă"}', FALSE),
    ('Churros', 'Delicioasele gogoși mexicane prăjite și acoperite cu zahăr și scorțișoară.', 'churros.jpg', 'other', 'Mexico', 12.50, 200, 'medium', '{"făină","apă","unt","zahăr","ouă","scorțișoară"}', TRUE),
    ('Pastel de Elote', 'O prăjitură mexicană tradițională din porumb, dulce și aromată.', 'pastel_elote.jpg', 'cake', 'Mexico', 28.50, 350, 'medium', '{"porumb","zahăr","ouă","unt","lapte","coajă de lămâie"}', FALSE),
    ('Arroz con Leche', 'Un orez dulce și cremos, fiert în lapte și aromat cu scorțișoară și vanilie.', 'arroz_leche.jpg', 'other', 'Mexico', 16.99, 250, 'simple', '{"orez","lapte","zahăr","scorțișoară","vanilie"}', TRUE),
    ('Capirotada', 'Un desert mexican tradițional, similar cu un budinca de pâine, făcută cu pâine uscată, nuci și fructe uscate.', 'capirotada.jpg', 'other', 'Mexico', 22.99, 300, 'medium', '{"pâine","lapte","zahăr","nuci","stafide","scorțișoară"}', FALSE),

    ('Baklava', 'O delicioasă prăjitură tradițională din bucătăria turcă, compusă din foi subțiri de aluat, nuci și sirop de miere.', 'baklava.jpg', 'other', 'Turkey', 29.99, 400, 'hard', '{"foi de aluat filo","nuci","miere","unt","scorțișoară"}', FALSE),
    ('Sacher Cake', 'Un desert austriac celebru, constând dintr-o prăjitură cu ciocolată densă, umplută cu gem de caise și acoperită cu glazură de ciocolată.', 'sacher_cake.jpg', 'cake', 'Austria', 38.50, 450, 'hard', '{"făină","ciocolată","zahăr","ouă","gem de caise"}', FALSE),

    ('Tiramisu', 'Un desert italian clasic, compus din straturi de biscuiți Savoiardi înmuiați în cafea și umpluți cu cremă de mascarpone.', 'tiramisu_italian.jpg', 'creme', 'Italy', 35.99, 400, 'medium', '{"biscuiți Savoiardi","cafea","mascarpone","ouă","zahăr"}', FALSE),
    ('Cannoli', 'Delicioasele tuburi crocante de aluat umplute cu cremă de ricotta dulce.', 'cannoli_italian.jpg', 'other', 'Italy', 28.50, 300, 'medium', '{"făină","unt","zahăr","ouă","ricotta","ciocolată","coajă de portocală"}', FALSE),
    ('Panna Cotta', 'Un desert italian răcoros și cremos, preparat din smântână, zahăr și gelatină și servit cu sos de fructe.', 'panna_cotta_italian.jpg', 'creme', 'Italy', 24.99, 250, 'simple', '{"smântână","zahăr","gelatină","vanilie","sos de fructe"}', TRUE),
    ('Torta della Nonna', 'O prăjitură de casă italienească, cu un strat bogat de cremă de vanilie și fistic, acoperită cu migdale crocante.', 'torta_della_nonna_italian.jpg', 'cake', 'Italy', 42.50, 500, 'medium', '{"făină","zahăr","ouă","unt","lapte","vanilie","fistic","migdale"}', FALSE),
    ('Crostata di Frutta', 'O tarta simplă și delicioasă cu fructe proaspete de sezon, pe un strat de cremă de vanilie.', 'crostata_di_frutta_italian.jpg', 'tart', 'Italy', 32.50, 450, 'medium', '{"făină","unt","zahăr","ouă","vanilie","fructe proaspete"}', FALSE),

    ('Gulab Jamun', 'A popular dessert from India, made with fried dough balls soaked in sugar syrup, flavored with cardamom and rose water.', 'gulab_jamun.jpg', 'other', 'other', 21.50, 300, 'hard', '{"milk powder","flour","sugar","cardamom","rose water","ghee"}', FALSE),
    ('Pavlova', 'A meringue-based dessert from Australia/New Zealand, topped with whipped cream and fresh fruit.', 'pavlova.jpg', 'other', 'other', 25.99, 300, 'medium', '{"egg whites","sugar","cornstarch","white vinegar","whipped cream","fruit"}', TRUE);
