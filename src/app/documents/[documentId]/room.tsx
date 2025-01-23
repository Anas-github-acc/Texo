"use client";

import { ReactNode, use, useEffect, useMemo, useState } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";
import { FullscreenLoader } from "@/components/fullcreen-loader";
import { getUsers } from "./action";
import { toast } from "sonner";

type User={id:string, name:string, avatar:string}
export function Room({ children }: { children: ReactNode }) {
    const params=useParams();
    const [users,setUsers]=useState<User[]>([]);
    const fetchUser=useMemo(
      ()=>async()=>{
        try{
          const list=await getUsers();
          setUsers(list);
        }catch{
          toast.error("Failed to fetch users");
        }
      },
      [],
    )

    useEffect(()=>{
      fetchUser();
    },[fetchUser]);
  return (
    <LiveblocksProvider throttle={16} authEndpoint="/api/liveblocks-auth"
    resolveUsers={({userIds})=>{
      return userIds.map(
        (userId)=>users.find((user)=>user.id===userId)??undefined
      )
    }}
    resolveMentionSuggestions={({text})=>{
      let filteredUsers=users;

      if(text){
        filteredUsers=users.filter((user)=>user.name.toLowerCase().includes(text.toLowerCase()));
      }
      return filteredUsers.map((user)=>user.id);
    }}
    resolveRoomsInfo={()=>[]}>
      <RoomProvider id={params.documentId as string}>
        <ClientSideSuspense fallback={<FullscreenLoader label="Loading page..." />}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
