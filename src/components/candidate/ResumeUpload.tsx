"use client";

import { useState, useCallback } from "react";
import { Upload, FileText, Loader2, CheckCircle2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { parseResume } from "@/app/actions/ai";

interface ResumeUploadProps {
    onparsed: (data: any) => void;
}

export function ResumeUpload({ onparsed }: ResumeUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDragActive, setIsDragActive] = useState(false);

    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        const file = acceptedFiles[0];
        if (!file) return;

        if (file.type !== "application/pdf") {
            toast.error("Please upload a PDF file.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            toast.error("File is too large (Max 5MB).");
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append("resume", file);

        try {
            const result = await parseResume(formData);

            if (result.success && result.data) {
                toast.success("Resume parsed successfully! Auto-filling profile...");
                onparsed(result.data);
            } else {
                toast.error(result.error || "Failed to parse resume.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong parsing your resume.");
        } finally {
            setIsUploading(false);
        }
    }, [onparsed]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { 'application/pdf': ['.pdf'] },
        maxFiles: 1,
        onDragEnter: () => setIsDragActive(true),
        onDragLeave: () => setIsDragActive(false),
        disabled: isUploading
    });

    return (
        <div
            {...getRootProps()}
            className={cn(
                "border-2 border-dashed rounded-xl p-8 transition-all duration-200 cursor-pointer text-center group",
                isDragActive ? "border-indigo-500 bg-indigo-500/5 scale-[1.02]" : "border-white/10 hover:border-white/20 hover:bg-white/5",
                isUploading && "pointer-events-none opacity-50"
            )}
        >
            <input {...getInputProps()} />

            <div className="flex flex-col items-center gap-4">
                <div className={cn(
                    "h-12 w-12 rounded-full flex items-center justify-center transition-colors",
                    isDragActive ? "bg-indigo-500/20" : "bg-white/5 group-hover:bg-white/10"
                )}>
                    {isUploading ? (
                        <Loader2 className="h-6 w-6 text-indigo-400 animate-spin" />
                    ) : (
                        <FileText className={cn("h-6 w-6", isDragActive ? "text-indigo-400" : "text-muted-foreground")} />
                    )}
                </div>

                <div className="space-y-1">
                    <h3 className="font-semibold text-white">
                        {isUploading ? "Analyzing Resume..." : "Drop your Resume PDF here"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        {isUploading
                            ? "AI is extracting your bio, skills, and experience."
                            : "We'll auto-fill your profile instantly."}
                    </p>
                </div>

                {!isUploading && (
                    <Button variant="secondary" size="sm" className="mt-2 pointer-events-none">
                        <Upload className="mr-2 h-4 w-4" />
                        Select PDF
                    </Button>
                )}
            </div>
        </div>
    );
}
