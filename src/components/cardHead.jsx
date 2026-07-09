import { Card, CardContent } from '@/components/ui/card';

const CardHead = ({ title, quantity, capacity, icon: Icon }) => {
  const percentage = capacity
    ? Math.min(Math.round((quantity / capacity) * 100), 100)
    : null;

  const getStatusColor = () => {
    if (percentage === null)
      return { bar: 'bg-primary', icon: 'text-primary bg-primary/10' };
    if (percentage >= 80)
      return { bar: 'bg-red-500', icon: 'text-red-600 bg-red-50' };
    if (percentage >= 50)
      return { bar: 'bg-amber-500', icon: 'text-amber-600 bg-amber-50' };
    return { bar: 'bg-emerald-500', icon: 'text-emerald-600 bg-emerald-50' };
  };

  const status = getStatusColor();

  return (
    <Card className="rounded-xl border border-border bg-card transition-colors hover:border-primary/40">
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          {Icon && (
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${status.icon}`}
            >
              <Icon className="h-5 w-5" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground truncate">{title}</p>

            <div className="mt-0.5 flex items-baseline gap-1.5">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                {quantity ?? capacity}
              </h2>

              {capacity && quantity !== undefined && (
                <span className="text-sm text-muted-foreground">
                  / {capacity}
                </span>
              )}
            </div>
          </div>
        </div>

        {percentage !== null && (
          <div className="mt-4">
            <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full ${status.bar} transition-all duration-500`}
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="mt-1.5 text-xs text-muted-foreground">
              {percentage}% utilisé
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CardHead;