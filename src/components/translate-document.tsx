import { useState, useTransition } from "react";

import { BotIcon, LanguagesIcon } from "lucide-react";
import Markdown from "react-markdown";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { YJSDoc } from "./editor";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "./ui/select";

type TranslateDocumentProps = {
    doc: YJSDoc;
};

const languages = [
    "english",
    "spanish",
    "portuguese",
    "french",
    "german",
    "chinese",
    "arabic",
    "hindi",
    "russian",
    "japanese",
] as const;

export default function TranslateDocument({ doc }: TranslateDocumentProps) {
    const [open, setIsOpen] = useState(false);
    const [language, setLanguage] = useState("");
    const [summary, setSummary] = useState("");
    const [question, setQuestion] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleAskQuestion = () => {
        startTransition(async () => {
            const documentData = doc.get("document-store").toJSON();

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BASE_URL}/translateDocument`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        documentData,
                        targetLang: language,
                    }),
                }
            );

            if (res.ok) {
                const { translated_text } = await res.json();

                setSummary(translated_text);
                toast.success("Translated Summary successfully!");
            }
        });
    };
    return (
        <Dialog open={open} onOpenChange={setIsOpen}>
            <Button asChild variant={"outline"}>
                <DialogTrigger>
                    {" "}
                    <LanguagesIcon />
                    Translate
                </DialogTrigger>
            </Button>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Translate the Document</DialogTitle>
                    <DialogDescription>
                        Select a Language and AI will translate a summary of the
                        document in the selected language.
                    </DialogDescription>
                    <hr className="mt-5" />
                    {question ?? (
                        <p className="mt-5 text-gray-500">Q: {question}</p>
                    )}
                </DialogHeader>
                {summary && (
                    <div className="flex max-h-96 flex-col items-start gap-2 overflow-y-scroll bg-gray-100 p-5">
                        <div className="flex">
                            <BotIcon className="w-10 flex-shrink-0" />
                            <p className="font-bold">
                                GPT {isPending ? "is thinking..." : "Says:"}
                            </p>
                        </div>
                        <p>
                            {isPending ? (
                                "Thinking..."
                            ) : (
                                <Markdown>{summary}</Markdown>
                            )}
                        </p>
                    </div>
                )}

                <Select value={language} onValueChange={(v) => setLanguage(v)}>
                    <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a Language" />
                    </SelectTrigger>
                    <SelectContent>
                        {languages.map((lang) => (
                            <SelectItem
                                key={lang}
                                className="capitalize"
                                value={lang}
                            >
                                {lang}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <DialogFooter>
                    <Button
                        type="button"
                        variant={"default"}
                        disabled={!language || isPending}
                        onClick={handleAskQuestion}
                    >
                        {isPending ? "Translating..." : "Translate"}
                    </Button>
                    <Button
                        onClick={() => setIsOpen(false)}
                        variant={"secondary"}
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
