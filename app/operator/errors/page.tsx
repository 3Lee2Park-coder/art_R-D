"use client";

import { useApp } from "@/components/providers";
import { Frame, PageTitle } from "@/components/ui";
import { formatStamp } from "@/lib/format";

export default function ErrorsPage() {
  const { errors } = useApp();
  return (
    <Frame width="utility">
      <PageTitle title="오류와 수정 이력" />
      <ul className="border-t border-hairline">
        {errors.map((item) => (
          <li key={item.id} className="border-b border-hairline py-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-[17px] font-semibold">{item.area}</h2>
              <span className="text-[14px] text-mute">{item.status}</span>
            </div>
            <p className="mt-1">{item.summary}</p>
            <p className="text-[14px] text-mute">{formatStamp(item.at)}</p>
          </li>
        ))}
      </ul>
    </Frame>
  );
}
