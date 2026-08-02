import Memory from "../models/Memory.js";

export async function getMemory(userId) {
  let memory = await Memory.findOne({ user: userId });

  if (!memory) {
    memory = await Memory.create({
      user: userId,
    });
  }

  return memory;
}

export async function saveMemory(userId, updates) {
  const memory = await getMemory(userId);

  Object.assign(memory, updates);

  await memory.save();

  return memory;
}