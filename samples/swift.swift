struct Theme: CustomStringConvertible {
  let mode: String
  let accent: String
  var description: String { "Umbre \(mode) / \(accent)" }
}

print(Theme(mode: "dark", accent: "amber"))
