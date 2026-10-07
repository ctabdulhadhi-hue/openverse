import type { MissionDefinition } from "./MissionTypes";

export interface MissionValidationError {
  missionId: string;
  field: string;
  message: string;
}

/**
 * MissionRegistry.
 *
 * Central catalog of all registered missions in OPENVERSE.
 * Validates mission schema and objective structures at registration time.
 */
export class MissionRegistry {
  private missions = new Map<string, MissionDefinition>();
  private npcIndex = new Map<string, string[]>(); // npcId -> missionId[]

  public register(mission: MissionDefinition): void {
    if (this.missions.has(mission.id)) {
      throw new Error(`[MissionRegistry] Duplicate mission ID: "${mission.id}"`);
    }

    const errors = this.validateMission(mission);
    if (errors.length > 0) {
      const errList = errors.map((e) => `${e.field}: ${e.message}`).join("; ");
      throw new Error(`[MissionRegistry] Invalid mission "${mission.id}": ${errList}`);
    }

    this.missions.set(mission.id, mission);

    // Index by giver NPC ID
    const existing = this.npcIndex.get(mission.giverNpcId) ?? [];
    existing.push(mission.id);
    this.npcIndex.set(mission.giverNpcId, existing);
  }

  public get(id: string): MissionDefinition | undefined {
    return this.missions.get(id);
  }

  public getByGiverNpcId(npcId: string): MissionDefinition[] {
    const ids = this.npcIndex.get(npcId);
    if (!ids) return [];
    return ids.map((id) => this.missions.get(id)!).filter(Boolean);
  }

  public getAll(): MissionDefinition[] {
    return Array.from(this.missions.values());
  }

  public getCount(): number {
    return this.missions.size;
  }

  public clear(): void {
    this.missions.clear();
    this.npcIndex.clear();
  }

  public validateMission(mission: MissionDefinition): MissionValidationError[] {
    const errors: MissionValidationError[] = [];

    if (!mission.id || mission.id.trim() === "") {
      errors.push({ missionId: mission.id, field: "id", message: "Missing mission ID" });
    }

    if (!mission.title || mission.title.trim() === "") {
      errors.push({ missionId: mission.id, field: "title", message: "Missing mission title" });
    }

    if (!mission.giverNpcId || mission.giverNpcId.trim() === "") {
      errors.push({
        missionId: mission.id,
        field: "giverNpcId",
        message: "Missing giver NPC ID",
      });
    }

    if (!mission.objectives || mission.objectives.length === 0) {
      errors.push({
        missionId: mission.id,
        field: "objectives",
        message: "Mission must have at least one objective",
      });
    } else {
      const seenObjectiveIds = new Set<string>();
      mission.objectives.forEach((obj, idx) => {
        if (!obj.id || obj.id.trim() === "") {
          errors.push({
            missionId: mission.id,
            field: `objectives[${idx}].id`,
            message: "Missing objective ID",
          });
        } else if (seenObjectiveIds.has(obj.id)) {
          errors.push({
            missionId: mission.id,
            field: `objectives[${idx}].id`,
            message: `Duplicate objective ID "${obj.id}"`,
          });
        }
        seenObjectiveIds.add(obj.id);

        if (!obj.title || obj.title.trim() === "") {
          errors.push({
            missionId: mission.id,
            field: `objectives[${idx}].title`,
            message: "Missing objective title",
          });
        }

        if (obj.type === "REACH" && !obj.target?.position) {
          errors.push({
            missionId: mission.id,
            field: `objectives[${idx}].target.position`,
            message: "REACH objective requires target position",
          });
        }
      });
    }

    return errors;
  }
}

export const missionRegistry = new MissionRegistry();
