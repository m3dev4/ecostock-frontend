import { Card, CardContent } from '@/components/ui/card';

const CardHead = ({ title, quantity, capacity, icon: Icon }) => {
  return (
    <Card className="rounded-xl border border-border bg-card transition-colors hover:border-primary/40">
      <CardContent className="p-5">
        <div className="flex items-center gap-4">
          {Icon && (
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg`}
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
      </CardContent>
    </Card>
  );
};

export default CardHead;