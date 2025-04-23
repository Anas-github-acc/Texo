"use client";

import { useMutation } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import{
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogFooter,
    DialogTrigger,
    DialogTitle
} from "./ui/dialog";
import { api } from "../../convex/_generated/api";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

 interface RenameDialogProps {
    documentId:Id<"documents">;
    initialTitle:string;
    children:React.ReactNode;
    
}

export const RenameDialog=({documentId,initialTitle,children}:RenameDialogProps)=>{
    const update=useMutation(api.documents.update);
    const[isUpdating,setIsUpdating]=useState(false);

    const[title,setTitle]=useState(initialTitle);
    const [isOpened,setIsOpened]=useState(false);

    const onSubmit=(e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    setIsUpdating(true);
    update({id:documentId,title:title.trim()||"Untitled"})
    .then(()=>setIsOpened(false))
    .finally(()=>{
        setIsUpdating(false);
        
    })}
return(
   <Dialog open={isOpened} onOpenChange={setIsOpened}>
    <DialogTrigger asChild>
    {children}
    </DialogTrigger>
    <DialogContent onClick={(e: React.MouseEvent<HTMLDivElement>)=>e.stopPropagation()}>
        <form onSubmit={onSubmit}>
        <DialogHeader>
            <DialogTitle>Rename document</DialogTitle>
            <DialogDescription>Enter a new name for document</DialogDescription>
        </DialogHeader>
        <div className="my-4">
            <Input
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setTitle(e.target.value)}
            placeholder="Document Name"
            onClick={(e: React.MouseEvent<HTMLInputElement>)=>e.stopPropagation()}/>
        </div>
        <DialogFooter>
            <Button
            type="button"
            variant='ghost'
            disabled={isUpdating}
            onClick={(e: React.MouseEvent<HTMLButtonElement>)=>{
                e.stopPropagation();
                setIsOpened(false);
            }}>Cancel</Button>
            <Button
            type="submit"
            disabled={isUpdating}
            onClick={(e: React.MouseEvent<HTMLButtonElement>)=>{
                e.stopPropagation();
            }}>Save</Button>
        </DialogFooter>
        </form>
    </DialogContent>
   </Dialog>
)
}
