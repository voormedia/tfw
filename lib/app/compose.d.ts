import { Next, Stack } from "../middleware";
import { Context } from "./context";
export default function compose(stack: Stack, context: Context): Next;
