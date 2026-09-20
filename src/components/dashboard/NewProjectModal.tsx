import React, { useEffect, useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import type { Project } from "../../types/project";
import { cn } from "../../lib/utils";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: Partial<Project>) => void;
}

const environmentOptions = [
  {
    value: "production",
    label: "Production",
    region: "us-east-1",
  },
  {
    value: "staging",
    label: "Staging",
    region: "us-west-2",
  },
  {
    value: "eu-production",
    label: "Production",
    region: "eu-central-1",
  },
] as const;

const createSlug = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
}) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [environment, setEnvironment] = useState("production");
  const [description, setDescription] = useState("");
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) return;

    setName("");
    setSlug("");
    setEnvironment("production");
    setDescription("");
    setSlugManuallyEdited(false);
    setError("");
  }, [isOpen]);

  const handleNameChange = (value: string) => {
    setName(value);
    setError("");

    if (!slugManuallyEdited) {
      setSlug(createSlug(value));
    }
  };

  const handleSlugChange = (value: string) => {
    setSlugManuallyEdited(true);
    setSlug(createSlug(value));
    setError("");
  };

  const handleCreate = () => {
    const trimmedName = name.trim();
    const generatedSlug = createSlug(slug);

    if (!trimmedName) {
      setError("Project name is required.");
      return;
    }

    if (!generatedSlug) {
      setError("Enter a valid endpoint slug.");
      return;
    }

    onCreateProject({
      name: trimmedName,
      slug: generatedSlug,
      environment,
      description: description.trim() || "Microservice gateway endpoint.",
    });

    onClose();
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleCreate();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      description="Add a project to organize API traffic and gateway telemetry."
      footer={
        <div className="flex w-full items-center justify-end gap-2">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>

          <Button variant="primary" size="sm" onClick={handleCreate}>
            Create Project
          </Button>
        </div>
      }
    >
      <form id="new-project-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Project name */}
        <div>
          <label
            htmlFor="project-name"
            className="mb-1.5 block text-[12px] font-medium text-text-primary"
          >
            Project Name
          </label>

          <Input
            id="project-name"
            type="text"
            value={name}
            onChange={(event) => handleNameChange(event.target.value)}
            placeholder="e.g. Billing Microservice"
            aria-describedby="project-name-help project-form-error"
            aria-invalid={Boolean(error)}
          />

          <p
            id="project-name-help"
            className="mt-1.5 text-[11px] leading-4 text-text-secondary"
          >
            Use a clear name that identifies the service or API.
          </p>
        </div>

        {/* Endpoint slug */}
        <div>
          <label
            htmlFor="project-slug"
            className="mb-1.5 block text-[12px] font-medium text-text-primary"
          >
            Endpoint Slug
          </label>

          <Input
            id="project-slug"
            type="text"
            value={slug}
            onChange={(event) => handleSlugChange(event.target.value)}
            placeholder="billing-svc"
            className="font-code-inline"
            aria-describedby="project-slug-help project-form-error"
            aria-invalid={Boolean(error)}
          />

          <p
            id="project-slug-help"
            className="mt-1.5 text-[11px] leading-4 text-text-secondary"
          >
            Used as the project identifier in API routes and telemetry.
          </p>
        </div>

        {/* Environment */}
        <div>
          <label
            htmlFor="project-environment"
            className="mb-1.5 block text-[12px] font-medium text-text-primary"
          >
            Environment
          </label>

          <select
            id="project-environment"
            value={environment}
            onChange={(event) => setEnvironment(event.target.value)}
            className={cn(
              "h-8 w-full rounded-md border border-border-default bg-surface px-3 text-[12px] text-text-primary",
              "transition-colors duration-150 hover:bg-surface-muted",
              "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent",
            )}
          >
            {environmentOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label} ({option.region})
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="project-description"
            className="mb-1.5 block text-[12px] font-medium text-text-primary"
          >
            Description
          </label>

          <textarea
            id="project-description"
            rows={3}
            value={description}
            onChange={(event) => {
              setDescription(event.target.value);
              setError("");
            }}
            placeholder="Brief description of this API service..."
            className={cn(
              "min-h-[80px] w-full resize-y rounded-md border border-border-default bg-surface px-3 py-2 text-[12px] leading-5 text-text-primary",
              "placeholder:text-text-secondary/70",
              "transition-colors duration-150 hover:border-border-default",
              "focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent",
            )}
          />

          <p className="mt-1.5 text-[11px] leading-4 text-text-secondary">
            Optional. Keep it short and focused on the service purpose.
          </p>
        </div>

        {/* Validation message */}
        {error && (
          <div
            id="project-form-error"
            role="alert"
            className="border-l-2 border-danger bg-danger/[0.04] px-3 py-2 text-[12px] leading-4 text-danger"
          >
            {error}
          </div>
        )}
      </form>
    </Modal>
  );
};
