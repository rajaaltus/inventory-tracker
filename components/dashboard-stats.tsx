"use client";

import { useQuery } from "convex/react";
import { api } from "@/src/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Legend,
    Tooltip,
} from "recharts";
import { Package, Monitor, CheckCircle2, AlertCircle, Trash2 } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const COLORS = {
    available: "#10b981", // emerald-500
    assigned: "#3b82f6",  // blue-500
    maintenance: "#f59e0b", // amber-500
    retired: "#6b7280",    // gray-500
};

export function DashboardStats() {
    const stats = useQuery(api.assets.getStats);

    if (stats === undefined) {
        return <StatsSkeleton />;
    }

    const chartData = [
        { name: "Available", value: stats.available, color: COLORS.available },
        { name: "Assigned", value: stats.assigned, color: COLORS.assigned },
        { name: "Maintenance", value: stats.maintenance, color: COLORS.maintenance },
        { name: "Retired", value: stats.retired, color: COLORS.retired },
    ].filter(d => d.value > 0);

    const cardItems = [
        {
            label: "Total Assets",
            value: stats.total,
            icon: Package,
            color: "text-foreground",
            bg: "bg-foreground/10",
        },
        {
            label: "Available",
            value: stats.available,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50",
        },
        {
            label: "Assigned",
            value: stats.assigned,
            icon: Monitor,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            label: "Maintenance",
            value: stats.maintenance,
            icon: AlertCircle,
            color: "text-amber-600",
            bg: "bg-amber-50",
        },
    ];

    const chartConfig = {
        available: { label: "Available", color: COLORS.available },
        assigned: { label: "Assigned", color: COLORS.assigned },
        maintenance: { label: "Maintenance", color: COLORS.maintenance },
        retired: { label: "Retired", color: COLORS.retired },
    };

    return (
        <div className="space-y-8 mb-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cardItems.map((item) => (
                    <Card key={item.label} className="border-border bg-card overflow-hidden">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                            <CardTitle className="font-heading text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                {item.label}
                            </CardTitle>
                            <div className={`${item.bg} p-1.5 rounded-md`}>
                                <item.icon className={`size-4 ${item.color}`} strokeWidth={2} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold tracking-tight">{item.value}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Card className="border-border bg-card">
                <CardHeader>
                    <CardTitle className="font-heading text-sm font-semibold">
                        Status Breakdown
                    </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px] w-full">
                    {chartData.length > 0 ? (
                        <ChartContainer config={chartConfig} className="h-full w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Tooltip content={<ChartTooltipContent hideLabel />} />
                                    <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {chartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Legend
                                        verticalAlign="bottom"
                                        height={36}
                                        iconType="circle"
                                        formatter={(value) => <span className="text-xs font-medium text-muted-foreground">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-lg">
                            <Package className="size-8 mb-2 opacity-20" />
                            <p className="text-sm">No data available to display</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function StatsSkeleton() {
    return (
        <div className="space-y-8 mb-8">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i} className="border-border bg-card overflow-hidden">
                        <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-8 rounded-md" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-10 w-16" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <Card className="border-border bg-card">
                <CardHeader>
                    <Skeleton className="h-5 w-32" />
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                    <Skeleton className="size-48 rounded-full" />
                </CardContent>
            </Card>
        </div>
    );
}
