const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const usersFilePath = path.join(__dirname, '../../data/users.json');

// Ensure users file exists
if (!fs.existsSync(usersFilePath)) {
  fs.writeFileSync(usersFilePath, JSON.stringify([]));
}

class User {
  static async create({ name, email, password }) {
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    
    // Check if user exists
    if (users.some(user => user.email === email)) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    return newUser;
  }

  static async findByEmail(email) {
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    return users.find(user => user.email === email);
  }

  static async findById(id) {
    const users = JSON.parse(fs.readFileSync(usersFilePath));
    return users.find(user => user.id === id);
  }
}

module.exports = User;