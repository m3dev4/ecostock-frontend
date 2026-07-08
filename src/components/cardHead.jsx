import { Card, CardContent } from '../components/ui/card';

const CardHead = ({ title }) => {
  return (
    <Card className="h-28 rounded-2xl border-0 bg-white shadow-sm">
      <CardContent className="flex h-full flex-col justify-center p-5">
        <p className="text-sm font-medium text-slate-500">{title}</p>
      </CardContent>
    </Card>
  );
};

export default CardHead;
