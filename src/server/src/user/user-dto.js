module.exports = class UserDto {
  username;
  id;
  role;

  constructor(model) {
    this.username = model.username;
    this.id = model.id;
    this.role = model.role;
  }
};
