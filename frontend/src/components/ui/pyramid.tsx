"use client"
import React from "react";

const PyramidLoader: React.FC = () => {
  return (
    <div className="pyramid-loader">
      <div className="wrapper">
        <span className="side side1"></span>
        <span className="side side2"></span>
        <span className="side side3"></span>
        <span className="side side4"></span>
        <span className="shadow"></span>
      </div>
      <style jsx>{`
        .pyramid-loader {
          position: relative;
          top:40vh;
          left:10vw;
          width: 10vh;
          height: 10vh;
          display: block;
          transform-style: preserve-3d;
          transform: rotateX(-20deg);
        }

        .wrapper {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          animation: spin 4s linear infinite;
        }

        @keyframes spin {
          100% {
            transform: rotateY(360deg);
          }
        }

        .pyramid-loader .wrapper .side {
          width: 200px;
          height: 200px;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          transform-origin: center top;
          clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
        }

        .pyramid-loader .wrapper .side1 {
          transform: rotateZ(-30deg) rotateY(90deg);
          background: conic-gradient(#2BDEAC, #F028FD, #D8CCE6, #2F2585);
        }

        .pyramid-loader .wrapper .side2 {
          transform: rotateZ(30deg) rotateY(90deg);
          background: conic-gradient(#2F2585, #D8CCE6, #F028FD, #2BDEAC);
        }

        .pyramid-loader .wrapper .side3 {
          transform: rotateX(30deg);
          background: conic-gradient(#2F2585, #D8CCE6, #F028FD, #2BDEAC);
        }

        .pyramid-loader .wrapper .side4 {
          transform: rotateX(-30deg);
          background: conic-gradient(#2BDEAC, #F028FD, #D8CCE6, #2F2585);
        }

        .pyramid-loader .wrapper .shadow {
          width: 500px;
          height: 500px;
          background: #8B5AD5;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          margin: auto;
          transform: rotateX(90deg) translateZ(-400px);
          filter: blur(200px);
        }
      `}</style>
    </div>
  );
};

export default PyramidLoader;
