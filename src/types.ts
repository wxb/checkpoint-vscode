export interface Checkpoint {
  id: string;
  filePath: string;
  line: number;
  message: string;
  branch: string;
  author: string;
  createdAt: string;
}

export interface CheckpointData {
  checkpoints: Checkpoint[];
}
