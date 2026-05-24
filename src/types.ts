/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ThemeType = "prime" | "cyan" | "solar";

export interface LogEntry {
  id: string;
  timestamp: string;
  type: "system" | "neural" | "quantum" | "security";
  message: string;
}

export interface Node2D {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  connections: number[];
}

export interface ClusterStatus {
  name: string;
  region: string;
  latency: number;
  load: number;
  status: "nominal" | "active" | "standby";
}
