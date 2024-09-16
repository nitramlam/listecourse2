const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
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

    const database = client.db('shopping_db');
    const collection = database.collection('shopping_list');

    // Afficher la liste des courses
    app.get('/', async (req, res) => {
      const items = await collection.find({}).toArray();
      res.render('index', { items });
    });

    // Ajouter un nouvel article
    app.post('/add', async (req, res) => {
      const newItem = {
        item: req.body.item,
        quantity: parseInt(req.body.quantity),
        price: parseFloat(req.body.price),
        category: req.body.category
      };
      await collection.insertOne(newItem);
      res.redirect('/');
    });

    // Augmenter la quantité
    app.post('/increase/:id', async (req, res) => {
      const itemId = req.params.id;
      await collection.updateOne(
        { _id: new ObjectId(itemId) },
        { $inc: { quantity: 1 } }
      );
      res.redirect('/');
    });

    // Diminuer la quantité
    app.post('/decrease/:id', async (req, res) => {
      const itemId = req.params.id;
      const item = await collection.findOne({ _id: new ObjectId(itemId) });

      if (item.quantity > 0) {
        await collection.updateOne(
          { _id: new ObjectId(itemId) },
          { $inc: { quantity: -1 } }
        );
      }
      res.redirect('/');
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