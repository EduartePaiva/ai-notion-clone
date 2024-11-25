"use client";

import { useState, useTransition } from "react";

import { LanguagesIcon } from "lucide-react";
import { Doc } from "yjs";

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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

type TranslateDocumentProps = {
  doc: Doc;
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
    startTransition(async () => {});
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
            Select a Language and AI will translate a summary of the document in
            the selected language.
          </DialogDescription>
          <hr className="mt-5" />
          {question ?? <p className="mt-5 text-gray-500">Q: {question}</p>}
        </DialogHeader>
        <Select value={language} onValueChange={(v) => setLanguage(v)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a Language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang} className="capitalize" value={lang}>
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
          >
            {isPending ? "Translating..." : "Translate"}
          </Button>
          <Button onClick={() => setIsOpen(false)} variant={"secondary"}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
