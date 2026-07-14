"use client";

import { useState } from "react";

export function useMeals() {
  const [loading, setLoading] = useState(false);

  async function saveMeal() {}

  async function loadMeals() {}

  async function deleteMeal() {}

  return {
    loading,
    saveMeal,
    loadMeals,
    deleteMeal,
  };
}