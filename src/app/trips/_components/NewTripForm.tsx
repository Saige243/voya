"use client";

import React, { useState } from "react";
import { Button } from "~/app/_components/Button";
import { api } from "~/trpc/server";
import { redirect } from "next/navigation";

const NewTripForm = ({ userId }: { userId: string }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const createTrip = api.trip.create;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating trip...", { title, description, startDate, endDate });
    // const newTrip = {
    //   title,
    //   description,
    //   startDate: new Date(startDate),
    //   endDate: new Date(endDate),
    // };
    // try {
    //   await createTrip(newTrip);
    //   redirect("/trips");
    // } catch (error) {
    //   console.error("Failed to create trip:", error);
    // }
  };

  return (
    <form onSubmit={handleSubmit} className="text-black">
      <div>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="startDate">Start Date:</label>
        <input
          type="date"
          id="startDate"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="endDate">End Date:</label>
        <input
          type="date"
          id="endDate"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          required
        />
      </div>
      <Button type="submit">Create Trip</Button>
    </form>
  );
};

export default NewTripForm;
