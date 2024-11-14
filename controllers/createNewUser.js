const { user } = require("../models");
const { doesUserExist } = require("../services/doesUserExist");
const {
  validateUsernameAndEmail,
  isEmailValid,
} = require("../validators/index");

const createNewUser = async (req, res) => {
  try {
    const { username, email } = req.body;
    const errors = validateUsernameAndEmail(req.body);

    if (errors.length > 0) return res.status(400).json({ errors });

    const userExists = await doesUserExist(req.body.email);
    if (userExists) {
      return res
        .status(400)
        .json({ message: `User with this eamil already exists.` });
    }

    const notValidEmail = isEmailValid(req.body.email);
    if (notValidEmail) {
      return res
        .status(400)
        .json({ message: `Email is invalid. Please enter a valid email.` });
    }

    const newUser = await user.create({ username, email });
    return res.status(201).json({ message: "User Created", user: newUser });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = createNewUser;
