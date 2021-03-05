function isValidForm() {
  var answer = confirm("Are you sure you want to delete this?");
  if (answer) {
    return true;
  } else {
    return false;
  }
}
