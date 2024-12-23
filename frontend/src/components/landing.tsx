"use client"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Search } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import FancyButton from "./ui/fancybutton"
import IconCloud from "./ui/icon-cloud"
import BoxReveal from "./ui/box-reveal"
import SearchBar from "./searchbar"
import { useRef } from "react"
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const slugs = [
    "typescript",
    "javascript",
    "dart",
    "java",
    "react",
    "flutter",
    "android",
    "html5",
    "css3",
    "nodedotjs",
    "express",
    "nextdotjs",
    "prisma",
    "amazonaws",
    "postgresql",
    "firebase",
    "nginx",
    "vercel",
    "testinglibrary",
    "jest",
    "cypress",
    "docker",
    "git",
    "jira",
    "github",
    "gitlab",
    "visualstudiocode",
    "androidstudio",
    "sonarqube",
    "figma",
  ];
   // Create a reference for the Top Categories section
   const categoriesRef = useRef<HTMLElement | null>(null);

   // Function to scroll to the categories section
   const scrollToCategories = () => {
     categoriesRef.current?.scrollIntoView({
       behavior: 'smooth',
       block: 'start',
     });
   };

   const instructorRef = useRef<HTMLElement | null>(null);
   const scrollToTeach = () =>{
    instructorRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
   };

   const router = useRouter();

   const handleNavigation = () => {
     router.push('/presignup');}

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-orange-600">AMBER</Link>
          <div className="flex items-center space-x-4">
            {/* <div className="hidden md:flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2">
              <Search className="text-gray-400" size={20} />
              <Input type="search" placeholder="Search for courses" className="bg-transparent border-none focus:outline-none" />
            </div> */}
            <SearchBar/>
            <nav className="hidden md:flex space-x-4">
              <Link href="#" className="text-gray-600 hover:text-purple-600" onClick={scrollToCategories}>Categories</Link>
              <Link href="#" className="text-gray-600 hover:text-purple-600" onClick={scrollToTeach}>Teach</Link>
            </nav>
            <div >
              <Link rel="stylesheet" href="/dashboard" className="flex items-center space-x-3">
              <span className="text-gray-700">Welcome</span>
              <Image
                src="data:image/jpeg;base64,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"
                alt="User profile"
                width={40}
                height={40}
                className="rounded-full"
              />
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-orange-500 to-red-600 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Expand Your Knowledge, Elevate Your Career</h1>
              <p className="text-xl mb-8">Learn from industry experts and transform your skills with our cutting-edge courses.</p>
              <div className="flex justify-center">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" onClick={scrollToCategories}>Explore Courses</Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="py-16">
        <div className="container mx-auto px-4">
  <h2 className="text-3xl font-bold mb-8">Featured Courses</h2>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
    {[
      // Existing courses
      {
        id: 1,
        title: "Complete Web Development Bootcamp",
        author: "John Doe",
        rating: 4.7,
        reviews: 1234,
        price: 499,
        originalPrice: 1999,
        image: "https://img.freepik.com/free-psd/e-learning-template-design_23-2151081790.jpg?t=st=1731735981~exp=1731739581~hmac=378fd6aec9d54470bcc4675585ae5b61fbb4f202cce63c08b246e99cd5b3e3a8&w=1480",
        badge: "Bestseller",
      },
      {
        id: 2,
        title: "Master Python for Data Science",
        author: "Jane Smith",
        rating: 4.8,
        reviews: 987,
        price: 699,
        originalPrice: 2499,
        image: "https://img.freepik.com/free-psd/e-learning-banner-template-design_23-2149585649.jpg?t=st=1731736068~exp=1731739668~hmac=7f6991fab238376db1afc141fbd59eb2b89121f0bf32d281162c3dbb3a935f06&w=1480",
        badge: "Trending",
      },
      {
        id: 3,
        title: "UI/UX Design Fundamentals",
        author: "Alex Johnson",
        rating: 4.6,
        reviews: 456,
        price: 299,
        originalPrice: 1499,
        image: "https://img.freepik.com/free-psd/back-school-online-banner-template_23-2148876052.jpg?semt=ais_hybrid",
        badge: "New",
      },
      // New dummy data courses
      {
        id: 4,
        title: "Introduction to Machine Learning",
        author: "Emily Davis",
        rating: 4.5,
        reviews: 850,
        price: 599,
        originalPrice: 1999,
        image: "https://img.freepik.com/free-vector/abstract-business-youtube-thumbnail-template_23-2148720358.jpg?t=st=1731795653~exp=1731799253~hmac=ace49849cb34df94b2fe8ba9346cb2b725d98840e8ea5a9f4556042a5c78312f&w=1480",
        badge: "Popular",
      },
      {
        id: 5,
        title: "Digital Marketing Essentials",
        author: "Samuel Lee",
        rating: 4.3,
        reviews: 1200,
        price: 499,
        originalPrice: 1499,
        image: "https://img.freepik.com/free-psd/e-learning-graphic-template_23-2151095560.jpg?t=st=1731737608~exp=1731739608~hmac=1a513f09d010dd17c76c0f5c23a34f899cbfa16d7a9fd536ba5f4e5fe4e4182e&w=1480",
        badge: "Featured",
      },
      {
        id: 6,
        title: "Full Stack Web Development",
        author: "Olivia Brown",
        rating: 4.9,
        reviews: 4567,
        price: 799,
        originalPrice: 2999,
        image: "https://img.freepik.com/free-vector/youtube-background-thumbnail-design-template-with-text-full-editable_1361-2730.jpg?t=st=1731795800~exp=1731799400~hmac=3e6369f2696df9532fa122469fe714fda9915d574414413161e5f591826dd648&w=1480",    badge: "Best Rated",
      },
    ].map((course) => (
      <Card key={course.id}>
        <CardContent className="p-0">
        <a href={`/course/${course.title}`}>
  <Image
    src={course.image}
    alt={`${course.title} thumbnail`}
    width={400}
    height={200}
    className="w-full h-48 object-cover"
  />
</a>
          <div className="p-4">
            <Badge className="mb-2">{course.badge}</Badge>
            <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
            <p className="text-sm text-gray-500 mb-2">{course.author}</p>
            <div className="flex items-center mb-2">
              <span className="text-yellow-400 font-bold mr-1">{course.rating}</span>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 fill-current ${
                      star <= Math.round(course.rating) ? "text-yellow-400" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-1">({course.reviews})</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold">₹{course.price}</span>
              <span className="text-sm line-through text-gray-500">₹{course.originalPrice}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
</div>

  
</section>


        {/* Categories */}
        <section className="bg-gray-100 py-16 text-black" ref={categoriesRef} >
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8">Top Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white px-4">
              {['Web Development', 'Data Science', 'Business', 'Design', 'Marketing', 'IT and Software', 'Personal Development', 'Photography'].map((category) => (
                <Link key={category} href="/searchresult" className="h-auto py-8 flex flex-col items-center justify-center rounded-lg">
                  {/* <span className="text-lg font-semibold">{category}</span> */}
                  <FancyButton>{category}</FancyButton>
                </Link>
              ))}
            </div>
          </div>
        </section>
<div className="flex justify-center items-center">
  <div className="w-1/3 p-4 pr-[10vw] text-black">
  
  <BoxReveal boxColor={"#5046e6"} duration={0.75}>
        <p className="text-[3.5rem] font-semibold">
          Amber<span className="text-[#5046e6]">.</span>
        </p>
      </BoxReveal>
 
      <BoxReveal boxColor={"#5046e6"} duration={0.75}>
        <h2 className="mt-[.5rem] text-[1rem]">
          E-learning platform for{" "}
          <span className="text-[#5046e6]">Everyone</span>
        </h2>
      </BoxReveal>
 
      <BoxReveal boxColor={"#5046e6"} duration={0.75}>
        <div className="mt-6">
          <p>
            -&gt; 20+ free and paid courses built on
            <span className="font-semibold text-[#5046e6]"> Web Dev</span>,
            <span className="font-semibold text-[#5046e6]"> App Dev</span>,
            <span className="font-semibold text-[#5046e6]"> AI/ML</span>,
            and
            <span className="font-semibold text-[#5046e6]"> Data Science</span>
            . <br />
            -&gt; Made for complete beginners. <br />
          </p>
        </div>
      </BoxReveal>

  </div>
              <IconCloud iconSlugs={slugs}/>
</div>
        {/* Become an Instructor */}
        <section className="py-16" ref={instructorRef}>
          <div className="container mx-auto px-4">
            <div className="bg-gray-900 text-white rounded-lg p-8 md:p-12 flex flex-col md:flex-row items-center">
              <div className="md:w-2/3 mb-6 md:mb-0 md:pr-8">
                <h2 className="text-3xl font-bold mb-4">Become an instructor</h2>
                <p className="text-lg mb-6">Join our community of expert instructors and share your knowledge with learners worldwide.</p>
                <Button size="lg" variant="secondary" onClick={handleNavigation}>Start Teaching Today</Button>
              </div>
              <div className="md:w-1/3">
                <Image src="https://t3.ftcdn.net/jpg/02/02/52/36/360_F_202523652_NqEMp50IkORLXlCmJXqgqRBLMW8xBHMP.jpg" alt="Become an instructor" width={300} height={300} className="rounded-lg" />
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">LearnHub</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-gray-300">About us</Link></li>
                <li><Link href="#" className="hover:text-gray-300">Careers</Link></li>
                <li><Link href="#" className="hover:text-gray-300">Blog</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Community</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-gray-300">Learners</Link></li>
                <li><Link href="#" className="hover:text-gray-300">Partners</Link></li>
                <li><Link href="#" className="hover:text-gray-300">Developers</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-gray-300">Help Center</Link></li>
                <li><Link href="#" className="hover:text-gray-300">Safety Center</Link></li>
                <li><Link href="#" className="hover:text-gray-300">Contact Us</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link href="#" className="hover:text-gray-300">Terms of Service</Link></li>
                <li><Link href="#" className="hover:text-gray-300">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-gray-300">Cookie Settings</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p>&copy; 2024 LearnHub, Inc. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="hover:text-gray-300">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="#" className="hover:text-gray-300">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="#" className="hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path  d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}