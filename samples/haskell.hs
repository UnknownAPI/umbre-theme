data Mode = Dark | Light deriving (Eq, Show)

accentName :: String -> String
accentName accent = "Umbre " <> accent

main :: IO ()
main = print (accentName "amber", Dark)
