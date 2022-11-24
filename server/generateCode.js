function generateCode(codeLenght) {
  let code = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i < codeLenght; i++) {
    code += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return code;
}

module.exports = generateCode;
