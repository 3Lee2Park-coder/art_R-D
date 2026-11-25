import type { ParsedArtworkRow } from "@/lib/studio/parseArtworkCsv";
import type { ExhibitionGoals, ExhibitionZone } from "@/lib/types";

export type WizardDraft = {
  step: 1 | 2 | 3 | 4;
  title: string;
  venue: string;
  startDate: string;
  endDate: string;
  description: string;
  objectives: string[];
  targets: ExhibitionGoals["targets"];
  posterDataUrl: string | null;
  posterName: string | null;
  works: ParsedArtworkRow[];
  floorPlanDataUrl: string | null;
  zones: Omit<ExhibitionZone, "exhibitionId">[];
};

export function emptyWizardDraft(): WizardDraft {
  return {
    step: 1,
    title: "",
    venue: "",
    startDate: "",
    endDate: "",
    description: "",
    objectives: [],
    targets: { records: null, interests: null, inquiries: null },
    posterDataUrl: null,
    posterName: null,
    works: [],
    floorPlanDataUrl: null,
    zones: [],
  };
}
