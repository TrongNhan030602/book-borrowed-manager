import createApiClient from "./api.service";

class AuthService {
  constructor(baseUrl = "/auth") {
    this.api = createApiClient(baseUrl);
  }

  async login(data) {
    return (await this.api.post("/login", data)).data;
  }
  async logout(data) {
    return (await this.api.post("/logout", data)).data;
  }
  async register(data) {
    return (await this.api.post("/register", data)).data;
  }

  async checkAdmin() {
    return (await this.api.get("/checkadmin")).data;
  }
}
export default AuthService;
