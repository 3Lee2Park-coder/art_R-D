"use client";

import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { contractLabel } from "@/lib/labels";
import type { Gallery } from "@/lib/types";

const STATES: Gallery["contractState"][] = ["contracted", "uncontracted", "ended"];

export default function AccountsPage() {
  const app = useApp();
  return (
    <Frame width="utility">
      <PageTitle title="갤러리 계정" />
      <ul className="border-t border-hairline">
        {app.galleries.map((gallery) => (
          <li key={gallery.id} className="flex flex-col gap-3 border-b border-hairline py-4 min-[720px]:flex-row min-[720px]:items-center min-[720px]:justify-between">
            <div>
              <h2 className="text-[17px] font-semibold">{gallery.name}</h2>
              <p className="text-[14px] text-mute">
                {gallery.region} · {contractLabel(gallery.contractState)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {STATES.map((state) => (
                <button
                  key={state}
                  type="button"
                  className={gallery.contractState === state ? "btn btn-primary min-h-11 px-3" : "btn btn-secondary min-h-11 px-3"}
                  onClick={() => app.setContract(gallery.id, state)}
                >
                  {contractLabel(state)}
                </button>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </Frame>
  );
}
