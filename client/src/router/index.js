import { createWebHistory, createRouter } from "vue-router";
import Book from "@/views/books/Book.vue";
import Borrow from "@/views/borrows/Borrow.vue";
import Publisher from "@/views/publishers/Publisher.vue";
import Reader from "@/views/readers/Reader.vue";
import Admin from "@/views/admin/Admin.vue";
import Login from "@/views/auth/Login.vue";

const routes = [
  // Logins routes
  {
    path: "/",
    name: "book.login",
    component: Login,
  },
  // 404 Not Found routes
  {
    path: "/:pathMatch(.*)*",
    name: "notfound",
    component: () => import("@/views/NotFound.vue"),
  },
  // Books routes
  {
    path: "/books",
    name: "book",
    component: Book,
  },
  {
    path: "/books/:id",
    name: "book.edit",
    component: () => import("@/views/books/BookEdit.vue"),
    props: true, // Truyền các biến trong $route.params vào làm props
  },
  {
    path: "/books/add",
    name: "book.add",
    component: () => import("@/views/books/BookAdd.vue"),
  },
  // publisher routes
  {
    path: "/publishers",
    name: "publisher",
    component: Publisher,
  },
  {
    path: "/publishers/:id",
    name: "publisher.edit",
    component: () => import("@/views/publishers/PublisherEdit.vue"),
    props: true, // Truyền các biến trong $route.params vào làm props
  },
  {
    path: "/publishers/add",
    name: "publisher.add",
    component: () => import("@/views/publishers/PublisherAdd.vue"),
  },
  // reader routes
  {
    path: "/readers",
    name: "reader",
    component: Reader,
  },
  {
    path: "/readers/:id",
    name: "reader.edit",
    component: () => import("@/views/readers/ReaderEdit.vue"),
    props: true, // Truyền các biến trong $route.params vào làm props
  },
  {
    path: "/readers/add",
    name: "reader.add",
    component: () => import("@/views/readers/ReaderAdd.vue"),
  },
  // admin  routes
  {
    path: "/admin",
    name: "admin",
    component: Admin,
  },
  {
    path: "/admin/:id",
    name: "admin.edit",
    component: () => import("@/views/admin/AdminEdit.vue"),
    props: true, // Truyền các biến trong $route.params vào làm props
  },
  {
    path: "/admin/add",
    name: "admin.add",
    component: () => import("@/views/admin/AdminAdd.vue"),
  },
  // Borrow routes
  {
    path: "/borrows",
    name: "borrow",
    component: Borrow,
  },
  {
    path: "/borrows/:id",
    name: "borrow.edit",
    component: () => import("@/views/borrows/BorrowEdit.vue"),
    props: true, // Truyền các biến trong $route.params vào làm props
  },
  // Reader Borrow routes
  {
    path: "/borrow-book",
    name: "borrow.book",
    component: () => import("@/views/borrow-book/BookList.vue"),
  },
  {
    path: "/borrowed-books",
    name: "borrow.list",
    component: () => import("@/views/borrow-book/BorrowedBooks.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
