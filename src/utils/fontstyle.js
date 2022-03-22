export function convertToDoubleStruck(str) {
    str = str.toUpperCase()
    const doubleStruckUpper = {
        A: "𝔸", B: "𝔹", C: "ℂ", D: "𝔻", E: "𝔼",
        F: "𝔽", G: "𝔾", H: "ℍ", I: "𝕀", J: "𝕁",
        K: "𝕂", L: "𝕃", M: "𝕄", N: "ℕ", O: "𝕆",
        P: "ℙ", Q: "ℚ", R: "ℝ", S: "𝕊", T: "𝕋",
        U: "𝕌", V: "𝕍", W: "𝕎", X: "𝕏", Y: "𝕐",
        Z: "ℤ", 1: "𝟙", 2: "𝟚", 3: "𝟛", 4: "𝟜", 5: "𝟝",
        6: "𝟞", 7: "𝟟", 8: "𝟠", 9: "𝟡", 0: "𝟘"
    };
    let result = "";
    for (var i = 0; i < str.length; i++) {
        result = result.concat(doubleStruckUpper[str.charAt(i)] ? doubleStruckUpper[str.charAt(i)] : str.charAt(i));
    }
    return result;
}