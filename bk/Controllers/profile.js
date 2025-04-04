const UserModel = require('../Models/UserSchema');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const profile = await UserModel.findOne({
      username: req.user.username,
    }).select('email username');

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const updateUser = await UserModel.findOneAndUpdate(
      { username: req.user.username },
      req.body,
      { new: true }
    );

    if (!updateUser) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.status(200).json({ success: true, data: updateUser });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
