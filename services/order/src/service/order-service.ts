import OrderRepository from '../database/repository/order-repository';

class OrderService {

    repository: OrderRepository;

    constructor() {
        this.repository = new OrderRepository();
    }

    GetOrders = async () => {
        const orders = await this.repository.GetOrders();
        return orders;
    }
}

export default OrderService;