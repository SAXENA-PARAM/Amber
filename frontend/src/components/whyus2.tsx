"use client"
import { HoverEffect } from "@/components/ui/card-hover-effect";
import { BorderBeam } from "./ui/border-beam";
import BlurFade from "./ui/blur-fade";
import { TextRevealCardPreview } from "@/app/home/textreveal";
 
export function CardHoverEffectDemo() {
  return (
    <div className="max-w-[90vw] mx-auto pb-7 h-[100vh] relative mt-1 mb-2 shadow-md top-[-30vh] border">
      {/* <div className="text-4xl text-center"> Why AMBER?</div> */}
      <TextRevealCardPreview className={"relative z-10 bg-transparent top-[-10vh]"}/>
      <BlurFade delay={0} inView duration={0.8}>
      <div className="max-w-[90vw] mx-auto py-5 px-[10vw] relative mt-1 mb-5 shadow-md top-[-30vh]">
      <HoverEffect items={reasons} />
      </div>
      </BlurFade>
      <BorderBeam/>
    </div>
  );
}
export const reasons = [
    {
      title: "Comprehensive Learning",
      description:
        "Our platform offers a wide range of courses covering various topics, ensuring that you have access to the best educational resources. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    link:"",
    },
    {
      title: "Interactive Experience",
      description:
        "We provide interactive lessons and engaging activities that make learning enjoyable. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus lacinia odio vitae vestibulum.",
        link:"",
},
    {
      title: "Expert Instructors",
      description:
        "Our courses are designed and taught by industry experts who are passionate about sharing their knowledge. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        link:"",
},
    {
      title: "Flexible Learning",
      description:
        "Learn at your own pace with our flexible scheduling options that fit your lifestyle. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean vel urna eget mi placerat vestibulum.",
        link:"",
},
    {
      title: "Affordable Pricing",
      description:
        "We believe in making education accessible, which is why we offer competitive pricing for our courses. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        link:"",
},
    {
      title: "Community Support",
      description:
        "Join a thriving community of learners and educators who are here to support you on your journey. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        link:"",
},
  ];
  