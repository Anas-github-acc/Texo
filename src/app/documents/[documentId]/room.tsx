"use client";

import { ReactNode } from "react";
import {
  LiveblocksProvider,
  RoomProvider,
  ClientSideSuspense,
} from "@liveblocks/react/suspense";
import { useParams } from "next/navigation";

export function Room({ children }: { children: ReactNode }) {
    const params=useParams();
  return (
    <LiveblocksProvider publicApiKey={"pk_prod_qRMH5JhkabIXrF5KWWamamy08EL1Ld9RFzgbFF39awR06ftskDKr2IVsHlxQwZAU"}>
      <RoomProvider id={params.documentId as string}>
        <ClientSideSuspense fallback={<div>Loading…</div>}>
          {children}
        </ClientSideSuspense>
      </RoomProvider>
    </LiveblocksProvider>
  );
}
