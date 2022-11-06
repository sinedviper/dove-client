export const colorCard = (alpha: string) => {
  const color1 = "a b c d e f";
  const color2 = "g h i j k l m";
  const color3 = "n o p q r s";
  const color4 = "t u v w x y z";

  if (color1.includes(alpha.toLowerCase())) {
    return { color2: "#845EC2", color1: "#c45dd1" };
  }
  if (color2.includes(alpha.toLowerCase())) {
    return { color1: "#0081CF", color2: "#008F7A" };
  }
  if (color3.includes(alpha.toLowerCase())) {
    return { color1: "#FF6F91", color2: "#FFC75F" };
  }
  if (color4.includes(alpha.toLowerCase())) {
    return { color1: "#FF9671", color2: "#C34A36" };
  }
};
