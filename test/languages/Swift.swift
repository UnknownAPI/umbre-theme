import Foundation

struct Theme: Codable {
  let mode: String
  let accent: String
  let dimming: Int
}

let theme = Theme(mode: "dark", accent: "amber", dimming: 2)
print(theme)
