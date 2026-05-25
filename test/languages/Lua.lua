local palette = {
  accent = "amber",
  dimming = 2,
}

local function apply_theme(mode)
  if mode == "dark" then
    print("Umbra Dark")
  else
    print("Umbra Light")
  end
end

apply_theme("dark")
return palette
