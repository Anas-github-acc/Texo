'use client'

import { Preloaded, usePreloadedQuery } from "convex/react";
import { Editor } from "./editor";
import { Navbar } from "./navbar";
import { Room } from "./room";

import { Toolbar } from "./toolbar";
import { api } from "../../../../convex/_generated/api";

interface DocumentProps {
    predocument:Preloaded<typeof api.documents.getById>
}

export const Document =   ({predocument}:DocumentProps) => {
    const document=usePreloadedQuery(predocument)
    return (<Room>
        <div className="m-h-screen bg-background">
            <div className="flex flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-background text-white  print:hidden">
            <Navbar data={document}/>
            <Toolbar />
            </div>
            <div className="pt-[114px] print:pt-0">
                
            <Editor initialContent={document.initialContent}/>

            </div>
        </div>
  </Room>
      );
}
