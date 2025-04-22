'use client'

import { useOthers ,useSelf} from "@liveblocks/react/suspense";
import { ClientSideSuspense } from "@liveblocks/react";
import { Separator } from "@/components/ui/separator";
const AVATAR_SIZE = 36;


export const Avatar=()=>{
return(
    <ClientSideSuspense fallback={null}> 
        <AvatarStacks/>
    </ClientSideSuspense>
)
}
const AvatarStacks=()=>{
    const user=useOthers();
    const currentUser=useSelf();

    if(user.length===0)return null;

    return(
        <>
        <div className="flex items-center">
            {currentUser&&(
                <div className="relative ml-2">
                    <Avatars src={currentUser.info.avatar} name="You"/>
                </div>
            )}
        </div>
        <div className="flex">
                {user.map(({connectionId,info})=>{
                    return(
                      <Avatars key={connectionId} src={info.avatar} name={info.name}/>
                    )
                })}
        </div>
        <Separator orientation="vertical" className="h-6"/>
        </>
    )
}
interface AvatarProps {
    src:string,
    name:string
}

const Avatars=({src,name}:AvatarProps)=>{
    return(
        <div 
        style={{width:AVATAR_SIZE,height:AVATAR_SIZE}}
        className="group -ml-2 flex shrink-0 place-content-center relative border-4 border-black rounded-full bg-red-400">
                <div className="opacity-0 group-hover:opacity-100 absolute top-full py-1 px-1 text-white text-xs rounded-lg mt-2.5 z-10 bg-black whitespace-nowrap transition-opacity">
                    {name}
                </div>
                <img
                alt={name}
                src={src}
                className="size-full rounded-full"/>
        </div>
    )
}
