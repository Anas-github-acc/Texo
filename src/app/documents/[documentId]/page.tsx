import { auth } from "@clerk/nextjs/server";
import { Id } from "../../../../convex/_generated/dataModel";
import { Document } from "./document";

import {preloadQuery} from "convex/nextjs"

import { api } from "../../../../convex/_generated/api";

interface DocumentIdProps {
    params:Promise<{documentId:Id<"documents">}>//newer next uses promise to resolve the params object
}

const DocumentIdPage =  async ({params}:DocumentIdProps) => {
    const awaitedparams = await params;
    const documentId= awaitedparams.documentId;
    const {getToken}=await auth();
    const token=await getToken({template:'convex'})??undefined;
    if(!token){
        throw new Error("Token not found");
    }

    const Preloadeddocument=await preloadQuery(
        api.documents.getById,
        {id:documentId},
        {token}
    )

    if(!Preloadeddocument){
        throw new Error("Document not found");
    }
    return <Document predocument={Preloadeddocument}/>;
}
 
export default DocumentIdPage;