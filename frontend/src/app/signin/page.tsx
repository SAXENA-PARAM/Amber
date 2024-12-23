import Rotator from "../signin/rotatenine";
import Login from "./login";
import Spline from "@/components/spline/signin"
export default function page() {

  

  return (
    <div className="w-full h-screen">
    <Spline/>
    <Login/>
    <img src='/images/signinlogo.jpeg' className="h-[10vh] absolute top-[0vh] left-5 mix-blend-lighten" />
    <Rotator/>
    </div>
  );
};
