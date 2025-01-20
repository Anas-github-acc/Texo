'use client'
import { usePaginatedQuery } from "convex/react";
import { Navbar } from "./navbar";
import { TemplateGallery } from "./template-gallery";
import { api } from "../../../convex/_generated/api";
import { DocumentTable } from "./documents-table";

const Home = () => {
  const {
    results,
    status,
    loadMore
  }=usePaginatedQuery(api.documents.get,{},{initialNumItems:5});
  
  return ( 
    <div className="flex flex-col min-h-screen">
      <div className="p-4 fixed top-0 left-0 left-0 right-0 z-10 h-16 bg-white">
        <Navbar/>
      </div>
      <div className="mt-16">
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