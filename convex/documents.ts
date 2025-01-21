import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { paginationOptsValidator } from "convex/server";

export const create=mutation({
  args:{title:v.optional(v.string()),initialContent:v.optional(v.string())},
  handler:async (ctx,args)=>{
    const user=await ctx.auth.getUserIdentity();
    
    if(!user){
      throw new ConvexError("unauthorized You must be logged in to create a document");
    }
    const organizationId=(user.organization_id??undefined)as|string|undefined;
    return await ctx.db.insert("documents",{
      title:args.title?? "Untitled document",
      ownerId:user.subject,
      organizationId,
      initialContent:args.initialContent,
    });

   
  },
})
export const get = query({
  args:{paginationOpts:paginationOptsValidator,search:v.optional(v.string())},
  handler: async (ctx ,{search,paginationOpts}) => {
    const user=await ctx.auth.getUserIdentity();

    if(!user){
      throw new ConvexError("unauthorized You must be logged in to view documents");
    }
    const organizationId=(user.organization_id??undefined)as|string|undefined;

    // if search and organizationId are provided, search for documents with the organizationId
    if(search&&organizationId){
      return await ctx.db
      .query("documents")
      .withSearchIndex("search_title",(q)=>q.search("title",search).eq("organizationId",organizationId)).paginate(paginationOpts)
    }

    // All documents inside an organization
    if(organizationId){
      return await ctx.db.query("documents")
      .withIndex("by_organization_id",(q)=>q.eq("organizationId",organizationId))
      .paginate(paginationOpts);
    }

    // if search is provided, search for documents with the ownerId
    if(search){
      return await ctx.db.query("documents").withSearchIndex("search_title",(q)=>q.search("title",search).eq("ownerId",user.subject)).paginate(paginationOpts);
    }

    // All documents owned by the user
    return await ctx.db.query("documents")
    .withIndex("by_owner_id",(q)=>q.eq("ownerId",user.subject))
    .paginate(paginationOpts);
    // do something with `tasks`
  },
});

export const remove=mutation({
  args:{id:v.id("documents")},
  handler:async (ctx,args)=>{
    const user=await ctx.auth.getUserIdentity();

    if(!user){
      throw new ConvexError("unauthorized You must be logged in to delete a document");
    }
    const document=await ctx.db.get(args.id);
    if(!document){
      throw new ConvexError("Document not found");


    }

    const isOwner=document.ownerId===user.subject;
    if(!isOwner){
      throw new ConvexError("unauthorized ");

   
    }
    return await ctx.db.delete(args.id);
  }
})

export const update=mutation({
  args:{id:v.id("documents"),title:v.string()},
  handler:async (ctx,args)=>{
    const user=await ctx.auth.getUserIdentity();

    if(!user){
      throw new ConvexError("unauthorized You must be logged in to delete a document");
    }
    const document=await ctx.db.get(args.id);
    if(!document){
      throw new ConvexError("Document not found");


    }

    const isOwner=document.ownerId===user.subject;
    if(!isOwner){
      throw new ConvexError("unauthorized ");

   
    }
    return await ctx.db.patch(args.id ,{title:args.title});
  }
})