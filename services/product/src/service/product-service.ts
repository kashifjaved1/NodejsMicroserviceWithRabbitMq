import ProductRepository from '../database/repository/product-repository';

class ProductService {

    repository:ProductRepository;

    constructor() {
        this.repository = new ProductRepository();
    }

    GetProducts = async () => {
        const products = await this.repository.GetProducts();
        return products;
    }

}

export default ProductService;