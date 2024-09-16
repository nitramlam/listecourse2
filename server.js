const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Configurer EJS et le middleware
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

// Connexion à MongoDB
async function main() {
  const uri = "mongodb+srv://nitramlam:456123Fx37!@listecourses.qkghn.mongodb.net/?retryWrites=true&w=majority";
  const client = new MongoClient(uri);

  try {
    // Connexion au client
    await client.connect();
    console.log("Connexion réussie à MongoDB");

    // Interagir avec la base de données
    const database = client.db('shopping_db');
    const collection = database.collection('shopping_list');

    // Endpoint pour voir la liste des courses dans une page web
    app.get('/', async (req, res) => {
      const courses = await collection.find({}).toArray();
      res.render('index', { items: courses });
    });

    // Endpoint pour voir les courses en JSON
    app.get('/courses', async (req, res) => {
      const courses = await collection.find({}).toArray();
      res.json(courses);
    });

    // Endpoint pour ajouter un nouvel élément dans la liste de courses
    app.post('/add', async (req, res) => {
      const newItem = {
        item: req.body.item,
        quantity: parseInt(req.body.quantity),
        price: parseFloat(req.body.price),
        category: req.body.category
      };
      
      try {
        await collection.insertOne(newItem);
        res.redirect('/');  // Rediriger vers la liste après ajout
      } catch (error) {
        res.status(500).send('Erreur lors de l\'ajout de l\'article');
      }
    });

  } catch (e) {
    console.error(e);
  }
}

main().catch(console.error);

// Lancer le serveur
app.listen(port, () => {
  console.log(`Serveur lancé sur http://localhost:${port}`);
});