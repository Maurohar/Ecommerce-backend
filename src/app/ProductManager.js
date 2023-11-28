import { MongoClient } from 'mongodb';

class Product {
  constructor(title, description, price, thumbnail, code, stock) {
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}

class ProductManager {
  constructor(databaseURL, databaseName, collectionName) {
    this.products = [];
    this.databaseURL = databaseURL;
    this.databaseName = databaseName;
    this.collectionName = collectionName;
  }

  async connectToDatabase() {
    try {
      const client = new MongoClient(this.databaseURL, { useNewUrlParser: true, useUnifiedTopology: true });
      await client.connect();
      this.database = client.db(this.databaseName);
      this.collection = this.database.collection(this.collectionName);
      console.log('Conexión exitosa a la base de datos.');
    } catch (error) {
      console.error('Error al conectar a la base de datos:', error);
    }
  }

  async addProduct(product) {
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      console.log("El producto tiene información incompleta.");
      return;
    }

    if (await this.getProductByCode(product.code)) {
      console.log("Producto con código repetido.");
      return;
    }

    try {
      const result = await this.collection.insertOne(product);
      console.log(`Producto agregado con ID: ${result.insertedId}`);
    } catch (error) {
      console.error('Error al agregar el producto a la base de datos:', error);
    }
  }

  async removeProductByCode(code) {
    try {
      const result = await this.collection.deleteOne({ code: code });

      if (result.deletedCount === 1) {
        console.log(`Producto con código ${code} eliminado exitosamente.`);
        return true;
      } else {
        console.log(`No se encontró un producto con código ${code}.`);
        return false;
      }
    } catch (error) {
      console.error('Error al eliminar el producto de la base de datos:', error);
      return false;
    }
  }

  async getProductByCode(code) {
    try {
      const product = await this.collection.findOne({ code: code });
      return product;
    } catch (error) {
      console.error('Error al obtener el producto de la base de datos:', error);
      return null;
    }
  }

  removeProductById(id) {
    console.log(id);
    const indexToRemove = this.products.findIndex(product => product.id === id);

    if (indexToRemove !== -1) {
      this.products.splice(indexToRemove, 1);
      return true;
    } else {
      return false;
    }
  }

  removeProductByCode(code) {
    const indexToRemove = this.products.findIndex(product => product.code === code);

    if (indexToRemove !== -1) {
      this.products.splice(indexToRemove, 1);

      return true;
    } else {
      return false;
    }
  }

  getProductByCode(code) {
    return this.products.find(product => product.code === code);
  }

  getProductById(id) {
    let filteredProducts = this.products.find(product => product.id === id);
    if (!filteredProducts || filteredProducts.length == 0) {
      console.log("Not Found");
    }
    return filteredProducts;
  }

  updatedProductById(id, updatedProduct) {
    const index = this.products.findIndex(product => product.id === id);

    if (index !== -1) {
      const editedProduct = { ...this.products[index], ...updatedProduct };
      this.products[index] = editedProduct;
      console.log(`Producto con id ${id} editado exitosamente.`);
    } else {
      console.log(`No se encontró un producto con id ${id}.`);
    }
  } 
  getAllProducts() {
    return this.products;
  }
}

export default ProductManager;

