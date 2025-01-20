'use client'
import { useQuery } from "convex/react";
import { Navbar } from "./navbar";
import { TemplateGallery } from "./template-gallery";
import { api } from "../../../convex/_generated/api";

const Home = () => {
  const documents=useQuery(api.documents.get);
  if(documents===undefined){
    return <div>Loading...</div>
  }
  return ( 
    <div className="flex flex-col min-h-screen">
      <div className="p-4 fixed top-0 left-0 left-0 right-0 z-10 h-16 bg-white">
        <Navbar/>
      </div>
      <div className="mt-16">
      <TemplateGallery/>
      {documents?.map((document)=>(
       <span key={document._id}>{document.title}</span>
      ))}
      </div>
      </div>
  );
}
 
export default Home;