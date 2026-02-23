import { io } from "socket.io-client";

// In production, the socket connects to the same host
// In development, it also connects to the same host (port 3000)
export const socket = io();
