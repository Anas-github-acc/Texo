import { auth } from "@clerk/nextjs/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET() {
  const { sessionClaims } = await auth();
  
  if (!sessionClaims?.userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const documents = await convex.query(api.documents.get, {
      search: undefined,
      paginationOpts: { numItems: 10, cursor: null }
    });
    
    return Response.json(documents);
  } catch (error) {
    return Response.json({ error: error }, { status: 500 });
  }
}

