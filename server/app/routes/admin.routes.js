const express = require("express");
const admin = require("../controllers/admin.controller");

const router = express.Router();

router.route("/").get(admin.findAll).post(admin.create).delete(admin.deleteAll);

router.route("/:id").get(admin.findOne).put(admin.update).delete(admin.delete);

module.exports = router;
