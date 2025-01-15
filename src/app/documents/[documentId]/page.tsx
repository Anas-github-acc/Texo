import { Editor } from "./editor";

interface DocumentIdProps {
    params:Promise<{documentId:string}>//newer next uses promise to resolve the params object
}

const DocumentId =  async ({params}:DocumentIdProps) => {
    const awaitedparams = await params;
    const documentId= awaitedparams.documentId;

    return (
        <div className="m-h-screen bg-[#FAFBFD]">
            <Editor/>
        </div>
      );
}
 
export default DocumentId;