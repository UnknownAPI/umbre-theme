#[derive(Debug)]
struct Theme<'a> {
    mode: &'a str,
    accent: &'a str,
}

fn main() {
    println!("{:?}", Theme { mode: "dark", accent: "amber" });
}
