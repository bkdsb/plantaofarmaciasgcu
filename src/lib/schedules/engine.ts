import {
  addWeeks,
  eachWeekOfInterval,
  endOfWeek,
  formatISO,
  isBefore,
  startOfWeek,
  subDays
} from "date-fns";

import type { DutyStatus, ScheduleMode } from "@/types/domain";

export type RotationInput = {
  pharmacyIdsInOrder: number[];
  startWeekDate: Date;
  weeksCount: number;
  status?: DutyStatus;
  mode?: ScheduleMode;
};

export type GeneratedDuty = {
  pharmacyId: number;
  startsAt: string;
  endsAt: string;
  weekStart: string;
  weekEnd: string;
  mode: ScheduleMode;
  status: DutyStatus;
};

export function generateRotationalDuties(input: RotationInput): GeneratedDuty[] {
  const { pharmacyIdsInOrder, startWeekDate, weeksCount } = input;

  if (!pharmacyIdsInOrder.length) {
    throw new Error("Pharmacy list cannot be empty");
  }

  const status = input.status ?? "draft";
  const mode = input.mode ?? "automatic";

  const alignedStart = startOfWeek(startWeekDate, { weekStartsOn: 1 });
  const alignedEnd = addWeeks(alignedStart, weeksCount - 1);

  const weeks = eachWeekOfInterval(
    {
      start: alignedStart,
      end: alignedEnd
    },
    { weekStartsOn: 1 }
  );

  return weeks.map((weekStart, index) => {
    const weekEnd = endOfWeek(weekStart, { weekStartsOn: 1 });
    const pharmacyId = pharmacyIdsInOrder[index % pharmacyIdsInOrder.length];

    return {
      pharmacyId,
      startsAt: formatISO(weekStart),
      endsAt: formatISO(weekEnd),
      weekStart: formatISO(weekStart, { representation: "date" }),
      weekEnd: formatISO(weekEnd, { representation: "date" }),
      mode,
      status
    };
  });
}

export function reminderDateForFavoriteStart(startsAt: Date, daysBefore = 1) {
  return subDays(startsAt, daysBefore);
}

export function validateNoOverlappingIntervals(
  intervals: Array<{ startsAt: Date; endsAt: Date }>
): boolean {
  const sorted = [...intervals].sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime());

  for (let index = 1; index < sorted.length; index += 1) {
    if (isBefore(sorted[index].startsAt, sorted[index - 1].endsAt)) {
      return false;
    }
  }

  return true;
}
