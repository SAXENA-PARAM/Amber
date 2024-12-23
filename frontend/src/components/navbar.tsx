"use client";
import React from "react";
import { Home, ShoppingCart, Settings } from "lucide-react";
import AnimatedIconButton from "./animated-icon-button";

const Navbar = ({ student}: any) => {
  // Define a default student if none is passed
  const defaultStudent = { name: "vj", imgUrl: "" };
  const currentStudent = student ?? defaultStudent;

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-[#272729] h-[12vh] px-10 shadow-lg w-full">
      <div className="text-4xl font-bold text-white tracking-wide"><a href="/home">Amber</a></div>

      <div className="space-x-8">
        <AnimatedIconButton text="Home" icon="Home" />
        {/* <button className="px-4 py-2 text-xl hover:bg-black h-[10vh] w-[7vw]">Home</button> */}
        <AnimatedIconButton text="My Cart" icon="ShoppingCart" />
        <AnimatedIconButton text="Setting" icon="Settings" />

        <button className="text-white text-xl hover:text-gray-300 transition duration-200">
          <a href="/dashboard" className="flex items-center">
            {currentStudent.name}
            {currentStudent.imgUrl ? (
              <img
                src={currentStudent.imgUrl}
                alt="pic"
                className="h-8 rounded-full mr-3 ml-3"
              />
            ) : (
              <div className="h-8 w-8 rounded-full bg-gray-500 mr-3 ml-3" />
            )}
          </a>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
