const { user } = require("../models");

async function doesUserExist(email) {
  try {
    const existingUser = await user.findOne({
      where: { email: email },
    });

    return existingUser ? true : false;
  } catch (error) {
    console.error(error);
  }
}

module.exports = { doesUserExist };
