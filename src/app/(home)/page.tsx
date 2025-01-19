import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Navbar } from "./navbar";
import { TemplateGallery } from "./template-gallery";

const Home = () => {
  return ( 
    <div className="flex flex-col min-h-screen">
      <div className="p-4 fixed top-0 left-0 left-0 right-0 z-10 h-16 bg-white">
        <Navbar/>
      </div>
      <div className="mt-16">
      <TemplateGallery/>
      </div>
      </div>
  );
}
 
export default Home;