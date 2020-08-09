const mongoos = require("mongoose");

const roleSchema = mongoos.SchemaTypes({
  id: Number,
  roleName: String,
});

module.exports = mongoos.model("Role", roleSchema);
