const UsersDao = require('../dao/mongo/usersDao');
const UsersDaoManager = new UsersDao();

class UserServices {
  async createNewUser(user) {
    try {
      return await UsersDaoManager.createOne(user);
    } catch (error) {
      console.log('Error on UserServices, createNewUser function: ' + error);
      return error;
    }
  }

  async findOneByEmail(email) {
    try {
      const user = await UsersDaoManager.getOne(email);
      if (!user) {
        console.log('nose encontro');
        return null;
      }
      return user;
    } catch (error) {
      console.log('Error on UserServices, findOneByEmail function: ' + error);
      return error;
    }
  }

  async findUserById(id) {
    try {
      const query = { _id: id };
      return await UsersDaoManager.getOne(query);
    } catch (error) {
      console.log('Error on UserServices, findUserById function: ' + error);
      return error;
    }
  }
}

module.exports = UserServices;
