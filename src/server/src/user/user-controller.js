const userService = require('./user-service');

class UserController {
  async fetchAllUsers(req, res) {
    try {
      const limit = Number(req.query.limit) || 10;
      const offset = Number(req.query.offset) || 0;
      const users = await userService.fetchAllUsers(limit, offset);
      return res.json(users);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to get all users', message: err.message });
    }
  }

  async fetchUsersInfoForAdmin(req, res) {
    try {
      const users = await userService.fetchUsersInfoForAdmin();
      return res.json(users);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  async setUserRole(req, res) {
    try {
      const { userId, roleId } = req.body;
      await userService.setUserRole(userId, roleId);
      return res.json({ message: 'User role updated successfully' });
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new UserController();
