function validateUsernameAndEmail(body) {
  let errors = [];
  if (!body.username) {
    errors.push("Username is required.");
  }

  if (!body.email) {
    errors.push("Email is required.");
  }

  return errors;
}

function isEmailValid(email) {
  if (!email.includes("@") || !email.includes(".")) {
    return true;
  } else {
    return false;
  }
}

module.exports = { validateUsernameAndEmail, isEmailValid };
