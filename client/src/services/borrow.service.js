import createApiClient from "./api.service";

class BorrowService {
  constructor(baseUrl = "/borrows") {
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
  async returnBook(borrowId) {
    return (await this.api.post(`/${borrowId}/return`)).data;
  }

  // Thêm hàm để lấy danh sách sách mà một người đọc đã mượn
  async getBorrowedBooksByReaderId(readerId) {
    return (await this.api.get(`/reader/${readerId}`)).data;
  }

  // Thêm hàm để lấy danh sách phiếu mượn mà một người đọc đã thực hiện
  async getAllBorrowingsByReaderId(readerId) {
    return (await this.api.get(`/borrowings/${readerId}`)).data;
  }
}
export default new BorrowService();
