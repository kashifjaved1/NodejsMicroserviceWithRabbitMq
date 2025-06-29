import ClientRepository from '../database/repository/client-repository';

class ClientService {

    repository:ClientRepository;

    constructor() {
        this.repository = new ClientRepository();
    }

    GetClients = async () => {
        const clients = await this.repository.GetClients();
        return clients;
    }
}

export default ClientService;