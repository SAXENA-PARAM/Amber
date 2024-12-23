
import AboutUs from '@/components/aboutus';
import { HeroParallax } from '@/components/hero-parallax'
import Navbar from '@/components/navbar';
import WhyUs from '@/components/whyus';
import { CardHoverEffectDemo } from '@/components/whyus2';
import React from 'react'
import { TextRevealCardPreview } from './textreveal';
import Iphone15Pro from '@/components/ui/iphone-15-pro';
import Safari from '@/components/ui/safari';
import { BorderBeam } from '@/components/ui/border-beam';
import DotPattern from '@/components/ui/dot-pattern';
import { cn } from "@/lib/utils";
import PyramidLoader from '@/components/ui/pyramid';


const page = () => {
  const products = [
    { title: "Product 1", link: "/product1", thumbnail: "https://img.freepik.com/free-vector/flat-design-dance-school-youtube-thumbnail_23-2149405718.jpg?uid=R136547790&ga=GA1.1.1635994716.1728833539&semt=ais_hybrid" },
    { title: "Product 2", link: "/product2", thumbnail: "https://img.freepik.com/free-vector/flat-design-business-workshop-geometric-youtube-thumbnail_23-2149406372.jpg?uid=R136547790&ga=GA1.1.1635994716.1728833539&semt=ais_hybrid" },
    { title: "Product 3", link: "/product3", thumbnail: "https://img.freepik.com/free-vector/online-english-lessons-youtube-channel-art_23-2149291127.jpg?uid=R136547790&ga=GA1.1.1635994716.1728833539&semt=ais_hybrid" },
    { title: "Product 4", link: "/product4", thumbnail: "https://img.freepik.com/premium-psd/corporate-business-webinar-marketing-youtube-thumbnail-web-banner-template_364164-692.jpg?uid=R136547790&ga=GA1.1.1635994716.1728833539&semt=ais_hybrid" },
    { title: "Product 5", link: "/product5", thumbnail: "https://img.freepik.com/free-vector/flat-youtube-thumbnail-template-gym-exercise_23-2149556622.jpg?uid=R136547790&ga=GA1.1.1635994716.1728833539&semt=ais_hybrid" },
    { title: "Product 6", link: "/product6", thumbnail: "https://img.freepik.com/premium-psd/corporate-business-webinar-marketing-youtube-thumbnail-web-banner-template_364164-295.jpg?uid=R136547790&ga=GA1.1.1635994716.1728833539&semt=ais_hybrid" },
    { title: "Product 7", link: "/product7", thumbnail: "https://img.freepik.com/free-vector/hand-drawn-private-school-template_23-2149688548.jpg?uid=R136547790&ga=GA1.1.1635994716.1728833539&semt=ais_hybrid" },
    { title: "Product 8", link: "/product8", thumbnail: "https://img.freepik.com/free-vector/flat-abstract-business-youtube-thumbnail_23-2148925264.jpg?uid=R136547790&ga=GA1.1.1635994716.1728833539&semt=ais_hybrid" },
    { title: "Product 9", link: "/product9", thumbnail: "https://img.freepik.com/free-psd/gradient-e-learning-youtube-cover-template_23-2149981511.jpg?uid=R136547790&ga=GA1.1.1635994716.1728833539&semt=ais_hybrid" },
    { title: "Product 10", link: "/product10", thumbnail: "https://img.freepik.com/free-vector/gradient-golden-luxury-facebook-post_23-2149068433.jpg?uid=R136547790&ga=GA1.1.1635994716.1728833539&semt=ais_hybrid" },
    { title: "Product 11", link: "/product11", thumbnail: "https://img.freepik.com/free-vector/finances-concept-webinar-template_23-2151167111.jpg?uid=R136547790&ga=GA1.1.1635994716.1728833539&semt=ais_hybrid" },
    { title: "Product 12", link: "/product12", thumbnail: "https://img.freepik.com/free-psd/e-learning-concept-banner-template_23-2148688187.jpg?uid=R136547790&ga=GA1.1.1635994716.1728833539&semt=ais_hybrid" },
    { title: "Product 13", link: "/product13", thumbnail: "https://img.freepik.com/free-vector/flat-design-minimal-technology-youtube-thumbnail_23-2149138459.jpg?uid=R136547790&ga=GA1.1.1635994716.1728833539&semt=ais_hybrid" },
    { title: "Product 14", link: "/product14", thumbnail: "https://img.freepik.com/free-psd/flat-design-vegan-template_23-2149664954.jpg?uid=R136547790&ga=GA1.1.1635994716.1728833539&semt=ais_hybrid" },
    { title: "Product 15", link: "/product15", thumbnail: "https://img.freepik.com/free-psd/world-population-day-youtube-cover-template_23-2150445823.jpg?uid=R136547790&ga=GA1.1.1635994716.1728833539&semt=ais_hybrid" }
  ];
  const User={name: "Enter",
    imgUrl: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  };
  return (
    <div className='main'>
      
      
     <a href="presignup">
      <div className='w-[8vw] absolute top-6 right-0 h-[9vh] bg-red z-[70]'> .</div>
      </a> 
      <Navbar student={User}/>
      <HeroParallax products={products} />
      <CardHoverEffectDemo/>

      <div className='relative h-[100vh] w-[90vw] flex'>
        <div className='absolute left-0'>
      {/* <TextRevealCardPreview /> */}
      <PyramidLoader/>
      </div>
<div className="flex bg-black">
  <Iphone15Pro
    className="size-3/5 z-20 absolute left-[60vw] top-[20vh]"
    style={{
      transform: 'perspective(1000px) rotateX(10deg) rotateY(-10deg)',
      transformOrigin: 'center',
    }}
    src="/images/phoneimg.jpeg"
  />
  <Safari
    className="z-10 absolute top-1 left-[30vw] size-3/4"
    style={{
      transform: 'perspective(1000px) rotateX(7deg) rotateY(10deg)',
      transformOrigin: 'center',
    }}
    url="amber.com/landingpage"
    src="/images/pcimg2.png"
  />
</div>

      <BorderBeam/>
      </div>
      <AboutUs />
     
      <DotPattern
        width={20}
        height={20}
        cx={1}
        cy={1}
        cr={1}
        className={cn(
          "[mask-image:radial-gradient(1200px_circle_at_center,white,transparent)] ",
        )}
      />
    </div>
  );
};

export default page;
