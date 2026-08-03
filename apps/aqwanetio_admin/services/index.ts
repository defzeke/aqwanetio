import type { NodesService } from "./nodes.service";
import { mockNodesService } from "./nodes.mock";

export type { NodesService } from "./nodes.service";
export { mockNodesService };

export const nodesService: NodesService = mockNodesService;
