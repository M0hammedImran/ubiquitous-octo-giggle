"use client";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileSpreadsheet, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { read, utils } from "xlsx";
import { EmployeeCard } from "./card";

export default function Component() {
	const [file, setFile] = useState<File | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [data, setData] = useState<Record<string, string>[]>([]);

	const onDrop = useCallback(async (acceptedFiles: File[]) => {
		if (acceptedFiles.length > 0) {
			const uploadedFile = acceptedFiles[0];
			if (
				uploadedFile.type ===
				"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
			) {
				setFile(uploadedFile);

				const wb = read(await uploadedFile.arrayBuffer());
				const ws = wb.Sheets[wb.SheetNames[0]]; // get the first worksheet
				const data = utils.sheet_to_json<Record<string, string>>(ws); // generate objects
				setData(data);

				setError(null);
			} else {
				setError("Please upload only .xlsx files");
			}
		}
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
				".xlsx",
			],
		},
		multiple: false,
	});

	const removeFile = () => {
		setFile(null);
	};

	return (
		<div className="flex flex-col min-h-screen">
			<header className="bg-white shadow-sm">
				<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between h-16">
						<div className="flex">
							<div className="flex-shrink-0 flex items-center">
								<FileSpreadsheet className="h-8 w-8 text-primary" />
								<span className="ml-2 text-xl font-bold text-primary">
									Excel Uploader
								</span>
							</div>
						</div>
					</div>
				</nav>
			</header>

			<main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8 py-12">
				{data.length === 0 && (
					<div className="max-w-3xl mx-auto">
						<h1 className="text-3xl font-bold text-center mb-8">
							Upload Your Excel File
						</h1>
						<div
							{...getRootProps()}
							className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
								isDragActive
									? "border-primary bg-primary/10"
									: "border-gray-300 hover:border-primary"
							}`}
						>
							<input {...getInputProps()} />
							{file ? (
								<div className="flex items-center justify-center space-x-4">
									<FileSpreadsheet className="h-8 w-8 text-primary" />
									<span className="text-lg">{file.name}</span>
									<Button
										variant="ghost"
										size="icon"
										onClick={(e) => {
											e.stopPropagation();
											removeFile();
										}}
									>
										<X className="h-5 w-5 text-muted-foreground" />
									</Button>
								</div>
							) : (
								<div>
									<Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
									<p className="text-lg mb-2">
										Drag and drop your Excel file here, or click to select
									</p>
									<p className="text-sm text-muted-foreground">
										Only .xlsx files are accepted
									</p>
								</div>
							)}
						</div>
						{error && <p className="mt-2 text-sm text-red-600">{error}</p>}
						{file && (
							<div className="mt-4 text-center">
								<Button onClick={() => console.log("Process file:", file)}>
									Process File
								</Button>
							</div>
						)}
					</div>
				)}

				<div className="grid gap-6">
					{data.map((d, index) => (
						<EmployeeCard
							key={index}
							index={index}
							total={data.length}
							details={d}
						/>
					))}
				</div>
			</main>

			<footer className="bg-muted mt-auto">
				<div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
					<p className="text-center text-sm text-muted-foreground">
						&copy; {new Date().getFullYear()} Excel Uploader. All rights
						reserved.
					</p>
				</div>
			</footer>
		</div>
	);
}
