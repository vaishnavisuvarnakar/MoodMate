import Image from "next/image";

type Expression = "happy" | "neutral" | "sad" | "excited" | "curious" | "stressed";

const IMAGES: Record<Expression, string> = {
  happy: "/mascots/happy.png",
  excited: "/mascots/happy.png",
  neutral: "/mascots/calm.png",
  sad: "/mascots/sad.png",
  stressed: "/mascots/stressed.png",
  curious: "/mascots/curious.png",
};

export function Mascot({
  size = 40,
  expression = "happy",
  className = "",
}: {
  size?: number;
  expression?: Expression;
  className?: string;
}) {
  return (
    <Image
      src={IMAGES[expression]}
      alt="MoodMate mascot"
      width={size}
      height={size}
      className={className}
      style={{ width: size, height: size, objectFit: "contain" }}
      unoptimized
    />
  );
}
