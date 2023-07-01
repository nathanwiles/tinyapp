
module.exports = class User {
  constructor(email, password) {
    this.id = generateRandomString(10);
    this.email = email;
    this.password = password;
  }
}