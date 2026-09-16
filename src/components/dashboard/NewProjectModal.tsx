import React, { useState } from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import type { Project } from "../../types/project";

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (project: Partial<Project>) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
}) => {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [environment, setEnvironment] = useState("production");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateProject({
      name: name.trim(),
      slug: slug.trim() || name.toLowerCase().replace(/\s+/g, "-"),
      environment,
      description: description.trim() || "Microservice gateway endpoint.",
      status: "healthy",
      requestsTotal: 0,
      errorRate: 0.0,
      avgLatency: 45,
      healthProbesPassing: true,
      activeVersion: "v1.0.0",
      lastDeployed: "Just now",
    });

    setName("");
    setSlug("");
    setDescription("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Project"
      description="Provision a new microservice proxy or API gateway endpoint."
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit}>
            Create Project
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-[13px]">
        <div>
          <label className="block font-medium text-[#181C1A] mb-1">
            Project Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (!slug) {
                setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"));
              }
            }}
            placeholder="e.g. Billing Microservice"
            className="w-full h-8 px-3 text-[12px] bg-white border border-[#D9DDD7] rounded-md focus:outline-none focus:border-[#265344]"
          />
        </div>

        <div>
          <label className="block font-medium text-[#181C1A] mb-1">
            Endpoint Slug
          </label>
          <input
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="e.g. billing-svc"
            className="w-full h-8 px-3 text-[12px] font-mono bg-white border border-[#D9DDD7] rounded-md focus:outline-none focus:border-[#265344]"
          />
        </div>

        <div>
          <label className="block font-medium text-[#181C1A] mb-1">
            Environment
          </label>
          <select
            value={environment}
            onChange={(e) => setEnvironment(e.target.value)}
            className="w-full h-8 px-2.5 text-[12px] bg-white border border-[#D9DDD7] rounded-md focus:outline-none focus:border-[#265344]"
          >
            <option value="production">Production (us-east-1)</option>
            <option value="staging">Staging (us-west-2)</option>
            <option value="eu-production">Production (eu-central-1)</option>
          </select>
        </div>

        <div>
          <label className="block font-medium text-[#181C1A] mb-1">
            Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Brief description of this API service..."
            className="w-full p-2.5 text-[12px] bg-white border border-[#D9DDD7] rounded-md focus:outline-none focus:border-[#265344]"
          />
        </div>
      </form>
    </Modal>
  );
};
