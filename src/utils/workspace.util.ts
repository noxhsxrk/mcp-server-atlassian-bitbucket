import { Logger } from './logger.util.js';
import { config } from './config.util.js';

const workspaceLogger = Logger.forContext('utils/workspace.util.ts');

let cachedDefaultWorkspace: string | null = null;

/**
 * Get the default workspace slug from the BITBUCKET_DEFAULT_WORKSPACE env var.
 *
 * NOTE: Bitbucket removed all cross-workspace listing APIs (CHANGE-2770, April 2026).
 * Workspace auto-discovery via API is no longer possible.
 * You MUST set BITBUCKET_DEFAULT_WORKSPACE to your workspace slug.
 *
 * @returns {Promise<string|null>} The workspace slug or null if not configured
 */
export async function getDefaultWorkspace(): Promise<string | null> {
	const methodLogger = workspaceLogger.forMethod('getDefaultWorkspace');

	if (cachedDefaultWorkspace) {
		methodLogger.debug(
			`Using cached default workspace: ${cachedDefaultWorkspace}`,
		);
		return cachedDefaultWorkspace;
	}

	const envWorkspace = config.get('BITBUCKET_DEFAULT_WORKSPACE');
	if (envWorkspace) {
		methodLogger.debug(
			`Using default workspace from environment: ${envWorkspace}`,
		);
		cachedDefaultWorkspace = envWorkspace;
		return envWorkspace;
	}

	methodLogger.warn(
		'BITBUCKET_DEFAULT_WORKSPACE is not set. ' +
			'Bitbucket removed cross-workspace listing APIs (CHANGE-2770). ' +
			'Set BITBUCKET_DEFAULT_WORKSPACE=<your-workspace-slug> in your environment. ' +
			'Your workspace slug is the part after bitbucket.org/ in your workspace URL, ' +
			'e.g. "nox" from https://bitbucket.org/nox/workspace/overview/',
	);
	return null;
}
