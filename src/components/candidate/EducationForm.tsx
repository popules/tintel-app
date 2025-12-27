"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/lib/i18n-context";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, GraduationCap, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface Education {
    school: string;
    degree: string;
    start_date: string;
    end_date: string;
}

interface EducationFormProps {
    items: Education[];
    onChange: (items: Education[]) => void;
}

export function EducationForm({ items, onChange }: EducationFormProps) {
    const [newItem, setNewItem] = useState<Education>({
        school: "",
        degree: "",
        start_date: "",
        end_date: ""
    });
    const [isAdding, setIsAdding] = useState(false);
    const { t } = useTranslation();

    const handleAdd = () => {
        if (!newItem.school || !newItem.degree) return;
        onChange([...items, newItem]);
        setNewItem({ school: "", degree: "", start_date: "", end_date: "" });
        setIsAdding(false);
    };

    const handleRemove = (index: number) => {
        const newItems = [...items];
        newItems.splice(index, 1);
        onChange(newItems);
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Education</h3>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAdding(!isAdding)}
                    className="h-8 border-dashed border-white/20 hover:border-white/40"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Education
                </Button>
            </div>

            {/* List */}
            <div className="space-y-3">
                {items.map((item, i) => (
                    <Card key={i} className="bg-white/5 border-white/10 overflow-hidden">
                        <CardContent className="p-4 flex justify-between items-start gap-4">
                            <div className="space-y-1">
                                <h4 className="font-bold text-white flex items-center gap-2">
                                    <GraduationCap className="w-4 h-4 text-indigo-400" />
                                    {item.degree} <span className="text-muted-foreground font-normal">at {item.school}</span>
                                </h4>
                                <div className="text-xs text-muted-foreground flex items-center gap-2">
                                    <Calendar className="w-3 h-3" />
                                    {item.start_date} - {item.end_date}
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemove(i)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Empty State */}
            {items.length === 0 && !isAdding && (
                <div className="text-center py-6 border-2 border-dashed border-white/10 rounded-xl bg-white/5 text-muted-foreground text-sm">
                    No education added yet.
                </div>
            )}

            {/* Add Form */}
            {isAdding && (
                <Card className="bg-white/5 border-indigo-500/30">
                    <CardContent className="p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>School / University</Label>
                                <Input
                                    value={newItem.school}
                                    onChange={e => setNewItem({ ...newItem, school: e.target.value })}
                                    placeholder="e.g. KTH Royal Institute"
                                    className="bg-black/20 border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Degree / Field</Label>
                                <Input
                                    value={newItem.degree}
                                    onChange={e => setNewItem({ ...newItem, degree: e.target.value })}
                                    placeholder="e.g. MSc Computer Science"
                                    className="bg-black/20 border-white/10"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Year</Label>
                                <Input
                                    value={newItem.start_date}
                                    onChange={e => setNewItem({ ...newItem, start_date: e.target.value })}
                                    placeholder="YYYY"
                                    className="bg-black/20 border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>End Year</Label>
                                <Input
                                    value={newItem.end_date}
                                    onChange={e => setNewItem({ ...newItem, end_date: e.target.value })}
                                    placeholder="YYYY"
                                    className="bg-black/20 border-white/10"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>{t.common.cancel}</Button>
                            <Button type="button" onClick={handleAdd}>Add</Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
