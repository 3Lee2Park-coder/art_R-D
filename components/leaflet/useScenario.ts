"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import {
  DEFAULT_SCENARIO,
  isScenarioId,
  type ScenarioId,
} from "@/lib/leaflet/mockRecognition";
import { SESSION } from "@/lib/storage";

/** 주소 ?scenario= 를 SESSION에 두고 반환. 화면에는 이름을 보이지 않는다. */
export function useScenario(): ScenarioId {
  const search = useSearchParams();
  const fromQuery = search.get("scenario");
  const stored =
    typeof sessionStorage !== "undefined" ? sessionStorage.getItem(SESSION.scenario) : null;
  const id = isScenarioId(fromQuery)
    ? fromQuery
    : isScenarioId(stored)
      ? stored
      : DEFAULT_SCENARIO;

  useEffect(() => {
    if (isScenarioId(fromQuery)) {
      sessionStorage.setItem(SESSION.scenario, fromQuery);
    } else if (!sessionStorage.getItem(SESSION.scenario)) {
      sessionStorage.setItem(SESSION.scenario, DEFAULT_SCENARIO);
    }
  }, [fromQuery]);

  return id;
}

export function scenarioQuerySuffix(search: URLSearchParams | { toString(): string }): string {
  const qs = typeof search.toString === "function" ? search.toString() : "";
  return qs ? `?${qs}` : "?from=qr";
}
