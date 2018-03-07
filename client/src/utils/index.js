// //////// FORM VALIDATION FUNCTIONS //////////

const _isRequired = fieldName => `${fieldName} is required`;

const _mustMatch = otherFieldName => fieldName =>
  `${fieldName} must match ${otherFieldName}`;

const _minLength = length => fieldName =>
  `${fieldName} must be at least ${length} characters`;

export const required = text => {
  if (text) {
    return null;
  }
  return _isRequired;
};

export const conditionalRequired = (text, fieldName) => (text2, state) =>
  state[fieldName] !== "" && text2 === "" ? _isRequired : null;

export const mustMatch = (field, fieldName) => (text, state) =>
  state[field] === text ? null : _mustMatch(fieldName);

export const minLength = length => text =>
  text.length >= length ? null : _minLength(length);

export const ruleRunner = (field, name, ...validations) => state => {
  const errorMessageFunc = validations.find(v => v(state[field], state));
  if (errorMessageFunc) {
    return { [field]: errorMessageFunc(state[field], state)(name) };
  }
  return {};
};

export const run = (state, runners) =>
  runners.reduce((memo, runner) => Object.assign(memo, runner(state)), {});

export const fieldValidationsLogin = [
  ruleRunner("email", "Email", required),
  ruleRunner("password", "Password", required)
];

export const fieldValidationsResetPassword = [
  ruleRunner("password", "Password", required, minLength(6)),
  ruleRunner(
    "confirmPwd",
    "Password Confirmation",
    mustMatch("password", "Password")
  )
];

export const fieldValidationsRegister = [
  ruleRunner("firstName", "First Name", required),
  ruleRunner("lastName", "Last Name", required),
  ruleRunner("email", "Email", required),
  ruleRunner("password", "Password", required, minLength(6)),
  ruleRunner(
    "confirmPwd",
    "Password Confirmation",
    mustMatch("password", "Password")
  )
];
