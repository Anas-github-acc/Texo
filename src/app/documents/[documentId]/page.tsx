import { Editor } from "./editor";
import { Navbar } from "./navbar";

import { Toolbar } from "./toolbar";

interface DocumentIdProps {
    params:Promise<{documentId:string}>//newer next uses promise to resolve the params object
}

const DocumentId =  async ({params}:DocumentIdProps) => {
    const awaitedparams = await params;
    const documentId= awaitedparams.documentId;

    return (
        <div className="m-h-screen bg-[#FAFBFD]">
            <div className="flex flex-col px-4 pt-2 gap-y-2 fixed top-0 left-0 right-0 z-10 bg-[#fafbfd] print:hidden">
            <Navbar/>
            <Toolbar />
            </div>
            <div className="pt-[114px] print:pt-0">
            <Editor/>
            </div>
        </div>
      );
}
 
export default DocumentId;