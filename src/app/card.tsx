import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface EmployeeCardProps {
	details: Record<string, string>;
	index: number;
	total: number;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({
	details,
	index,
	total,
}) => {
	return (
		<Card className="w-full max-w-3xl mx-auto">
			<CardHeader>
				<div className="flex justify-between items-center">
					<h3 className="text-lg font-semibold text-primary">
						Employee {index + 1} of {total}
					</h3>
				</div>
			</CardHeader>
			<CardContent className="py-4">
				<dl className="space-y-4 divide-y">
					{Object.entries(details).map((detail, index) => (
						<div key={index} className="flex items-center py-1">
							<dt className="flex items-center w-1/3 text-sm font-medium text-muted-foreground">
								<span className="ml-2">{detail[0]}</span>
							</dt>
							<dd className="w-2/3 text-sm text-wrap ">{detail[1]}</dd>
						</div>
					))}
				</dl>
			</CardContent>
		</Card>
	);
};
