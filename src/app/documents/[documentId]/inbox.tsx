'use client';

import { ClientSideSuspense } from "@liveblocks/react";
import { InboxNotification,InboxNotificationList } from "@liveblocks/react-ui";
import { useInboxNotifications } from "@liveblocks/react/suspense";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BellIcon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export const Inbox=()=>{
    return (
        <ClientSideSuspense fallback={
            <Button
            disabled
            variant={"ghost"}
            className="relative" size='icon'>
                <BellIcon className="size-5"/>
            </Button>
        }>
            <InboxMenu/>
        </ClientSideSuspense>
    )
}

const InboxMenu=()=>{
    const {inboxNotifications}=useInboxNotifications();
    return(
        <>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
            <Button
            variant={"ghost"}
            className="relative" size='icon'>
                <BellIcon className="size-5"/>
                {inboxNotifications?.length>0&&(
                    <span className="absolute -top-1 -right-1 size-4 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
                        {inboxNotifications.length}
                    </span>
                )}
            </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className="w-auto">
            {inboxNotifications.length>0?(
                            <InboxNotificationList>
                                {inboxNotifications.map((notification)=>(
                                    <InboxNotification
                                    key={notification.id}
                                    inboxNotification={notification}/>
                                ))}
                            </InboxNotificationList>

                        ):(
                            <div className="text-muted-foreground text-center p-2 w-[400px] text-sm">
                                No Notification
                            </div>
                        )}
            </DropdownMenuContent>
        </DropdownMenu>
        <Separator orientation="vertical" className="h-6"/>
        </>
    );
};