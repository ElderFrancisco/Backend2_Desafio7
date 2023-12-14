const userModel = require('./models/users.model');
class UsersDao {
  async createOne(User) {
    try {
      return await userModel.create(User);
    } catch (error) {
      console.log('error on UsersDao createOne');
    }
  }
  async getOne(query) {
    try {
      return await userModel.findOne(query).lean();
    } catch (error) {
      console.log('error on UsersDao getOne');
    }
  }
}
module.exports = UsersDao;
