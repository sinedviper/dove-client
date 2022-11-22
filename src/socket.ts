import { io } from "socket.io-client";

const URL = "ws://localhost:3001/graphql";
const socket = io(URL, { autoConnect: false });

export default socket;
