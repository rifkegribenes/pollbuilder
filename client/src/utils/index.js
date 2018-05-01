import update from "immutability-helper";

// //////// FORM VALIDATION FUNCTIONS //////////

export const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index;
};

export const isOptionInArray = (arr, option, index) => {
  // loop through options in array, checking if the "text" key matches
  // the "text" key on any other option at a different index
  for (let i = 0; i < arr.length; i++) {
    if (i !== index && arr[i]["text"] === option["text"]) {
      return true;
    }
  }
  return false;
};

const findDupes = options => {
  let dupes = [];
  options.forEach((option, index) => {
    // check if dupe
    if (isOptionInArray(options, option, index)) {
      // if (options.indexOf(option, index + 1) > -1) {
      // check if in dupes array
      if (dupes.indexOf(option) === -1) {
        dupes.push(option);
      }
    }
  });
  return dupes;
};

const _isRequired = fieldName => `${fieldName} is required`;

const _atLeastTwoRequired = fieldName =>
  `Polls must have at least two ${fieldName}s`;

const _mustMatch = otherFieldName => fieldName =>
  `${fieldName} must match ${otherFieldName}`;

const _minLength = length => fieldName =>
  `${fieldName} must be at least ${length} characters`;

export const checkDupes = (errorsObj, options, fieldName) => {
  if (options[fieldName].text.length) {
    // don't run test if field is blank
    if (findDupes(options).length) {
      return update(errorsObj, {
        [fieldName]: { $set: "Options must be unique" }
      });
    } else {
      return errorsObj;
    }
  } else {
    return update(errorsObj, {
      [fieldName]: { $set: "Option cannot be blank" }
    });
  }
};

export const required = text => {
  if (text) {
    return null;
  }
  return _isRequired;
};

export const atLeastTwoRequired = text => {
  if (text) {
    return null;
  }
  return _atLeastTwoRequired;
};

export const validateEmail = validationErrors => {
  if (!document.getElementById("email").validity.valid) {
    validationErrors.email = "Please enter a valid email address";
    return validationErrors;
  } else {
    return validationErrors;
  }
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

export const fieldValidations = {
  login: [
    ruleRunner("email", "Email", required),
    ruleRunner("password", "Password", required)
  ],
  resetPwd: [
    ruleRunner("password", "Password", required, minLength(6)),
    ruleRunner(
      "confirmPwd",
      "Password Confirmation",
      mustMatch("password", "Password")
    )
  ],
  reset: [ruleRunner("email", "Email", required)],
  signup: [
    ruleRunner("firstName", "First Name", required),
    ruleRunner("lastName", "Last Name", required),
    ruleRunner("email", "Email", required),
    ruleRunner("password", "Password", required, minLength(6)),
    ruleRunner(
      "confirmPwd",
      "Password Confirmation",
      mustMatch("password", "Password")
    )
  ],
  avatarUrl: [ruleRunner("avatarUrl", "Image URL", required)],
  firstName: [
    ruleRunner("firstName", "First Name", required),
    ruleRunner("lastName", "Last Name", required)
  ],
  email: [ruleRunner("email", "Email", required)],
  create: [ruleRunner("question", "Question", required)]
};

export const pollOptionsValidation = (errorsObj, options, fieldName) => {
  return checkDupes(errorsObj, options, fieldName);
};

// force focus on #main when using skip navigation link
// (some browsers will only focus form inputs, links, and buttons)
export const skip = targetId => {
  const removeTabIndex = e => {
    e.target.removeAttribute("tabindex");
  };
  const skipTo = document.getElementById(targetId);
  // Setting 'tabindex' to -1 takes an element out of normal
  // tab flow but allows it to be focused via javascript
  skipTo.tabIndex = -1;
  skipTo.focus(); // focus on the content container
  // console.log(document.activeElement);
  // when focus leaves this element,
  // remove the tabindex attribute
  skipTo.addEventListener("blur", removeTabIndex);
};

// animated typewriter effect for homeapge
export const typewriterAnimation = () => {
  document.addEventListener("DOMContentLoaded", function(event) {
    // array with phrases to type in typewriter
    const dataText = [
      "Create your own polls.",
      "Share polls with anyone.",
      "Vote in any public poll.",
      "Analyze results.",
      "Amaze your friends."
    ];

    // type one phrase in the typwriter
    // keeps calling itself until the phrase is completed
    function typeWriter(text, i, fnCallback) {
      // check if text is finished
      if (i < text.length && document.getElementById("typewriter")) {
        // add next character to h1
        document.getElementById("typewriter").innerHTML = `${text.substring(
          0,
          i + 1
        )}<span aria-hidden="true" class="splash__caret"></span>`;

        // wait 100ms, then call function again for next character
        setTimeout(function() {
          typeWriter(text, i + 1, fnCallback);
        }, 100);
      } else if (typeof fnCallback === "function") {
        // text finished, call callback if there is a callback function
        // call callback after timeout
        setTimeout(fnCallback, 700);
      }
    }
    // start a typewriter animation for a text in the dataText array
    function startTextAnimation(i) {
      if (typeof dataText[i] === "undefined") {
        setTimeout(function() {
          startTextAnimation(0);
        }, 20000);
      }
      // check if dataText[i] exists
      if (dataText[i]) {
        if (i < dataText[i].length) {
          // text exists! start typewriter animation
          typeWriter(dataText[i], 0, function() {
            // after callback (and whole text has been animated), start next text
            startTextAnimation(i + 1);
          });
        }
      }
    }
    // start the text animation
    startTextAnimation(0);
  });
};
