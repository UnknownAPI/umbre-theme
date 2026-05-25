#[derive(Debug, Clone)]
struct Theme<'a> {
    mode: &'a str,
    accent: &'a str,
    dimming: u8,
}

fn main() {
    let theme = Theme {
        mode: "dark",
        accent: "amber",
        dimming: 2,
    };

    println!("{:?}", theme);
}
