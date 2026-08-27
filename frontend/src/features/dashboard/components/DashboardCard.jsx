import { Card } from "@/components/ui/card";

export default function DashboardCard({
  title,
  value,
  icon: Icon,
}) {
  return (
    <Card
      className="
        p-6
        rounded-3xl
        border-0
        shadow-sm
        hover:shadow-xl
        hover:-translate-y-1
        transition-all
        duration-300
        cursor-pointer
      "
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">
            {title}
          </p>

          <h2 className="text-3xl font-semibold mt-2">
            {value}
          </h2>
        </div>

        <div className="bg-gray-100 p-4 rounded-2xl">
          <Icon size={28} />
        </div>
      </div>
    </Card>
  );
}