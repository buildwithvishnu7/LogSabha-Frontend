// ┌─────────────────────────────────────────────────────┐
// │  DATA SOURCE SWAP POINT                             │
// │                                                     │
// │  Now: live Public API (with static fallback).       │
// │  To go back to pure static: change "./api" → "./static".│
// └─────────────────────────────────────────────────────┘

export { getHomeData, getGlobalData, getParties } from "./api";
