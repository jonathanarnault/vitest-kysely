import { describe, expect, it } from "vitest";
import { execAsync, startContainer } from "./docker.js";

describe("startContainer", () => {
	it(
		"should start a Docker container and return a cleanup function",
		{
			timeout: 60_000, // Increase timeout for Docker operations
		},
		async () => {
			const image = "postgres:17.5";
			const port = 65432;

			const { containerName, cleanUpContainer } = await startContainer(image, {
				port,
				environment: {
					POSTGRES_USER: "vitest_kyselty",
					POSTGRES_PASSWORD: "s3cr3tP4ssw0rd",
					POSTGRES_DB: "vitest_kyselty_db",
				},
			});

			// Verify that the container is running
			const listContainersResult = await execAsync(
				`docker ps -q --filter "name=${containerName}"`,
			);
			expect(listContainersResult).not.toBe("");

			// Call the cleanup function
			await cleanUpContainer();

			// Verify that the container has been stopped and removed
			const stoppedContainersResult = await execAsync(
				`docker ps -q -a --filter "name=${containerName}"`,
			);
			expect(stoppedContainersResult).toBe("");
		},
	);
});
