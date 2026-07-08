import { Card, CardContent } from '@/components/ui/card';

const CardHead = ({ title, quantity, capacity, icon: Icon }) => {
  return (
    <Card className="border border-slate-200/70 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{title}</p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
              {quantity}
            </h2>

            {capacity && (
              <h2 className="mt-1 text-3xl font-bold">{capacity}</h2>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardHead;
