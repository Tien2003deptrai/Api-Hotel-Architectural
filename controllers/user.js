import User from "../models/User.js";

export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
}
export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted.");
  } catch (err) {
    next(err);
  }
}
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
}
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

export const getUsersPanigated = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const users = await User.find()
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalUsers = await User.countDocuments();

    res.status(200).json({
      users,
      currentPage: Number(page),
      totalPages: Math.ceil(totalUsers / limit),
    });
  } catch (err) {
    next(err);
  }
};