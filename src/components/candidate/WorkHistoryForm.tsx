"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Briefcase, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export interface WorkExperience {
    company: string;
    role: string;
    start_date: string;
    end_date: string;
    description: string;
}

interface WorkHistoryFormProps {
    items: WorkExperience[];
    onChange: (items: WorkExperience[]) => void;
}

export function WorkHistoryForm({ items, onChange }: WorkHistoryFormProps) {
    const [newItem, setNewItem] = useState<WorkExperience>({
        company: "",
        role: "",
        start_date: "",
        end_date: "",
        description: ""
    });
    const [isAdding, setIsAdding] = useState(false);

    const handleAdd = () => {
        if (!newItem.company || !newItem.role) return;
        onChange([...items, newItem]);
        setNewItem({ company: "", role: "", start_date: "", end_date: "", description: "" });
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
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Work History</h3>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setIsAdding(!isAdding)}
                    className="h-8 border-dashed border-white/20 hover:border-white/40"
                >
                    <Plus className="w-4 h-4 mr-2" /> Add Position
                </Button>
            </div>

            {/* List */}
            <div className="space-y-3">
                {items.map((item, i) => (
                    <Card key={i} className="bg-white/5 border-white/10 overflow-hidden">
                        <CardContent className="p-4 flex justify-between items-start gap-4">
                            <div className="space-y-1">
                                <h4 className="font-bold text-white flex items-center gap-2">
                                    <Briefcase className="w-4 h-4 text-indigo-400" />
                                    {item.role} <span className="text-muted-foreground font-normal">at {item.company}</span>
                                </h4>
                                <div className="text-xs text-muted-foreground flex items-center gap-2">
                                    <Calendar className="w-3 h-3" />
                                    {item.start_date} - {item.end_date || "Present"}
                                </div>
                                {item.description && (
                                    <p className="text-sm text-slate-300 mt-2 line-clamp-2">{item.description}</p>
                                )}
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
                    No work history added yet.
                </div>
            )}

            {/* Add Form */}
            {isAdding && (
                <Card className="bg-white/5 border-indigo-500/30">
                    <CardContent className="p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Role / Title</Label>
                                <Input
                                    value={newItem.role}
                                    onChange={e => setNewItem({ ...newItem, role: e.target.value })}
                                    placeholder="e.g. Senior Developer"
                                    className="bg-black/20 border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Company</Label>
                                <Input
                                    value={newItem.company}
                                    onChange={e => setNewItem({ ...newItem, company: e.target.value })}
                                    placeholder="e.g. Google"
                                    className="bg-black/20 border-white/10"
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Start Date</Label>
                                <Input
                                    value={newItem.start_date}
                                    onChange={e => setNewItem({ ...newItem, start_date: e.target.value })}
                                    placeholder="YYYY-MM"
                                    className="bg-black/20 border-white/10"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>End Date</Label>
                                <Input
                                    value={newItem.end_date}
                                    onChange={e => setNewItem({ ...newItem, end_date: e.target.value })}
                                    placeholder="YYYY-MM (or Present)"
                                    className="bg-black/20 border-white/10"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Description</Label>
                            <Textarea
                                value={newItem.description}
                                onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                                placeholder="Key achievements..."
                                className="bg-black/20 border-white/10"
                            />
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>Cancel</Button>
                            <Button type="button" onClick={handleAdd}>Add Position</Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
