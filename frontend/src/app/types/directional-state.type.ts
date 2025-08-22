export const DirectionalState = {
	Forward: "forward",
	Backward: "backward",
	Paused: "paused"
} as const;

export type DirectionalState = (typeof DirectionalState)[keyof typeof DirectionalState];
