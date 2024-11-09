import { ArrowLeftCircle } from "lucide-react";

export default function Home() {
    return (
        <main className="flex animate-pulse items-center space-x-2">
            <ArrowLeftCircle className="h-12 w-12" />
            <h1 className="font-bold">
                Get started with creating a New Document
            </h1>
        </main>
    );
}
