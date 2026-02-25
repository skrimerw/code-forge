type Language = "javascript" | "python";

interface Output {
    stdout: string;
    stderr: string;
    code: number;
    time: number;
    timedOut: boolean
}

interface QueueJob {
    id: number;
    lang: Language;
    code: string;
}
