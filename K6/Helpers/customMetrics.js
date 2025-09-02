import { Trend, Rate, Counter } from "k6/metrics";

export const requestFailures = new Counter("request_failures");
export const iterationDuration = new Trend("custom_iteration_duration");
export const requestErrors = new Counter("request_errors");
