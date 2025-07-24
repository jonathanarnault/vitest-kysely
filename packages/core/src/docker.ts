import { exec } from "node:child_process";
import { randomUUID } from "node:crypto";

export async function execAsync(command: string): Promise<string> {
	return new Promise((resolve, reject) => {
		exec(command, (error, stdout, stderr) => {
			if (error) {
				reject(`Error: ${stderr}`);
			} else {
				resolve(stdout);
			}
		});
	});
}

export async function startContainer(
	image: string,
	options: { port: number; environment?: Record<string, string> } = {
		port: 5432,
		environment: {},
	},
): Promise<{ containerName: string; cleanUpContainer: () => Promise<void> }> {
	const containerName = randomUUID();

	const postBindings = `-p ${options.port}:5432`;
	const environment = [...Object.entries(options.environment || {})]
		.map(([key, value]) => `-e ${key}=${value}`)
		.join(" ");

	await execAsync(
		`docker run -d --name ${containerName} ${postBindings} ${environment} ${image}`,
	);

	return {
		containerName,
		async cleanUpContainer() {
			await execAsync(`docker stop ${containerName} `);
			await execAsync(`docker rm ${containerName} --volumes`);
		},
	};
}
