// --- User ---
export interface User {
  id: string;
  email: string | null;
  username: string;
  avatar_url: string | null;
  created_at: string;
}

// --- Canvas ---
export interface Canvas {
  id: string;
  owner_id: string;
  title: string;
  share_token: string;
  snapshot: Stroke[];
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

// --- Canvas Participant ---
export type ParticipantRole = 'owner' | 'guest';

export interface CanvasParticipant {
  id: string;
  canvas_id: string;
  user_id: string | null;
  role: ParticipantRole;
  nickname: string;
  joined_at: string;
  is_online: boolean;
  cursor_color: string;
}

// --- Stroke ---
export type DrawTool = 'pen' | 'eraser' | 'text' | 'image';

export interface StrokePoint {
  x: number;
  y: number;
}

export interface Stroke {
  id: string;
  canvas_id: string;
  user_id: string;
  path_data: StrokePoint[];
  color: string;
  width: number;
  tool: DrawTool;
  created_at: string;
}

// --- Canvas Asset ---
export type AssetType = 'image' | 'text';

export interface CanvasAsset {
  id: string;
  canvas_id: string;
  user_id: string;
  type: AssetType;
  storage_url: string;
  transform: {
    x: number;
    y: number;
    scale: number;
    rotation: number;
  };
  created_at: string;
}

// --- Socket Events ---
export interface ClientToServerEvents {
  join_canvas: (data: { canvasId: string; userId: string; nickname: string }) => void;
  leave_canvas: (data: { canvasId: string }) => void;
  stroke_start: (data: { canvasId: string; stroke: Stroke }) => void;
  stroke_continue: (data: { canvasId: string; strokeId: string; points: StrokePoint[] }) => void;
  stroke_end: (data: { canvasId: string; strokeId: string }) => void;
  cursor_move: (data: { canvasId: string; x: number; y: number }) => void;
  undo_stroke: (data: { canvasId: string; userId: string }) => void;
}

export interface ServerToClientEvents {
  participant_joined: (participant: CanvasParticipant) => void;
  participant_left: (data: { participantId: string; userId: string }) => void;
  participant_list: (participants: CanvasParticipant[]) => void;
  stroke_started: (stroke: Stroke) => void;
  stroke_continued: (data: { strokeId: string; points: StrokePoint[] }) => void;
  stroke_ended: (data: { strokeId: string }) => void;
  stroke_undone: (data: { userId: string; strokeId: string }) => void;
  cursor_moved: (data: { userId: string; x: number; y: number; nickname: string; color: string }) => void;
  canvas_deleted: () => void;
  snapshot_updated: (snapshot: Stroke[]) => void;
}

// --- Auth ---
export interface AuthSession {
  user: User;
  isGuest: boolean;
}
