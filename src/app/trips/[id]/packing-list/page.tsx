import React from "react";

function PackingListPage() {
  return (
    <main className="flex min-h-full flex-col items-center justify-center">
      <h1 className="text-2xl font-bold">Packing List</h1>
      <p className="text-gray-500">
        This is where you can manage your packing list.
      </p>
      <button className="btn btn-primary">Add Item</button>
    </main>
  );
}

export default PackingListPage;
