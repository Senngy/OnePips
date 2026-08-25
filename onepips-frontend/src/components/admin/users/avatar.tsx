export default function Avatar({
  name,
  size = "md",
}: {
  name: string | null;
  size?: "sm" | "md";
}) {
  const initials = name
    ? name
        .split(" ")
        .filter(Boolean)
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "?";

  const sizeClass =
    size === "sm" ? "w-8 h-8 text-xs" : "w-12 h-12 text-base";

  return (
    <div
      className={`${sizeClass} rounded-full bg-primary-container/20 text-primary flex items-center justify-center font-headline font-bold shrink-0`}
    >
      {initials}
    </div>
  );
}
