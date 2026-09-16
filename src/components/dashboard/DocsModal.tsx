import React from "react";
import { Modal } from "../ui/Modal";
import { Button } from "../ui/Button";
import { BookOpen, ExternalLink } from "lucide-react";

interface DocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocsModal: React.FC<DocsModalProps> = ({ isOpen, onClose }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="API Gateway Documentation"
      description="Quick reference guide for ingress proxy routing, telemetry, and headers."
      footer={
        <Button variant="primary" size="sm" onClick={onClose}>
          Close Documentation
        </Button>
      }
    >
      <div className="space-y-4 text-[13px] text-[#58605B]">
        <div>
          <h4 className="font-semibold text-[#181C1A] mb-1">Standard Telemetry Headers</h4>
          <p className="text-[12px] mb-2">
            Every ingress request processed through the edge cluster automatically annotates upstream responses with these headers:
          </p>
          <div className="bg-[#F0F1EE] p-2.5 rounded border border-[#D9DDD7] font-mono text-[11px] space-y-1 text-[#181C1A]">
            <div><span className="text-[#265344] font-medium">X-Request-ID:</span> Unique UUIDv4 trace identifier</div>
            <div><span className="text-[#265344] font-medium">X-Gateway-Latency:</span> Total edge transit duration (ms)</div>
            <div><span className="text-[#265344] font-medium">X-Edge-Node:</span> Active ingress cluster node region</div>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-[#181C1A] mb-1">Circuit Breaker Semantics</h4>
          <p className="text-[12px]">
            When an upstream service breaches 1,800ms for &gt;5 consecutive probes, the gateway temporarily isolates the node and returns HTTP 503 Service Unavailable with backoff headers.
          </p>
        </div>
      </div>
    </Modal>
  );
};
