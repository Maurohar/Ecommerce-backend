
import { promises as fs } from 'fs';

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
  constructor(path) {
    this.products = [];
    this.path = './products.json';
  }

  async leerProductos() {
    try {
      const contenido = await fs.readFile(this.path, 'utf8');
      const productos = JSON.parse(contenido);
      this.products = productos;
      return productos;
    } catch (error) {
      console.error('Error al leer products.json:', error);
      return [];
    }
  }

  async guardarProductos() {
    try {
      const contenido = JSON.stringify(this.products, null, 2);
      await fs.writeFile(this.path, contenido, 'utf8');
      console.log('Datos guardados en products.json');
    } catch (error) {
      console.error('Error al guardar datos en products.json:', error);
    }
  }

  generateIncrementalId() {
    return (this.products ? this.products.length : 0);
  }

  addProduct(product) {
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      console.log("al producto le falta info");
      return;
    }
    if (this.getProductByCode(product.code)) {
      console.log("producto repetido");
      return;
    }
    product.id = this.generateIncrementalId();
    this.products.push(product);
    this.guardarProductos();
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
