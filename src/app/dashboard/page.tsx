'use client'
import { usePaginatedQuery } from "convex/react";
import { Navbar } from "./navbar";
import { TemplateGallery } from "./template-gallery";
import { api } from "../../../convex/_generated/api";
import { DocumentTable } from "./documents-table";
import { useSearchParam } from "@/hooks/use-search-param";

const Home = () => {
  const [search]=useSearchParam('search');
  const {
    results,
    status,
    loadMore
  }=usePaginatedQuery(api.documents.get,{search},{initialNumItems:5});
  
  return ( 
    <div className="flex flex-col min-h-screen  bg-[#1f1f1f]">
      <div className="p-4 fixed top-0 left-0  right-0 z-10 h-16 bg-[#211f1f] text-[#f2f2f2]">
        <Navbar/>
      </div>
      <div className="mt-16 bg-[#1f1f1f] text-[#f2f2f2]">
      <TemplateGallery/>
      <DocumentTable
      documents={results}
      status={status}
      loadMore={loadMore}
      />
      </div>
      </div>
  );
}
 
export default Home;