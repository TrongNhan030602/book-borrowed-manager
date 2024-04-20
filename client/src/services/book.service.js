import createApiClient from "./api.service";

class BookService {
  constructor(baseUrl = "/books") {
    this.api = createApiClient(baseUrl);
  }

  async create(data) {
    return (await this.api.post("/", data)).data;
  }
  async get(id) {
    return (await this.api.get(`/${id}`)).data;
  }
  async getAll() {
    return (await this.api.get("/")).data;
  }
  async update(id, data) {
    return (await this.api.put(`/${id}`, data)).data;
  }
  async delete(id) {
    return (await this.api.delete(`/${id}`)).data;
  }
  async deleteAll() {
    return (await this.api.delete("/")).data;
  }
}
export default new BookService();
