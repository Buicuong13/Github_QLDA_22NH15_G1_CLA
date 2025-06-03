const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Update user profile (name, email)
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, updatedAt } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Cập nhật name nếu trường này được gửi lên (kể cả rỗng)
    if (typeof name !== 'undefined') {
      user.name = name;
    }
    // Cập nhật email nếu trường này được gửi lên và khác email cũ
    if (typeof email !== 'undefined' && email !== user.email) {
      // Kiểm tra định dạng email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Email không hợp lệ' });
      }
      const emailExists = await User.findOne({ where: { email } });
      if (emailExists) return res.status(400).json({ message: 'Email đã tồn tại' });
      user.email = email;
    }
    user.updatedAt = updatedAt || new Date();
    await user.save();
    res.json({ id: user.id, name: user.name, email: user.email, updatedAt: user.updatedAt, roleId: user.roleId, capacity: user.capacity });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Change password
router.put('/password', auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Mật khẩu cũ không đúng' });
    // Kiểm tra độ dài mật khẩu mới
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.updatedAt = new Date();
    await user.save();
    res.json({ message: 'Đổi mật khẩu thành công' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
