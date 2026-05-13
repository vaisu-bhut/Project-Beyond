import type { ComponentType } from "react";

import P1Theory from "./phase-1/TheoryMap";
import P1Builds from "./phase-1/BuildBlock";
import P1Exit from "./phase-1/ExitCriteria";

import P2Theory from "./phase-2/TheoryMap";
import P2Builds from "./phase-2/BuildBlock";
import P2Exit from "./phase-2/ExitCriteria";

import P3Theory from "./phase-3/TheoryMap";
import P3Builds from "./phase-3/BuildBlock";
import P3Exit from "./phase-3/ExitCriteria";

import P4Theory from "./phase-4/TheoryMap";
import P4Builds from "./phase-4/BuildBlock";
import P4Exit from "./phase-4/ExitCriteria";

import P5Theory from "./phase-5/TheoryMap";
import P5Builds from "./phase-5/BuildBlock";
import P5Exit from "./phase-5/ExitCriteria";

import P6Theory from "./phase-6/TheoryMap";
import P6Builds from "./phase-6/BuildBlock";
import P6Exit from "./phase-6/ExitCriteria";

import P7Theory from "./phase-7/TheoryMap";
import P7Builds from "./phase-7/BuildBlock";
import P7Exit from "./phase-7/ExitCriteria";

import BATheory from "./bonus-a/TheoryMap";
import BABuilds from "./bonus-a/BuildBlock";
import BAExit from "./bonus-a/ExitCriteria";

import BBTheory from "./bonus-b/TheoryMap";
import BBBuilds from "./bonus-b/BuildBlock";
import BBExit from "./bonus-b/ExitCriteria";

import BCTheory from "./bonus-c/TheoryMap";
import BCBuilds from "./bonus-c/BuildBlock";
import BCExit from "./bonus-c/ExitCriteria";

export type SectionKey = "theory" | "builds" | "exit";

export const CONTENT: Record<string, Record<SectionKey, ComponentType>> = {
  "phase-1": { theory: P1Theory, builds: P1Builds, exit: P1Exit },
  "phase-2": { theory: P2Theory, builds: P2Builds, exit: P2Exit },
  "phase-3": { theory: P3Theory, builds: P3Builds, exit: P3Exit },
  "phase-4": { theory: P4Theory, builds: P4Builds, exit: P4Exit },
  "phase-5": { theory: P5Theory, builds: P5Builds, exit: P5Exit },
  "phase-6": { theory: P6Theory, builds: P6Builds, exit: P6Exit },
  "phase-7": { theory: P7Theory, builds: P7Builds, exit: P7Exit },
  "bonus-a": { theory: BATheory, builds: BABuilds, exit: BAExit },
  "bonus-b": { theory: BBTheory, builds: BBBuilds, exit: BBExit },
  "bonus-c": { theory: BCTheory, builds: BCBuilds, exit: BCExit },
};
