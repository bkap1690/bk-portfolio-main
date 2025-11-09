import { useParams, Link } from "react-router-dom";
import { WasatchDashboard } from "./prototypes/wasatch";

// This page houses interactive prototypes for design showcasing
// Access via: /prototypes/:prototypeId

export default function Prototypes() {
  const { prototypeId } = useParams<{ prototypeId: string }>();

  // Route to specific prototype based on ID
  const renderPrototype = () => {
    switch (prototypeId) {
      case "wasatch-dashboard":
        return <WasatchDashboard />;
      case "example":
        return <ExamplePrototype />;
      // Add more prototype cases here as they're created
      default:
        return <PrototypeList />;
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      {renderPrototype()}
    </div>
  );
}

// List of available prototypes (only shown when no specific prototype is selected)
function PrototypeList() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-text dark:text-text">
        Interactive Prototypes
      </h1>
      <p className="text-text dark:text-text mb-8">
        This page houses interactive prototypes for design showcasing. Select a prototype below:
      </p>
      <div className="space-y-4">
        <PrototypeCard
          id="wasatch-dashboard"
          title="Wasatch BioLabs LIMS Dashboard"
          description="Interactive prototype of the Laboratory Information Management System dashboard"
        />
        <PrototypeCard
          id="example"
          title="Example Prototype"
          description="A sample prototype structure"
        />
        {/* Add more prototype cards as they're created */}
      </div>
    </div>
  );
}

// Card component for prototype list
function PrototypeCard({
  id,
  title,
  description,
}: {
  id: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      to={`/prototypes/${id}`}
      className="block p-6 border border-border dark:border-border rounded-lg hover:bg-accent dark:hover:bg-accent transition-colors"
    >
      <h2 className="text-2xl font-semibold mb-2 text-text dark:text-text">
        {title}
      </h2>
      <p className="text-text dark:text-text opacity-80">{description}</p>
    </Link>
  );
}

// Example prototype component - replace this with actual prototype implementations
function ExamplePrototype() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="mb-8">
        <Link
          to="/prototypes"
          className="text-text dark:text-text hover:underline"
        >
          ← Back to prototypes
        </Link>
      </div>
      <h1 className="text-4xl font-bold mb-8 text-text dark:text-text">
        Example Prototype
      </h1>
      <div className="bg-card dark:bg-card p-8 rounded-lg">
        <p className="text-text dark:text-text">
          This is a placeholder for the interactive prototype. Replace this
          component with your actual design implementation.
        </p>
      </div>
    </div>
  );
}

