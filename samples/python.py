from dataclasses import dataclass

@dataclass(frozen=True)
class Theme:
    mode: str = "dark"
    accent: str = "amber"

print(Theme())
