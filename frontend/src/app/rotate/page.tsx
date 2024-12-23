import { WordRotate } from "@/components/WordRotate";

export default function HomePage() {
  return (
    <div style={{ fontFamily: "'Oswald', sans-serif" }} className="flex absolute">
      <WordRotate words={["Interactive", "Personalized", "Edutainment"]} duration={5000} />
      <WordRotate words={["Cognizant", "Empowerment", "User-Friendly"]} duration={40000} />
      <WordRotate words={["Synergistic", "Accessible", "Omniscient"]} duration={5000} />
    </div>
  );
}
