import { WordRotate } from "@/components/WordRotate";

export default function HomePage() {
  return (
    <div style={{ fontFamily: "'Oswald', sans-serif" }} className="flex absolute top-[20vh] flex-col text-4xl">
AMBER: An 
<WordRotate words={["INTERACTIVE", "PERSONALIZED", "EDUTAINMENT"]} duration={4000} />
E- Learning Platform
    </div>
  );
}
