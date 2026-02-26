import TreeView from "../components/TreeView";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight mb-1">Tree View</h1>
        <p className="text-sm ">
          Click badges to expand · Double-click to rename · Drag to reorder
        </p>
      </div>
      <TreeView />
    </div>
  );
};

export default Index;
