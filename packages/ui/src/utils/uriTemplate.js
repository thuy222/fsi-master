export default function uriTag(template) {
  let outputString = ''
  for (let i = 0; i < template.length; i++) {
    outputString += template[i]
    if (i + 1 <= arguments.length - 1) {
      outputString += arguments[i + 1]
    }
  }
  return outputString
}
