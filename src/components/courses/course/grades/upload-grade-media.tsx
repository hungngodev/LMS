import { useToast } from "@/hooks/use-toast";
import { GradeMedia0Schema } from "@/models/cms/grade-media-0";
import { formatBytes } from "@/utils/bytes-to-megabytes";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import { X } from "lucide-react";
import { Where } from "payload/types";
import qs from "qs";
import { FC, useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UseFormSetValue } from "react-hook-form";
import { useQuery } from "react-query";
import { z } from "zod";

const fetchDocuments = async (endpoint: string) => {
	const resp = await fetch(endpoint);
	const body = await resp.json();
	const documents = z.array(GradeMedia0Schema).parse(body.docs);
	return documents;
};

const useDocuments = (documentsId: string[]) => {
	const query: Where = {
		id: { in: documentsId.join(",") }
	};
	const endpoint = `/api/gradesMedia${qs.stringify(
		{ where: query, depth: 0, limit: 1000, sort: "-updatedAt" },
		{ addQueryPrefix: true }
	)}`;
	const { data: documents } = useQuery(
		endpoint,
		async () => await fetchDocuments(endpoint)
	);
	return { documents };
};
export interface UploadGradeMediaProps {
	mode: "create" | "edit";
	courseId: string;
	assignmentId: string;
	submissionId: string;
	documentsId: string[];
	setValue: UseFormSetValue<{
		grade: string;
		documents?: string[];
		content?: string;
	}>;
}

export const UploadGradeMedia: FC<UploadGradeMediaProps> = ({
	mode,
	courseId,
	assignmentId,
	submissionId,
	documentsId,
	setValue
}) => {
	const { toast } = useToast();

	const [documents, setDocuments] = useState<
		(File & { hasUploaded?: boolean })[]
	>([]);

	const { documents: currentDocs } = useDocuments(documentsId);
	useEffect(() => {
		if (!currentDocs) return;
		const currentFiles = currentDocs.map((doc) => {
			const newFile = new File([""], doc.filename);
			Object.defineProperty(newFile, "size", { value: doc.filesize });
			Object.defineProperty(newFile, "hasUploaded", { value: true });
			return newFile;
		});
		setDocuments(currentFiles);
	}, [currentDocs]);

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			const newDocumentsId: string[] = await Promise.all(
				acceptedFiles.map(async (file) => {
					const formData = new FormData();
					formData.append("file", file);
					formData.append("course", courseId);
					formData.append("assignment", assignmentId);
					formData.append("submission", submissionId);
					toast({ title: `Uploading ${file.name}` });
					const resp = await fetch("/api/gradesMedia", {
						method: "POST",
						body: formData
					});
					toast({
						title: "Success",
						description: `${file.name} uploaded`
					});
					return (await resp.json()).doc.id;
				})
			);
			setValue("documents", [...documentsId, ...newDocumentsId]);
		},
		[assignmentId, courseId, documentsId, setValue, submissionId, toast]
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop
	});

	const onRemoveFile = useCallback(
		async (fileIndex: number) => {
			if (mode === "create") {
				toast({ title: "Removing file..." });
				try {
					const resp = await fetch(
						`/api/gradesMedia/${documentsId[fileIndex]}`,
						{
							method: "DELETE",
							headers: { "Content-Type": "application/json" }
						}
					);
					if (resp.status === 200)
						toast({
							title: "Success",
							description: "File Removed"
						});
					else
						toast({
							title: "Uh oh, something went wrong",
							description:
								"There was a problem in our system, please try again",
							variant: "destructive"
						});
				} catch (error) {
					console.error(error);
					toast({
						title: "Uh oh, something went wrong",
						description:
							"There was a problem in our system, please try again",
						variant: "destructive"
					});
				}
			}
			setValue(
				"documents",
				documentsId
					.slice(0, fileIndex)
					.concat(documentsId.slice(fileIndex + 1))
			);
		},
		[documentsId, mode, setValue, toast]
	);

	return (
		<div className="w-full flex flex-col space-y-4">
			{documents.length > 0 && (
				<div className="w-full">
					<ul
						role="list"
						className="divide-y divide-gray-100 rounded-md border border-gray-200"
					>
						{documents.map((file, i) => (
							<li
								className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6"
								key={i}
							>
								<div className="flex w-0 flex-1 items-center">
									<PaperClipIcon
										className="h-5 w-5 flex-shrink-0 text-gray-400"
										aria-hidden="true"
									/>
									<div className="ml-4 flex min-w-0 flex-1 gap-2">
										<span className="truncate font-medium">
											{file.name}
										</span>
										<span className="flex-shrink-0 text-gray-400">
											{formatBytes(file.size)}
										</span>
									</div>
									<button onClick={() => onRemoveFile(i)}>
										<X />
									</button>
								</div>
							</li>
						))}
					</ul>
				</div>
			)}
			<div {...getRootProps()}>
				<input {...getInputProps()} />
				<button className="relative block w-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
					<svg
						className="mx-auto h-12 w-12 text-gray-400"
						stroke="currentColor"
						fill="none"
						viewBox="0 0 48 48"
						aria-hidden="true"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6"
						/>
					</svg>
					<span className="mt-2 block text-sm font-semibold text-gray-900">
						Upload A File
					</span>
				</button>
			</div>
		</div>
	);
};
