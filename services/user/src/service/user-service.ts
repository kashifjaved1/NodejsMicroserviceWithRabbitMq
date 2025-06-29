import UserRepository from '../database/repository/user-repository';

class UserService {

    // private readonly repository: UserRepository;
    repository: UserRepository;

    constructor() {
        this.repository = new UserRepository();
    }

    GetUsers = async () => {
        const users = await this.repository.GetUsers();
        return users;
    }

    RegisterUser = async (data: any) => {
        const result = await this.repository.AddUser(data);
        return result;
    }

    FetchUser = async(email: string, password: string) => {
        return await this.repository.GetUser(email, password);
    }
}

export default UserService;