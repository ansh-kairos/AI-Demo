import { Badge } from "@/components/ui/badge";

interface PriorityBadgeProps {
  label?: "urgent" | "medium" | "low";
  score?: number;
}

export default function PriorityBadge({ label, score }: PriorityBadgeProps) {
  if (!label) return null;

  const config = {
    urgent: { emoji: "\uD83D\uDD34", text: "Urgent", variant: "urgent" as const },
    medium: { emoji: "\uD83D\uDFE1", text: "Medium", variant: "medium" as const },
    low: { emoji: "\uD83D\uDFE2", text: "Low", variant: "low" as const },
  };

  const c = config[label];

  return (
    <Badge variant={c.variant} className="gap-1">
      <span>{c.emoji}</span>
      <span>{c.text}</span>
      {score !== undefined && <span className="opacity-70">({score})</span>}
    </Badge>
  );
}
