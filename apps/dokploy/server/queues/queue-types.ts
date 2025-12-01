/**
 * Job data for deployment queue
 *
 * Contains all information needed to execute a deployment, including custom
 * titles and descriptions for tracking deployment history.
 */
type DeployJob =
	| {
			applicationId: string;
			/** Deployment title shown in UI (custom or default "Manual deployment"/"Rebuild deployment") */
			titleLog: string;
			/** Optional deployment description providing additional context */
			descriptionLog: string;
			server?: boolean;
			type: "deploy" | "redeploy";
			applicationType: "application";
			serverId?: string;
	  }
	| {
			composeId: string;
			/** Deployment title shown in UI (custom or default "Manual deployment"/"Rebuild deployment") */
			titleLog: string;
			/** Optional deployment description providing additional context */
			descriptionLog: string;
			server?: boolean;
			type: "deploy" | "redeploy";
			applicationType: "compose";
			serverId?: string;
	  }
	| {
			applicationId: string;
			/** Deployment title shown in UI (custom or default "Manual deployment"/"Rebuild deployment") */
			titleLog: string;
			/** Optional deployment description providing additional context */
			descriptionLog: string;
			server?: boolean;
			type: "deploy";
			applicationType: "application-preview";
			previewDeploymentId: string;
			serverId?: string;
	  };

/**
 * Deployment job type for Bull queue
 *
 * Supports custom titles and descriptions for all deployment types:
 * - Application deployments (deploy/redeploy)
 * - Compose service deployments (deploy/redeploy)
 * - Preview deployments
 *
 * @example
 * ```typescript
 * const job: DeploymentJob = {
 *   applicationId: "abc123",
 *   titleLog: "Hotfix: Fix login bug",
 *   descriptionLog: "Emergency fix for authentication issue",
 *   type: "deploy",
 *   applicationType: "application",
 *   server: false
 * };
 * ```
 */
export type DeploymentJob = DeployJob;
